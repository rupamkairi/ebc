import React from "react";
import { useAiCalculator } from "@/hooks/use-ai-calculator";
import { MessageList } from "@/components/ai/message-list";
import { MessageInput } from "@/components/ai/message-input";
import { IconRobot } from "@tabler/icons-react";

export function AICalculator() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useAiCalculator();

  return (
    <div className="flex flex-col h-[500px] w-full bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4 text-primary animate-pulse">
            <IconRobot size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-primary italic uppercase tracking-widest text-xs">
              Precision AI Assistant
            </h3>
            <p className="max-w-xs text-xs font-bold text-muted-foreground/60 italic leading-relaxed">
              Describe your project requirements here to get an estimated cost and technical advice.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-white/50 flex items-center gap-2">
            <IconRobot size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Active Session</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <MessageList messages={messages} isLoading={isLoading} />
          </div>
        </div>
      )}

      <div className="p-4 bg-white border-t border-slate-100">
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Ask about project costs, materials, or timelines..."
          className="bg-slate-50 border-none shadow-none ring-1 ring-slate-200 focus-within:ring-primary/20 transition-all rounded-xl"
        />
      </div>
    </div>
  );
}
