"use client";

import { useQuotationsQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  IndianRupee,
  Clock,
  ChevronRight,
  Loader2,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { ReviewSnapshot } from "@/components/shared/reviews";

const filters = ["All", "Pending", "Accepted"];

export default function BuyerQuotationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: session } = useSessionQuery();
  const { data: quotations, isLoading } = useQuotationsQuery({});
  const { t } = useLanguage();

  const filtered = (quotations || []).filter((q) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Accepted") return q.status === "ACCEPTED";
    return q.status === "PENDING";
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Profile Card */}
      {session?.user && (
        <BuyerProfileCard
          name={session.user.name || "Buyer"}
          role={session.user.role || "Buyer"}
          avatarUrl={session.user.image || undefined}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          {t("quotation_page_title")}
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t("quotation_page_subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-bold transition-all shadow-sm",
              activeFilter === filter
                ? "bg-primary text-white shadow-primary/20"
                : "bg-white text-primary hover:bg-muted border border-muted",
            )}
          >
            {filter === "All" && t("all_filter")}
            {filter === "Pending" && t("pending_filter")}
            {filter === "Accepted" && t("accepted_filter")}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            {t("loading_quotations_msg")}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-muted/20 border border-dashed rounded-2xl">
          <FileText className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">
            {t("no_quotations_msg")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((q) => {
            const total =
              q.quotationLineItems?.reduce(
                (sum, li) => sum + (li.amount || 0),
                0,
              ) ?? 0;
            const mainItem =
              q.quotationLineItems?.[0]?.item?.name || t("multiple_items");
            const itemCount = q.quotationLineItems?.length ?? 0;
            const isAccepted = q.status === "ACCEPTED";

            return (
              <Card
                key={q.id}
                className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all bg-white rounded-2xl"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Status bar */}
                    <div
                      className={cn(
                        "w-full md:w-1.5 h-1.5 md:h-auto",
                        isAccepted ? "bg-emerald-500" : "bg-amber-400",
                      )}
                    />
                    <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: info */}
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                              {q.id.slice(-8).toUpperCase()}
                            </span>
                            <Badge
                              className={cn(
                                "text-[10px] font-black uppercase tracking-wide border-none",
                                isAccepted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700",
                              )}
                            >
                              {isAccepted
                                ? t("accepted_label")
                                : t("pending_label")}
                            </Badge>
                          </div>
                          <p className="font-black text-sm">
                            {itemCount > 1
                              ? `${mainItem} (${t("more_items", { count: itemCount - 1 })})`
                              : mainItem}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(q.createdAt), "dd MMM yyyy")}
                          </p>
                          <div className="pt-2">
                            <ReviewSnapshot
                              entityId={
                                q.createdBy?.staffAtEntityId ||
                                q.createdBy?.createdEntities?.[0]?.id ||
                                ""
                              }
                              entityName={
                                q.createdBy?.staffAt?.name ||
                                q.createdBy?.createdEntities?.[0]?.name ||
                                q.createdBy?.name
                              }
                              className="scale-90 origin-left"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: amount + action */}
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {t("total_label")}
                          </p>
                          <div className="flex items-center justify-end font-black text-primary text-xl">
                            <IndianRupee className="h-4 w-4" />
                            {total.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-white font-black rounded-xl h-10 px-5 transition-all group/btn"
                        >
                          <Link
                            href={`/buyer-dashboard/enquiries/${q.enquiryId}`}
                          >
                            {t("view_label")}
                            <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
