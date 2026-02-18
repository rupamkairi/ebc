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
  Paperclip,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface SupportChatProps {
  ticketId: string;
}

export function SupportChat({ ticketId }: SupportChatProps) {
  const { data: ticket, isLoading } = useSupportQueryDetailsQuery(ticketId);
  const addMessageMutation = useAddSupportMessageMutation(ticketId);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const userState = useAuthStore((state) => state.user);
  const currentUserId = userState?.id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.conversations, isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await addMessageMutation.mutateAsync({ message });
      setMessage("");
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
          {/* Ticket Description as the first message */}
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-muted p-3 rounded-2xl rounded-tl-none text-xs">
              <p className="font-semibold mb-1">Issue Description:</p>
              <p>{ticket?.description}</p>
              <span className="text-[10px] text-muted-foreground mt-2 block opacity-70">
                {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleTimeString() : ""}
              </span>
            </div>
          </div>

          {/* Conversation Thread */}
          {ticket?.conversations?.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-xs shadow-sm",
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-background border rounded-tl-none"
                )}>
                  <p>{msg.message}</p>
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
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border focus-within:border-primary transition-colors">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button 
            size="icon" 
            className="h-10 w-10 rounded-xl"
            disabled={!message.trim() || addMessageMutation.isPending}
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
