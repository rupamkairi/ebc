import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import fs from "node:fs/promises";
import path from "node:path";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const runtime = "nodejs";

const GENERATION_TIMEOUT_MS = 10_000;
const MAX_OUTPUT_TOKENS = 256;

const LOG_PATH = path.join(process.cwd(), ".logs", "ai-chat.log");
const SERVER_API_BASE_RAW =
  process.env.EBC_SERVER_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:10000/api";
const SERVER_API_BASE = SERVER_API_BASE_RAW.endsWith("/api")
  ? SERVER_API_BASE_RAW
  : `${SERVER_API_BASE_RAW.replace(/\/$/, "")}/api`;

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

type IncomingMessage = {
  role?: string;
  content?: unknown;
  parts?: Array<{ type?: string; text?: string }>;
};

const NO_KNOWLEDGE_RESPONSE = "I don't know from the current knowledge base.";

const buildBaseSystemPrompt = () =>
  [
    "You are EBC AI Calculator assistant.",
    "Use plain markdown only.",
    "Do not output LaTeX wrappers such as \\boxed{}, \\text{}, \\[...\\], or \\(...\\).",
    "For questions about calculator knowledge, uploaded documents, or sample guides, answer only from the Knowledge Context below.",
    `If the exact answer is not explicitly present in context, reply exactly: ${NO_KNOWLEDGE_RESPONSE}`,
    "Do not guess, infer, or use outside knowledge for grounded questions.",
    "When context contains a number, ratio, currency, or unit, copy it exactly as written in context.",
    "If context supports the answer, keep it short and end with a single line `Sources: [#n, #m]` using the same source numbers.",
  ].join("\n");

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
    "Knowledge Context:",
    context || "(no relevant knowledge retrieved)",
    "",
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

const extractTextFromParts = (parts?: IncomingMessage["parts"]) => {
  if (!parts || !Array.isArray(parts)) return "";
  return parts
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("");
};

const normalizeIncomingMessage = (msg: IncomingMessage) => {
  if (msg.role !== "user" && msg.role !== "assistant" && msg.role !== "system") {
    return null;
  }

  let content = "";
  if (typeof msg.content === "string") {
    content = msg.content;
  } else if (msg.content != null) {
    content = String(msg.content);
  } else if (msg.parts) {
    content = extractTextFromParts(msg.parts);
  }

  const trimmed = content.trim();
  if (!trimmed) return null;

  return { role: msg.role, content: trimmed };
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
    const incomingMessages = body.messages as IncomingMessage[];

    await appendLog({
      requestId,
      event: "request",
      messageCount: messages.length,
      lastRole: messages[messages.length - 1]?.role,
    });

    const latestUserQuery = [...incomingMessages]
      .reverse()
      .map(normalizeIncomingMessage)
      .find((msg) => msg?.role === "user")?.content;

    const retrievalItems =
      typeof latestUserQuery === "string" && latestUserQuery.trim()
        ? await fetchKnowledgeContext(latestUserQuery)
        : [];

    const coreMessages = await convertToModelMessages(
      messages.map(({ id: _id, ...rest }) => rest),
    );

    if (retrievalItems.length > 0) {
      coreMessages.unshift(
        { role: "system", content: buildBaseSystemPrompt() },
        { role: "system", content: buildRagSystemPrompt(retrievalItems) },
      );
    } else {
      coreMessages.unshift({ role: "system", content: buildBaseSystemPrompt() });
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
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      maxRetries: 0,
      temperature: 0,
      stopSequences: ["<tool-search>"],
      timeout: GENERATION_TIMEOUT_MS,
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
      onAbort: async (event) => {
        await appendLog({
          requestId,
          event: "stream_abort",
          stepCount: event.steps.length,
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
