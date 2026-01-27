"use client";

import { useReviewSummaryQuery } from "@/queries/reviewQueries";
import { Star, ShieldCheck, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ReviewSummaryProps {
  entityId: string;
}

export function ReviewSummary({ entityId }: ReviewSummaryProps) {
  const { data: summary, isLoading } = useReviewSummaryQuery(entityId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-muted/10 rounded-4xl border border-dashed animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!summary || summary.total === 0) {
    return (
      <div className="p-12 text-center bg-muted/10 rounded-4xl border border-dashed flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Star className="h-8 w-8 text-muted-foreground opacity-20" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight">No analytics yet</h3>
          <p className="text-muted-foreground font-medium text-sm">Collect reviews from your customers to see your rating distribution.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-10 bg-white border border-black/5 shadow-2xl shadow-black/5 rounded-4xl items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 lg:border-r lg:border-dashed lg:border-muted-foreground/10 lg:pr-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reputation Score</p>
        <div className="text-7xl font-black tracking-tighter text-foreground leading-none">
          {summary.average.toFixed(1)}
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "h-6 w-6",
                s <= Math.round(summary.average) ? "fill-yellow-400 text-yellow-400" : "text-muted/20"
              )}
            />
          ))}
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Based on {summary.total} Reviews
        </div>
        
        {summary.verifiedCount > 0 && (
          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 tracking-tighter uppercase whitespace-nowrap">
              {summary.verifiedCount} Verified Transactions
            </span>
          </div>
        )}
      </div>

      {/* Distribution Bars */}
      <div className="lg:col-span-2 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Star Distribution</p>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary.distribution[star] || 0;
          const percentage = summary.total > 0 ? (count / summary.total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-6 group">
              <div className="flex items-center gap-2 w-16 shrink-0">
                <span className="text-sm font-black text-muted-foreground transition-colors group-hover:text-foreground">{star}</span>
                <Star className="h-4 w-4 fill-muted-foreground/20 text-muted-foreground/20 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all" />
              </div>
              <div className="flex-1">
                <Progress 
                  value={percentage} 
                  className="h-3 bg-muted rounded-full overflow-hidden" 
                />
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-xs font-black text-muted-foreground group-hover:text-foreground transition-colors">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
