"use client";

import { Star, Pin, EyeOff, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { 
  useTogglePinReviewMutation, 
  useToggleHideReviewMutation 
} from "@/queries/reviewQueries";
import { useAuthStore } from "@/store/authStore";

import { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
  isOwner?: boolean;
}

export function ReviewCard({ review, isOwner }: ReviewCardProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role?.startsWith("ADMIN");
  
  const pinMutation = useTogglePinReviewMutation();
  const hideMutation = useToggleHideReviewMutation();

  const handleTogglePin = () => {
    if (!review.entityId) return;
    pinMutation.mutate({
      reviewId: review.id,
      entityId: review.entityId,
      isPinned: !review.isPinned
    });
  };

  const handleToggleHide = () => {
    if (!review.entityId) return;
    hideMutation.mutate({
      reviewId: review.id,
      entityId: review.entityId,
      isHidden: !review.isHidden
    });
  };

  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all relative group",
      review.isPinned ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" : "bg-card hover:border-border/80 shadow-sm",
      review.isHidden ? "opacity-60 grayscale border-dashed" : ""
    )}>
      {review.isPinned && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg animate-in fade-in slide-in-from-top-1">
          <Pin className="h-3 w-3 fill-current" />
          PINNED REVIEW
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
            {review.createdBy?.image ? (
              <img src={review.createdBy.image} alt={review.createdBy.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">{review.createdBy?.name?.[0] || "?"}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm leading-tight">{review.createdBy?.name}</h4>
              {review.isVerified && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold px-1.5 py-0 h-4 uppercase tracking-tighter hover:bg-emerald-500/10 transition-none">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {format(new Date(review.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {(isOwner || isAdmin) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl">
              {isOwner && (
                <DropdownMenuItem onClick={handleTogglePin} disabled={pinMutation.isPending} className="rounded-lg gap-2 cursor-pointer font-medium">
                  <Pin className="h-4 w-4" />
                  {review.isPinned ? "Unpin from top" : "Pin to top (Max 5)"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleToggleHide} disabled={hideMutation.isPending} className="rounded-lg gap-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 font-medium">
                <EyeOff className="h-4 w-4" />
                {review.isHidden ? "Make Public" : "Hide from Public"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-2">
        {review.title && <h5 className="font-bold text-base leading-tight">{review.title}</h5>}
        {review.description && <p className="text-sm text-balance leading-relaxed text-muted-foreground">{review.description}</p>}
      </div>

      {review.attachments && review.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {review.attachments.map((at) => (
            <div key={at.id} className="h-20 w-24 rounded-xl overflow-hidden border bg-muted cursor-pointer hover:opacity-80 transition-opacity">
              <img src={at.media?.url} alt="Review attachment" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {review.isHidden && (
        <div className="mt-4 pt-3 border-t border-dashed flex items-center justify-between text-xs font-semibold text-red-600 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <EyeOff className="h-3 w-3" />
            Currently Hidden by Seller
          </div>
          {isAdmin && <span className="text-muted-foreground font-normal">Audit view: Only Admins can see this across the board</span>}
        </div>
      )}
    </div>
  );
}
