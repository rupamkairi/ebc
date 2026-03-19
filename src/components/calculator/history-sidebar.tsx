import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconPlus, IconMessage, IconHistory } from "@tabler/icons-react";

interface HistorySidebarProps {
  history: any[];
  currentSessionId?: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}

export function HistorySidebar({
  history,
  currentSessionId,
  onSelectSession,
  onNewChat,
  isLoading
}: HistorySidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar shrink-0">
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <IconPlus size={18} />
          New Chat
        </Button>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
         <IconHistory size={14} />
         RECENT CHATS
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-1 py-2">
          {isLoading && (
             <div className="p-4 space-y-2">
                <div className="h-8 animate-pulse rounded bg-muted" />
                <div className="h-8 animate-pulse rounded bg-muted" />
             </div>
          )}
          
          {!isLoading && history.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No chat history yet
            </div>
          )}

          {history.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                currentSessionId === session.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <IconMessage size={16} className="shrink-0 opacity-70" />
              <span className="truncate">{session.title || "Untitled Chat"}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
