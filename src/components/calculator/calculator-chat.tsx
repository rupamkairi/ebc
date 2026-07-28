"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAiCalculator } from "@/hooks/use-ai-calculator";
import { useLanguage } from "@/hooks/useLanguage";
import { HistorySidebar } from "./history-sidebar";
import { MessageList } from "@/components/ai/message-list";
import { MessageInput } from "@/components/ai/message-input";
import { IconMenu2, IconPlus } from "@tabler/icons-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CalculatorChat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useLanguage();
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
    deleteSession,
    deletingSessionId,
  } = useAiCalculator();

  const handleSelectSession = (id: string) => {
    loadSession(id);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    startNewChat();
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      toast.success("Conversation deleted");
    } catch {
      toast.error("Could not delete conversation");
      throw new Error("Conversation deletion failed");
    }
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
              onDeleteSession={handleDeleteSession}
              deletingSessionId={deletingSessionId}
              disableDelete={isLoading}
              className="w-full"
            />
          </SheetContent>
        </Sheet>
        <h1 className="text-sm font-semibold text-primary">
          {t("ai_calculator_chat_title")}
        </h1>
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
        onDeleteSession={handleDeleteSession}
        deletingSessionId={deletingSessionId}
        disableDelete={isLoading}
        className="hidden md:flex w-64 border-r border-border shrink-0"
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 min-h-0 flex-col relative overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6 size-32 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-primary/10 sm:size-40">
              <Image
                src="/images/nasir-chatbot.png"
                alt={t("ai_calculator_assistant_alt")}
                fill
                priority
                sizes="(min-width: 640px) 160px, 128px"
                className="object-cover"
              />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-primary">
              {t("ai_calculator_assistant_title")}
            </h1>
            <p className="max-w-md text-muted-foreground">
              {t("ai_calculator_assistant_intro")}
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
