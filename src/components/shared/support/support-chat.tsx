"use client";

import { useState, useEffect, useRef } from "react";
import { 
  useSupportQueryDetailsQuery, 
  useAddSupportMessageMutation 
} from "@/queries/supportQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  Send, 
  ShieldCheck, 
  FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { PendingSupportAttachment, SupportAttachmentPicker } from "./support-attachment-picker";

interface SupportChatProps {
  ticketId: string;
  readOnly?: boolean;
}

export function SupportChat({ ticketId, readOnly = false }: SupportChatProps) {
  const { data: ticket, isLoading } = useSupportQueryDetailsQuery(ticketId);
  const addMessageMutation = useAddSupportMessageMutation(ticketId);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<PendingSupportAttachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userState = useAuthStore((state) => state.user);
  const currentUserId = userState?.id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.conversations, isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;
    try {
      await addMessageMutation.mutateAsync({
        message: message.trim() || undefined,
        attachments: attachments.map(({ mediaId, documentId }) => ({ mediaId, documentId })),
      });
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  const interactionDisabled = readOnly || !!ticket?.archivedAt || ticket?.status === "CLOSED";

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Chat header info */}
      <div className="bg-muted/30 p-3 rounded-lg mb-4 border border-primary/10">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-[10px]">{ticket?.category?.name}</Badge>
          <Badge className={cn(
            "text-[10px]",
            ticket?.status === "RESOLVED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          )}>{ticket?.status}</Badge>
        </div>
        <h4 className="font-semibold text-sm mb-1">{ticket?.subject}</h4>
        {ticket?.assignedTo && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span>Assigned to: {ticket.assignedTo.name}</span>
          </div>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {!ticket?.conversations?.some((item) => item.message === ticket.description) && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-muted p-3 text-xs">
                <p className="font-semibold mb-1">Issue Description:</p>
                <p>{ticket?.description}</p>
              </div>
            </div>
          )}
          {/* Conversation Thread */}
          {ticket?.conversations?.map((msg) => {
            const isMe = currentUserId ? msg.senderId === currentUserId : !!msg.isGuest;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-xs shadow-sm",
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-background border rounded-tl-none"
                )}>
                  {msg.message && <p>{msg.message}</p>}
                  {msg.attachments && msg.attachments.length > 0 && <div className="mt-2 grid gap-2">
                    {msg.attachments.map((attachment) => attachment.media ? (
                      <a key={attachment.id} href={attachment.media.url} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={attachment.media.url} alt="Support attachment" className="max-h-48 w-full rounded-lg object-cover" />
                      </a>
                    ) : attachment.document ? (
                      <a key={attachment.id} href={attachment.document.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md border bg-background/80 p-2 text-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{attachment.document.key?.split("/").pop() || "Open document"}</span>
                      </a>
                    ) : null)}
                  </div>}
                  <span className={cn(
                    "text-[10px] mt-2 block opacity-70",
                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="pt-4 border-t mt-auto">
        {interactionDisabled && <p className="mb-2 text-center text-xs text-muted-foreground">{ticket?.archivedAt ? "This deleted ticket is read-only." : "This ticket is closed."}</p>}
        {!interactionDisabled && <SupportAttachmentPicker value={attachments} onChange={setAttachments} disabled={addMessageMutation.isPending} />}
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border focus-within:border-primary transition-colors">
          <Input 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={interactionDisabled}
          />
          <Button 
            size="icon" 
            className="h-10 w-10 rounded-xl"
            disabled={interactionDisabled || (!message.trim() && attachments.length === 0) || addMessageMutation.isPending}
            onClick={handleSendMessage}
          >
            {addMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
