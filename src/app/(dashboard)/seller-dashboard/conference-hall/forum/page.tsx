"use client";

import { ForumSection } from "@/components/shared/forum";
import { Sparkles, MessageSquare } from "lucide-react";

export default function SellerForumPage() {
  return (
    <div className="container mx-auto py-6 md:py-10 space-y-6 md:space-y-10 px-4">
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs">
          <Sparkles className="h-4 w-4" />
          Community Hub
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
          General Discussion
        </h1>
        <p className="text-muted-foreground font-medium text-sm md:text-lg max-w-2xl">
          Connect with other professionals, share industry insights, and engage with the community 
          in the central Conference Hall lounge.
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-4xl border border-muted/50 shadow-2xl shadow-black/5 overflow-hidden">
        <div className="p-4 md:p-10">
          <ForumSection slug="conference-hall-general" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-primary/5 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h4 className="font-black text-sm uppercase">Networking</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">Meet partners and collaborators in your category.</p>
        </div>
        <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-secondary/10 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <h4 className="font-black text-sm uppercase">Insights</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">Stay updated with the latest trends shared by the community.</p>
        </div>
        <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-muted/50 space-y-3 border">
          <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <h4 className="font-black text-sm uppercase">Support</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">Ask questions about operations or get help from peers.</p>
        </div>
      </div>
    </div>
  );
}
