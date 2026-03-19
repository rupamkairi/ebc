import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, type UIMessage } from "ai";
import fs from "node:fs/promises";
import path from "node:path";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTE_API_KEY,
});

export const runtime = "nodejs";

const LOG_PATH = path.join(process.cwd(), ".logs", "ai-chat.log");

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

    const result = streamText({
      model: openrouter("openai/gpt-oss-20b:free"),
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
