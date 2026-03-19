import { useChat } from "@ai-sdk/react";
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
      return messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: new Date(m.createdAt || new Date()),
      }));
    } catch (error) {
      console.error("Failed to fetch session messages:", error);
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const { messages, setMessages, status, sendMessage } = useChat({});

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

  // Sync to backend when a chat completes
  useEffect(() => {
    if (
      !token ||
      status === "streaming" ||
      status === "submitted" ||
      messages.length === 0
    ) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role === "assistant" &&
      lastMessage.id !== lastSyncedMessageId
    ) {
      setLastSyncedMessageId(lastMessage.id);

      const payload = {
        sessionId,
        messages,
      };

      fetchClient<{ sessionId: string; success: boolean; guest?: boolean }>(
        API_ENDPOINTS.AI_CHAT.SYNC,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      )
        .then((res) => {
          if (!res.guest && res.sessionId && res.sessionId !== sessionId) {
            setSessionId(res.sessionId);
            // Refresh list to show new session
            fetchRecentSessions();
          } else if (!res.guest) {
            fetchRecentSessions();
          }
        })
        .catch((err) => console.error("Failed to sync chat:", err));
    }
  }, [
    messages,
    status,
    sessionId,
    token,
    lastSyncedMessageId,
    fetchRecentSessions,
  ]);

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
        setMessages(msgs as unknown as Parameters<typeof setMessages>[0]);
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
