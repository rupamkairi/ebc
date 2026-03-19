"use client";

import React from "react";
import { useAiCalculator } from "@/hooks/use-ai-calculator";
import { HistorySidebar } from "./history-sidebar";
import { MessageList } from "@/components/ai/message-list";
import { MessageInput } from "@/components/ai/message-input";
import { IconRobot } from "@tabler/icons-react";

export function CalculatorChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    sessionId,
    history,
    isLoadingHistory,
    startNewChat,
    loadSession,
  } = useAiCalculator();

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        currentSessionId={sessionId}
        onSelectSession={loadSession}
        onNewChat={startNewChat}
        isLoading={isLoadingHistory}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col relative">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6 text-primary">
              <IconRobot size={48} />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-primary">AI Calculator</h1>
            <p className="max-w-md text-muted-foreground">
              Hello! I'm your AI Calculator assistant. I can help you with precast system estimations, 
              cost calculations, and technical advice. How can I assist you today?
            </p>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}

        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
