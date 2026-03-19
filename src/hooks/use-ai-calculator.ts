import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface ChatSession {
  id: string;
  title?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "data" | string;
  content: string;
  createdAt?: string | Date;
  sessionId?: string;
}

const getTextFromParts = (parts?: UIMessage["parts"]) => {
  if (!parts || !Array.isArray(parts)) return "";
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
};

const toUiMessage = (message: ChatMessage): UIMessage => ({
  id: message.id,
  role:
    message.role === "assistant" ||
    message.role === "user" ||
    message.role === "system"
      ? message.role
      : "assistant",
  parts: message.content
    ? [
        {
          type: "text",
          text: message.content,
        },
      ]
    : [],
});

const toSyncMessage = (message: UIMessage) => ({
  id: message.id,
  role: message.role,
  content: getTextFromParts(message.parts),
});

const getLastUserAssistantPair = (messages: UIMessage[]) => {
  let assistant: UIMessage | undefined;
  let user: UIMessage | undefined;

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    if (!assistant && msg.role === "assistant") {
      assistant = msg;
      continue;
    }
    if (assistant && msg.role === "user") {
      user = msg;
      break;
    }
  }

  return { user, assistant };
};

export function useAiCalculator(initialSessionId?: string) {
  const { token } = useAuthStore();
  const [sessionId, setSessionId] = useState<string | undefined>(
    initialSessionId,
  );
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState("");
  const [lastSyncedMessageId, setLastSyncedMessageId] = useState<string | null>(
    null,
  );

  // Fetch session history if sessionId is provided
  const fetchSessionMessages = useCallback(async (id: string) => {
    setIsLoadingHistory(true);
    try {
      const messages = await fetchClient<ChatMessage[]>(
        `/ai-chat/sessions/${id}`,
      );
      return messages.map(toUiMessage);
    } catch (error) {
      console.error("Failed to fetch session messages:", error);
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchRecentSessions = useCallback(async () => {
    if (!token) return;
    try {
      const sessions = await fetchClient<ChatSession[]>(
        API_ENDPOINTS.AI_CHAT.SESSION,
      );
      setHistory(sessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  }, [token]);

  const handleFinish = useCallback(
    (event: {
      message: UIMessage;
      messages: UIMessage[];
      isAbort: boolean;
      isDisconnect: boolean;
      isError: boolean;
    }) => {
      if (!token || event.isAbort || event.isError || event.isDisconnect) {
        return;
      }

      if (event.message.role !== "assistant") {
        return;
      }

      if (event.message.id === lastSyncedMessageId) {
        return;
      }

      setLastSyncedMessageId(event.message.id);

      const { user, assistant } = getLastUserAssistantPair(event.messages);
      const syncMessages = [user, assistant]
        .filter(Boolean)
        .map((msg) => toSyncMessage(msg as UIMessage))
        .filter((msg) => msg.content.trim().length > 0);

      if (syncMessages.length === 0) {
        return;
      }

      const payload = { sessionId, messages: syncMessages };

      fetchClient<{ sessionId: string; success: boolean; guest?: boolean }>(
        API_ENDPOINTS.AI_CHAT.SYNC,
        {
          method: "POST",
          body: payload,
        },
      )
        .then((res) => {
          if (!res.guest && res.sessionId && res.sessionId !== sessionId) {
            setSessionId(res.sessionId);
            fetchRecentSessions();
          } else if (!res.guest) {
            fetchRecentSessions();
          }
        })
        .catch((err) => console.error("Failed to sync chat:", err));
    },
    [
      token,
      sessionId,
      lastSyncedMessageId,
      fetchRecentSessions,
      setSessionId,
    ],
  );

  const { messages, setMessages, status, sendMessage } = useChat({
    onFinish: handleFinish,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!input.trim()) return;

      const currentInput = input;
      setInput("");

      try {
        // In SDK v6, sendMessage takes { text: string } for simple text messages
        await sendMessage({ text: currentInput });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [input, sendMessage],
  );

  // Load initial messages if sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchSessionMessages(sessionId).then((msgs) => {
        setMessages(msgs);
      });
    } else {
      setMessages([]);
    }
  }, [sessionId, fetchSessionMessages, setMessages]);

  useEffect(() => {
    fetchRecentSessions();
  }, [fetchRecentSessions]);

  const startNewChat = useCallback(() => {
    setSessionId(undefined);
    setMessages([]);
  }, [setMessages]);

  const loadSession = useCallback((id: string) => {
    setSessionId(id);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: status === "streaming" || status === "submitted",
    sessionId,
    history,
    isLoadingHistory,
    startNewChat,
    loadSession,
    fetchRecentSessions,
  };
}
