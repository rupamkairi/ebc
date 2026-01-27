"use client";

import { useState } from "react";
import { useForumContextQuery, useCreatePostMutation, useToggleHidePostMutation } from "@/queries/forumQueries";
import { useAuthStore } from "@/store/authStore";
import { MessageSquare, Send, ShieldAlert, MoreVertical, Flag, EyeOff, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ForumSectionProps {
  eventId?: string;
  offerId?: string;
  itemId?: string;
  slug?: string;
  className?: string;
}

export function ForumSection({ eventId, offerId, itemId, slug, className }: ForumSectionProps) {
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState("");
  
  const { data, isLoading } = useForumContextQuery({ eventId, offerId, itemId, slug });
  const createMutation = useCreatePostMutation();
  const toggleHideMutation = useToggleHidePostMutation();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to participate in the discussion");
      return;
    }
    if (!content.trim()) return;

    try {
      await createMutation.mutateAsync({
        discussionId: data!.discussion.id,
        content: content.trim(),
      });
      setContent("");
      toast.success("Post shared with the community!");
    } catch {
      toast.error("Failed to post message");
    }
  };

  const handleToggleHide = async (postId: string, isHidden: boolean) => {
    try {
      await toggleHideMutation.mutateAsync({ postId, isHidden });
      toast.success(isHidden ? "Comment hidden" : "Comment restored");
    } catch {
      toast.error("Moderation action failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Opening Conference Hall Discussions...</p>
      </div>
    );
  }

  const posts = data?.posts || [];
  const isAdmin = user?.role === "ADMIN" || user?.role === "ADMIN_MANAGER";

  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Public Forum</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Conference Hall Activity</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black">{posts.length}</div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Community Contributions</div>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-4xl border border-dashed">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <h4 className="font-bold text-muted-foreground">The hall is quiet...</h4>
            <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-1">Be the first to share your thoughts and start the conversation!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className={cn(
                "group relative flex gap-4 p-6 rounded-3xl transition-all duration-300",
                post.isHidden ? "bg-muted/50 grayscale opacity-60" : "bg-white border hover:shadow-xl hover:shadow-black/5"
              )}
            >
              <Avatar className="h-12 w-12 rounded-2xl border-2 border-background shadow-sm">
                <AvatarImage src={post.createdBy.image} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  <UserIcon className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm tracking-tight">{post.createdBy.name}</span>
                    {post.createdBy.staffAt && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">
                        {post.createdBy.staffAt.name}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl">
                        <DropdownMenuItem 
                          className="gap-2 font-bold text-xs"
                          onClick={() => handleToggleHide(post.id, !post.isHidden)}
                        >
                          {post.isHidden ? <ShieldAlert className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          {post.isHidden ? "Unhide Post" : "Moderate & Hide"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-bold text-xs text-destructive">
                          <Flag className="h-4 w-4" />
                          Mark for Audit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Post Section */}
      <div className="pt-8 border-t">
        {user ? (
          <form onSubmit={handlePost} className="space-y-4">
            <div className="relative group">
              <Textarea
                placeholder="Share your insights, ask questions, or contribute to the hall..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] rounded-4xl border-none bg-muted/30 p-8 text-sm focus-visible:ring-primary focus-visible:bg-white transition-all resize-none shadow-inner"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-black transition-opacity",
                  content.length > 0 ? "opacity-100" : "opacity-0"
                )}>
                  {content.length} CHARS
                </span>
                <Button 
                  type="submit" 
                  disabled={!content.trim() || createMutation.isPending}
                  className="rounded-2xl h-12 px-6 gap-2 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  PUBLISH CONTRIBUTION
                </Button>
              </div>
            </div>
            <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest px-10">
              Your contribution will be visible to the public. Please follow the professional code of conduct in the Conference Hall.
            </p>
          </form>
        ) : (
          <div className="p-10 rounded-4xl bg-linear-to-b from-primary/5 to-transparent border border-primary/10 text-center space-y-4">
            <h4 className="text-lg font-black tracking-tight">Want to join the conversation?</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">Login to your account to share insights and interact with the professional community in the hall.</p>
            <Button asChild className="rounded-2xl px-10 font-black gap-2">
              <a href="/login">LOGIN TO PARTICIPATE</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
