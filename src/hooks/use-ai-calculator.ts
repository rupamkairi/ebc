import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import fetchClient from "@/lib/api-client";

export function useAiCalculator(initialSessionId?: string) {
  const { token } = useAuthStore();
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState("");

  // Fetch session history if sessionId is provided
  const fetchSessionMessages = useCallback(async (id: string) => {
    setIsLoadingHistory(true);
    try {
      const messages = await fetchClient<any[]>(`/ai-chat/sessions/${id}`);
      return messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: new Date(m.createdAt),
      }));
    } catch (error) {
      console.error("Failed to fetch session messages:", error);
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const { messages, setMessages, status, sendMessage } = useChat({
    // @ts-ignore - v6 type compatibility
    api: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api"}/ai-chat/stream`,
    body: {
      sessionId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onResponse: (response: Response) => {
      // Check for a new session ID in the headers
      const newSessionId = response.headers.get("x-ai-session-id");
      if (newSessionId) {
        setSessionId(newSessionId);
        // Refresh history list since a new session was started
        fetchRecentSessions();
      }
    },
    onFinish: () => {
       // Refresh history list to update titles/timestamps
       fetchRecentSessions();
    }
  } as any);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!input.trim()) return;
    
    const currentInput = input;
    setInput("");
    
    try {
      // In SDK v6, sendMessage takes { text: string } for simple text messages
      await sendMessage({ text: currentInput } as any);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [input, sendMessage]);

  // Load initial messages if sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchSessionMessages(sessionId).then((msgs) => {
        setMessages(msgs as any);
      });
    } else {
      setMessages([]);
    }
  }, [sessionId, fetchSessionMessages, setMessages]);

  const fetchRecentSessions = useCallback(async () => {
    if (!token) return;
    try {
      const sessions = await fetchClient<any[]>("/ai-chat/sessions");
      setHistory(sessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  }, [token]);

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
    fetchRecentSessions
  };
}
