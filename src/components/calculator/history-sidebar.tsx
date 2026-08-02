import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IconPlus,
  IconMessage,
  IconHistory,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HistorySession {
  id: string;
  title?: string;
}

interface HistorySidebarProps {
  history: HistorySession[];
  currentSessionId?: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => Promise<void>;
  deletingSessionId?: string | null;
  disableDelete?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function HistorySidebar({
  history,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  deletingSessionId,
  disableDelete,
  isLoading,
  className,
}: HistorySidebarProps) {
  const [pendingDelete, setPendingDelete] = useState<HistorySession | null>(
    null,
  );
  return (
    <div className={cn("flex h-full flex-col bg-sidebar", className)}>
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
            <div
              key={session.id}
              className={cn(
                "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_1.75rem] items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                currentSessionId === session.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <button
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                onClick={() => onSelectSession(session.id)}
              >
                <IconMessage size={16} className="shrink-0 opacity-70" />
                <span className="block min-w-0 truncate">
                  {session.title || "Untitled Chat"}
                </span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Chat actions"
                  >
                    <IconDots size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={disableDelete || deletingSessionId === session.id}
                    onSelect={() => setPendingDelete(session)}
                  >
                    <IconTrash size={16} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title || "Untitled Chat"}” and all of its
              messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingDelete || !!deletingSessionId}
              className="bg-destructive hover:bg-destructive/90"
              onClick={async (event) => {
                event.preventDefault();
                if (!pendingDelete) return;
                try {
                  await onDeleteSession(pendingDelete.id);
                  setPendingDelete(null);
                } catch {
                  // Keep the dialog open so the user can retry.
                }
              }}
            >
              {deletingSessionId ? "Deleting..." : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
