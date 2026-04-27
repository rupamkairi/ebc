"use client";

import React, { useState } from "react";
import { useAiCalculator } from "@/hooks/use-ai-calculator";
import { HistorySidebar } from "./history-sidebar";
import { MessageList } from "@/components/ai/message-list";
import { MessageInput } from "@/components/ai/message-input";
import { IconRobot, IconMenu2, IconPlus } from "@tabler/icons-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function CalculatorChat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleSelectSession = (id: string) => {
    loadSession(id);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    startNewChat();
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-96px)] w-full flex-col md:flex-row overflow-hidden bg-background">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b px-4 py-2 md:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <IconMenu2 size={20} />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetTitle className="sr-only">Chat History</SheetTitle>
            <HistorySidebar
              history={history}
              currentSessionId={sessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              isLoading={isLoadingHistory}
              className="w-full"
            />
          </SheetContent>
        </Sheet>
        <h1 className="text-sm font-semibold text-primary">AI Calculator</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleNewChat}
        >
          <IconPlus size={20} />
          <span className="sr-only">New Chat</span>
        </Button>
      </div>

      {/* History Sidebar - Desktop */}
      <HistorySidebar
        history={history}
        currentSessionId={sessionId}
        onSelectSession={loadSession}
        onNewChat={startNewChat}
        isLoading={isLoadingHistory}
        className="hidden md:flex w-64 border-r border-border shrink-0"
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 min-h-0 flex-col relative overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6 text-primary">
              <IconRobot size={48} />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-primary">
              AI Calculator
            </h1>
            <p className="max-w-md text-muted-foreground">
              Hello! I&apos;m your AI Calculator assistant. I can help you with
              precast system estimations, cost calculations, and technical
              advice. How can I assist you today?
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
