import React, { useRef, useEffect } from "react";
import { type UIMessage as Message } from "@ai-sdk/react";
import { ChatBubble } from "./chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const viewport = scrollRef.current.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLDivElement | null;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 min-h-0 px-4" ref={scrollRef}>
      <div className="flex flex-col gap-2 py-4 pb-24">
        {messages.map((message) => (
          <ChatBubble key={message.id} role={message.role} parts={message.parts} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex w-full items-start gap-3 py-4">
               <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
               <div className="h-12 w-[60%] animate-pulse rounded-xl bg-muted" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
