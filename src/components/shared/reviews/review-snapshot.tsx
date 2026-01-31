"use client";

import { useReviewSummaryQuery } from "@/queries/reviewQueries";
import { Star, ChevronRight, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReviewSummary } from "./review-summary";
import { ReviewList } from "./review-list";
import { cn } from "@/lib/utils";

interface ReviewSnapshotProps {
  entityId: string;
  entityName?: string;
  className?: string;
}

export function ReviewSnapshot({ entityId, entityName, className }: ReviewSnapshotProps) {
  const { data: summary, isLoading } = useReviewSummaryQuery(entityId);

  if (isLoading) {
    return <div className="h-10 w-32 bg-muted/20 animate-pulse rounded-full" />;
  }

  const average = summary?.average || 0;
  const total = summary?.total || 0;
  const verified = summary?.verifiedCount || 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-auto py-2 px-4 rounded-full border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className={cn("h-4 w-4", average > 0 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
              <span className="font-black text-foreground">{average.toFixed(1)}</span>
            </div>
            <div className="w-px h-3 bg-primary/20" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
              {total} Reviews
            </span>
            {verified > 0 && (
              <>
                <div className="w-px h-3 bg-primary/20" />
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              </>
            )}
            <ChevronRight className="h-3 w-3 text-muted-foreground/50 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            Reviews for {entityName || "Seller"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-8 pt-0 space-y-8">
          <ReviewSummary entityId={entityId} />
          <ReviewList entityId={entityId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
