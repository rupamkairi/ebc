"use client";

import { useState } from "react";
import { useEntityReviewsQuery, useEntityReviewsFullQuery } from "@/queries/reviewQueries";
import { ReviewCard } from "./review-card";
import { Loader2, MessageSquare, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Review } from "@/types/review";

interface ReviewListProps {
  entityId: string;
  isOwner?: boolean;
}

export function ReviewList({ entityId, isOwner }: ReviewListProps) {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const { data: publicReviews, isLoading: loadingPublic } = useEntityReviewsQuery(entityId);
  const { data: fullReviews, isLoading: loadingFull } = useEntityReviewsFullQuery(isOwner ? entityId : "");

  const reviews: Review[] = (isOwner ? fullReviews : publicReviews) || [];
  const isLoading = isOwner ? loadingFull : loadingPublic;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-40" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Fetching trust signals...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-8 w-8 text-muted-foreground opacity-40" />
        </div>
        <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
        <p className="max-w-xs mx-auto text-sm text-balance text-muted-foreground">
          {isOwner 
            ? "Your reputation is just starting. Complete some enquiries to earn your first badge!" 
            : "This entity hasn't received any reviews yet. Be the first to share your experience!"}
        </p>
      </div>
    );
  }

  // Calculate Average Rating
  const validReviews = reviews.filter((r) => !r.isHidden);
  const avgRating = validReviews.length > 0 
    ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
    : "0.0";

  // Filter reviews for display
  const displayReviews = reviews.filter((r) => {
    if (showVerifiedOnly && !r.isVerified) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Stats and Filters */}
      <div className="flex flex-col gap-6">
        {/* Overview Stats */}
        <div className="p-6 rounded-3xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 flex flex-wrap gap-12 items-center">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
              <Star className="h-8 w-8 fill-current" />
            </div>
            <div>
              <div className="text-3xl font-black">{avgRating}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Average Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/50 border flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-black">{validReviews.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Total Feedbacks</div>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/50 border flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-black">
                  {reviews.filter((r) => r.isPinned).length} / 5
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Pinned to top</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between px-2 bg-muted/30 p-4 rounded-2xl border border-dashed">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-bold tracking-tight text-foreground/80">Marketplace Trust Filter</span>
          </div>
          <div className="flex items-center space-x-3">
            <Label 
              htmlFor="verified-filter" 
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer select-none"
            >
              Verified Only
            </Label>
            <Switch 
              id="verified-filter" 
              checked={showVerifiedOnly} 
              onCheckedChange={setShowVerifiedOnly}
            />
          </div>
        </div>
      </div>

      {displayReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayReviews.map((review) => (
            <ReviewCard key={review.id} review={review} isOwner={isOwner} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed animate-in fade-in zoom-in-95 duration-500">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No verified reviews found</h3>
          <p className="max-w-xs mx-auto text-sm text-balance text-muted-foreground">
            This entity doesn&apos;t have any verified transaction-linked reviews matching this filter yet.
          </p>
          <Button 
            variant="link" 
            onClick={() => setShowVerifiedOnly(false)}
            className="mt-4 text-primary font-bold uppercase tracking-widest text-[10px]"
          >
            Show All Reviews
          </Button>
        </div>
      )}
    </div>
  );
}


