import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconSend } from "@tabler/icons-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
}

export function MessageInput({ input, handleInputChange, handleSubmit, isLoading }: MessageInputProps) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      const form = e.currentTarget.form;
      if (form) {
        // Use requestSubmit if available, otherwise manual dispatch
        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        } else {
          // Fallback for older browsers if needed, though Next.js usually targets modern
          const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
          form.dispatchEvent(submitEvent);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
      <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] resize-none pr-12 focus-visible:ring-primary"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input?.trim()}
          className="absolute right-2 bottom-2 h-8 w-8 rounded-lg transition-all"
        >
          <IconSend size={18} />
        </Button>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        AI Calculator can make mistakes. Check important info.
      </p>
    </form>
  );
}
