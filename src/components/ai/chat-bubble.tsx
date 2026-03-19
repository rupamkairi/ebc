import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconRobot, IconUser } from "@tabler/icons-react";

interface ChatBubbleProps {
  role: string;
  parts: any[];
}

export function ChatBubble({ role, parts }: ChatBubbleProps) {
  const isAssistant = role === "assistant";
  
  // Extract text from parts
  const textContent = parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 py-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 border border-border">
        {isAssistant ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <IconRobot size={18} />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <IconUser size={18} />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm",
          isAssistant
            ? "bg-card border border-border text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{textContent}</div>
      </div>
    </div>
  );
}
