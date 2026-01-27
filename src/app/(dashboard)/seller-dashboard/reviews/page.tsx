"use client";

import { useAuthStore } from "@/store/authStore";
import { ReviewList, ReviewSummary } from "@/components/shared/reviews";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { Star, ShieldCheck, Loader2 } from "lucide-react";

export default function ReviewsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: entities, isLoading: isLoadingEntities } = useEntitiesQuery();

  const entityId = user?.staffAtEntityId || entities?.[0]?.id;

  if (isLoadingEntities) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-40" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Authenticating Business Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto py-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-foreground tracking-tighter flex items-center gap-3">
          <Star className="h-10 w-10 text-primary fill-current" />
          Trust & Reputation
        </h1>
        <p className="text-muted-foreground font-medium max-w-2xl">
          Manage your customer feedback. Pin your best testimonials to build trust with potential buyers, or hide irrelevant content to maintain your brand profile.
        </p>
      </div>

      {!entityId ? (
        <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted-foreground/10">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-10 w-10 text-muted-foreground opacity-30" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Entity Profile Missing</h3>
          <p className="max-w-xs mx-auto text-sm text-balance text-muted-foreground">
            You must be linked to an entity to manage reviews. Please contact support if you believe this is an error.
          </p>
        </div>
      ) : (
        <>
          <ReviewSummary entityId={entityId} />
          <ReviewList entityId={entityId} isOwner={true} />
        </>
      )}
    </div>
  );
}
