"use client";

import { useAdminHiddenReviewsQuery, useToggleHideReviewMutation } from "@/queries/reviewQueries";
import { ReviewCard } from "@/components/shared/reviews";
import { Loader2, ShieldAlert, Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/types/review";

export default function AdminReviewAuditPage() {
  const { data: hiddenReviews, isLoading } = useAdminHiddenReviewsQuery();
  const toggleHideMutation = useToggleHideReviewMutation();
  const [search, setSearch] = useState("");

  const filteredReviews = useMemo(() => {
    if (!hiddenReviews) return [];
    return hiddenReviews.filter((r: Review) => 
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.entity?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [hiddenReviews, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest">
          <ShieldAlert className="h-4 w-4" />
          Internal Audit System
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Review Moderation</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Monitor and manage reviews that have been hidden by sellers. As an admin, you can restore transparency by unhiding legitimate feedback or keeping inappropriate content suppressed.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reviews by content or entity..." 
            className="pl-12 h-14 rounded-2xl border-none bg-muted/50 focus-visible:ring-primary shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl font-bold gap-2">
          <Filter className="h-4 w-4" />
          FILTERS
        </Button>
      </div>

      {filteredReviews.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Eye className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-bold italic">No hidden reviews found</h3>
            <p className="text-muted-foreground text-sm">Everything looks transparent across the platform.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review: Review) => (
            <div key={review.id} className="relative group">
              <ReviewCard review={review} />
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl"
                  onClick={() => toggleHideMutation.mutate({ 
                    reviewId: review.id, 
                    isHidden: false, 
                    entityId: review.entityId 
                  })}
                  disabled={toggleHideMutation.isPending}
                >
                  UNHIDE AND RESTORE
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
