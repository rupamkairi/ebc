"use client";

import { useAuthStore } from "@/store/authStore";
import { useEntitiesQuery } from "@/queries/entityQueries";
import {
  useReviewSummaryQuery,
  useEntityReviewsFullQuery,
  useTogglePinReviewMutation,
  useToggleHideReviewMutation,
} from "@/queries/reviewQueries";
import { Review } from "@/types/review";
import {
  Star,
  Loader2,
  MessageSquare,
  Pin,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";

// ── Star row helper ──────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-[#FFA500] text-[#FFA500]" : "text-gray-300 fill-gray-200"}
        />
      ))}
    </div>
  );
}

// ── Single review card ───────────────────────────────────────────────────────
function ReviewCard({ review, entityId }: { review: Review; entityId: string }) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role?.startsWith("ADMIN");
  const pinMutation = useTogglePinReviewMutation();
  const hideMutation = useToggleHideReviewMutation();

  return (
    <div
      className={cn(
        "relative rounded-2xl p-5 group transition-all duration-300",
        review.isHidden ? "opacity-50 grayscale" : "",
        review.isPinned
          ? "ring-2 ring-[#FFA500]/40"
          : "",
      )}
      style={{ background: "linear-gradient(145deg, #3D52A0 0%, #2a3a7c 100%)" }}
    >
      {/* Pinned badge */}
      {review.isPinned && (
        <div className="absolute -top-2.5 left-5 px-3 py-0.5 bg-[#FFA500] text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
          <Pin size={9} className="fill-white" /> Pinned
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-11 w-11 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden shrink-0">
            {review.createdBy?.image ? (
              <img src={review.createdBy.image} alt={review.createdBy.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-black text-base">
                {review.createdBy?.name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">{review.createdBy?.name || "Anonymous"}</p>
            <StarRow rating={review.rating} />
          </div>
        </div>

        {/* Actions */}
        {(true || isAdmin) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem
                onClick={() => pinMutation.mutate({ reviewId: review.id, entityId, isPinned: !review.isPinned })}
                disabled={pinMutation.isPending}
                className="gap-2 cursor-pointer"
              >
                <Pin size={14} />
                {review.isPinned ? "Unpin" : "Pin to top (Max 5)"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => hideMutation.mutate({ reviewId: review.id, entityId, isHidden: !review.isHidden })}
                disabled={hideMutation.isPending}
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
              >
                <EyeOff size={14} />
                {review.isHidden ? "Make public" : "Hide from public"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Quote mark + body */}
      <div className="relative pl-6">
        <span className="absolute left-0 top-0 text-[#FFA500] text-4xl font-black leading-none">&ldquo;</span>
        {review.title && (
          <p className="text-white font-bold text-sm mb-1">{review.title}</p>
        )}
        {review.description && (
          <p className="text-white/70 text-xs leading-relaxed">{review.description}</p>
        )}
        {!review.title && !review.description && (
          <p className="text-white/40 text-xs italic">No written review.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-white/40 text-[10px] font-semibold">
          {format(new Date(review.createdAt), "MMM d, yyyy")}
        </span>
        {review.isVerified && (
          <span className="text-[9px] font-black uppercase tracking-widest bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full">
            Verified
          </span>
        )}
        {review.isHidden && (
          <span className="text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <EyeOff size={9} /> Hidden
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const { t } = useLanguage();
  const user = useAuthStore((s) => s.user);
  const { data: entities, isLoading: loadingEntities } = useEntitiesQuery();
  const entityId = user?.staffAtEntityId || entities?.[0]?.id || "";

  const { data: summary, isLoading: loadingSummary } = useReviewSummaryQuery(entityId);
  const { data: reviews = [], isLoading: loadingReviews } = useEntityReviewsFullQuery(entityId);

  const isLoading = loadingEntities || loadingSummary || loadingReviews;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#3D52A0] opacity-40" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  const validReviews = reviews.filter((r) => !r.isHidden);
  const avgRating = summary?.average ?? 0;
  const totalFeedbacks = validReviews.length;
  const pinnedCount = reviews.filter((r) => r.isPinned).length;
  const distribution = summary?.distribution ?? {};

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page heading ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-black text-[#1e2b6b] tracking-tight">{t("ratings_and_reviews")}</h1>
        <div className="mt-1.5 h-0.5 w-12 rounded-full bg-[#FFA500]" />
      </div>

      {/* ── Rating Summary Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {(!summary || summary.total === 0) ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Star size={40} className="text-gray-200" />
            <p className="text-gray-400 font-medium text-sm">{t("no_ratings_yet_complete_enquiries")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: big score */}
            <div className="flex flex-col items-center text-center gap-2">
              <p className="text-sm font-semibold text-gray-500">Ratings and Review</p>
              <div className="text-6xl md:text-7xl font-black text-[#3D52A0] leading-none">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    className={s <= Math.round(avgRating) ? "fill-[#FFA500] text-[#FFA500]" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-semibold">Based on {summary.total} reviews</p>
            </div>

            {/* Right: distribution bars */}
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-12 shrink-0">
                      <Star size={11} className="fill-[#FFA500] text-[#FFA500] shrink-0" />
                      <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">{star}★</span>
                    </div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FFA500] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-400 w-8 text-right shrink-0">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { icon: Star, label: t("average_rating_score"), value: avgRating.toFixed(1) },
          { icon: MessageSquare, label: t("total_feedbacks"), value: totalFeedbacks },
          { icon: Pin, label: t("pinned_to_top"), value: `${pinnedCount}/5` },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 md:gap-4 rounded-2xl p-4 md:p-5"
            style={{ background: "linear-gradient(135deg, #FFA500 0%, #e69500 100%)" }}
          >
            <div className="shrink-0 h-12 w-12 md:h-14 md:w-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon size={22} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-xs font-semibold leading-tight truncate">{label}</p>
              <p className="text-white text-2xl md:text-3xl font-black leading-none mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Reviews Grid ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#1e2b6b] mb-1">{t("reviews_title")}</h2>
        <div className="mb-4 h-0.5 w-10 rounded-full bg-[#FFA500]" />

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 gap-3">
            <MessageSquare size={40} className="text-gray-200" />
            <p className="text-gray-400 font-medium text-sm">{t("no_reviews_received_yet")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} entityId={entityId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
