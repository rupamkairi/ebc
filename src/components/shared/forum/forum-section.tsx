"use client";

import { useState } from "react";
import {
  useForumContextQuery,
  useCreatePostMutation,
  useToggleHidePostMutation,
} from "@/queries/forumQueries";
import { useAuthStore } from "@/store/authStore";
import { DiscussionPost } from "@/types/forum";
import {
  MessageSquare,
  Send,
  ShieldAlert,
  MoreVertical,
  Flag,
  EyeOff,
  Loader2,
  User as UserIcon,
  Reply,
  X,
} from "lucide-react";
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

export interface ForumSectionProps {
  eventId?: string;
  offerId?: string;
  itemId?: string;
  slug?: string;
  pincodeId?: string;
  className?: string;
}

export function ForumSection({
  eventId,
  offerId,
  itemId,
  slug,
  pincodeId,
  className,
}: ForumSectionProps) {
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<DiscussionPost | null>(null);

  const { data, isLoading } = useForumContextQuery({
    eventId,
    offerId,
    itemId,
    slug,
    pincodeId,
  });
  const createMutation = useCreatePostMutation();
  const toggleHideMutation = useToggleHidePostMutation();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to participate in the discussion");
      return;
    }

    // Check if the business is approved (for non-admins/buyers)
    const isAdmin = ["ADMIN", "ADMIN_MANAGER", "ADMIN_EXECUTIVE", "ADMIN_ACCOUNTANT"].includes(user.role || "");
    const isBuyer = user.role === "USER_BUYER_ADMIN";
    
    if (!isAdmin && !isBuyer && user.staffAt && user.staffAt.verificationStatus !== "APPROVED") {
      toast.error(
        `Your business must be APPROVED to post in forums. Current status: ${user.staffAt.verificationStatus}`
      );
      return;
    }
    if (!content.trim()) return;

    try {
      await createMutation.mutateAsync({
        discussionId: data!.discussion.id,
        content: content.trim(),
        replyToId: replyingTo?.id,
      });
      setContent("");
      setReplyingTo(null);
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
        <p className="text-sm font-medium">
          Opening Conference Hall Discussions...
        </p>
      </div>
    );
  }

  const allPosts = data?.posts || [];
  const isAdmin = user?.role && ["ADMIN", "ADMIN_MANAGER", "ADMIN_EXECUTIVE", "ADMIN_ACCOUNTANT"].includes(user.role);

  interface ThreadedPost extends DiscussionPost {
    children: ThreadedPost[];
  }

  // Build a tree structure for nested replies
  const buildTree = (
    posts: DiscussionPost[],
    parentId?: string,
  ): ThreadedPost[] => {
    return posts
      .filter(
        (p) =>
          p.replyToId === (parentId || null) || (!parentId && !p.replyToId),
      )
      .map((p) => ({
        ...p,
        children: buildTree(posts, p.id),
      }))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  };

  const threadedPosts = buildTree(allPosts);

  const renderPost = (post: ThreadedPost, depth: number = 0) => (
    <div key={post.id} className="space-y-4">
      <div
        className={cn(
          "group relative flex gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-300",
          post.isHidden
            ? "bg-muted/50 grayscale opacity-60"
            : "bg-white border hover:shadow-xl hover:shadow-black/5",
          depth > 0 && "ml-4 md:ml-12 border-l-4 border-l-primary/10",
        )}
      >
        <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-2xl border-2 border-background shadow-sm">
          <AvatarImage src={post.createdBy.image} />
          <AvatarFallback className="bg-primary/5 text-primary">
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm tracking-tight">
                {post.createdBy.name}
              </span>
              {post.createdBy.staffAt && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">
                  {post.createdBy.staffAt.name}
                </span>
              )}
              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {user && !post.isHidden && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 rounded-full px-3 text-[10px] font-black opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setReplyingTo(post);
                    document.getElementById("forum-textarea")?.focus();
                  }}
                >
                  <Reply className="h-3 w-3" />
                  REPLY
                </Button>
              )}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-2xl"
                  >
                    <DropdownMenuItem
                      className="gap-2 font-bold text-xs"
                      onClick={() => handleToggleHide(post.id, !post.isHidden)}
                    >
                      {post.isHidden ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
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
          </div>

          <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium">
            {post.content}
          </div>
        </div>
      </div>
      {post.children.length > 0 && (
        <div className="space-y-4">
          {post.children.map((child) => renderPost(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Public Forum</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Conference Hall Activity
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black">{allPosts.length}</div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            Community Contributions
          </div>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-6">
        {threadedPosts.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-4xl border border-dashed">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <h4 className="font-bold text-muted-foreground">
              The hall is quiet...
            </h4>
            <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-1">
              Be the first to share your thoughts and start the conversation!
            </p>
          </div>
        ) : (
          threadedPosts.map((post) => renderPost(post))
        )}
      </div>

      {/* Write Post Section */}
      <div className="pt-8 border-t">
        {user ? (
          <form onSubmit={handlePost} className="space-y-4">
            {replyingTo && (
              <div className="flex items-center justify-between px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <Reply className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold tracking-tight">
                    Replying to{" "}
                    <span className="text-primary">
                      {replyingTo.createdBy.name}
                    </span>
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="h-6 w-6 p-0 rounded-full hover:bg-primary/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="relative group">
              <Textarea
                id="forum-textarea"
                placeholder={
                  replyingTo
                    ? `Write your reply to ${replyingTo.createdBy.name}...`
                    : "Share your insights, ask questions, or contribute to the hall..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] rounded-2xl md:rounded-4xl border-none bg-muted/30 p-4 md:p-8 text-sm focus-visible:ring-primary focus-visible:bg-white transition-all resize-none shadow-inner"
              />
            </div>
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-[10px] font-black transition-opacity",
                  content.length > 0 ? "opacity-100" : "opacity-0",
                )}
              >
                {content.length} CHARS
              </span>
              <Button
                type="submit"
                disabled={!content.trim() || createMutation.isPending}
                className="rounded-2xl h-10 md:h-12 px-4 md:px-6 gap-2 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {replyingTo ? "POST REPLY" : "PUBLISH"}
              </Button>
            </div>
            <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest px-10">
              Your contribution will be visible to the public. Please follow the
              professional code of conduct in the Conference Hall.
            </p>
          </form>
        ) : (
          <div className="p-10 rounded-4xl bg-linear-to-b from-primary/5 to-transparent border border-primary/10 text-center space-y-4">
            <h4 className="text-lg font-black tracking-tight">
              Want to join the conversation?
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Login to your account to share insights and interact with the
              professional community in the hall.
            </p>
            <Button asChild className="rounded-2xl px-10 font-black gap-2">
              <a href="/auth/login">LOGIN TO PARTICIPATE</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
