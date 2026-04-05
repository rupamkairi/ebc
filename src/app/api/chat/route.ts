import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, type UIMessage } from "ai";
import fs from "node:fs/promises";
import path from "node:path";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const runtime = "nodejs";

const LOG_PATH = path.join(process.cwd(), ".logs", "ai-chat.log");
const SERVER_API_BASE_RAW =
  process.env.EBC_SERVER_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:10000/api";
const SERVER_API_BASE = SERVER_API_BASE_RAW.endsWith("/api")
  ? SERVER_API_BASE_RAW
  : `${SERVER_API_BASE_RAW.replace(/\\/$/, "")}/api`;

function truncate(text: string, max = 2000) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

async function appendLog(entry: Record<string, unknown>) {
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      ...entry,
    });
    await fs.appendFile(LOG_PATH, `${line}\n`, "utf8");
  } catch (error) {
    console.error("Failed to write AI chat log:", error);
  }
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

type RetrievalItem = {
  chunkId: string;
  sourceId: string;
  content: string;
  chunkIndex: number;
  tokenCount: number;
  score: number;
  documentId?: string | null;
  mediaId?: string | null;
  sourceMimeType?: string | null;
};

const buildRagSystemPrompt = (items: RetrievalItem[]) => {
  const context = items
    .slice(0, 8)
    .map((item, index) => {
      const sourceLabel = item.documentId
        ? `document:${item.documentId}`
        : item.mediaId
          ? `media:${item.mediaId}`
          : `source:${item.sourceId}`;
      return `[#${index + 1} ${sourceLabel}] ${truncate(item.content, 1200)}`;
    })
    .join("\n\n");

  return [
    "You are EBC AI Calculator assistant.",
    "Use the knowledge context below when it is relevant.",
    "If context is insufficient, clearly say you do not have enough information and continue with best-effort general guidance.",
    "When using context facts, end with a single line `Sources: [#n, #m]` using the same source numbers.",
    "",
    "Knowledge Context:",
    context,
  ].join("\n");
};

const fetchKnowledgeContext = async (query: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${SERVER_API_BASE}/ai-knowledge/retrieve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        query,
        topK: 6,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json().catch(() => ({}))) as {
      items?: RetrievalItem[];
    };

    return Array.isArray(payload.items) ? payload.items : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

export async function POST(req: Request) {
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.messages)) {
      await appendLog({
        requestId,
        event: "bad_request",
        bodyType: typeof body,
      });
      return new Response(
        JSON.stringify({ error: "Missing or invalid messages array." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const messages = body.messages as UIMessage[];

    await appendLog({
      requestId,
      event: "request",
      messageCount: messages.length,
      lastRole: messages[messages.length - 1]?.role,
    });

    // Map UI messages to Core messages, extracting text from parts if needed
    const coreMessages = messages.map(
      (msg: {
        role: string;
        content?: string;
        parts?: { text: string }[];
      }) => ({
        role: msg.role,
        content:
          msg.content ||
          (msg.parts ? msg.parts.map((p) => p.text).join("") : ""),
      }),
    );

    const latestUserQuery = [...coreMessages]
      .reverse()
      .find((msg) => msg.role === "user")?.content;

    const retrievalItems =
      typeof latestUserQuery === "string" && latestUserQuery.trim()
        ? await fetchKnowledgeContext(latestUserQuery)
        : [];

    if (retrievalItems.length > 0) {
      coreMessages.unshift({
        role: "system",
        content: buildRagSystemPrompt(retrievalItems),
      });
    }

    await appendLog({
      requestId,
      event: "retrieval",
      queryLength:
        typeof latestUserQuery === "string" ? latestUserQuery.length : 0,
      contextCount: retrievalItems.length,
    });

    const result = streamText({
      model: openrouter("openrouter/free"),
      messages: coreMessages,
      // You can add additional system messages or configurations here
      onFinish: async (event) => {
        await appendLog({
          requestId,
          event: "finish",
          model: event.model?.modelId,
          finishReason: event.finishReason,
          usage: event.usage,
          text: truncate(event.text ?? ""),
        });
      },
      onError: async (event) => {
        await appendLog({
          requestId,
          event: "stream_error",
          error: serializeError(event.error),
        });
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
    });
  } catch (error) {
    await appendLog({
      requestId,
      event: "handler_error",
      error: serializeError(error),
    });
    console.error("AI stream error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
