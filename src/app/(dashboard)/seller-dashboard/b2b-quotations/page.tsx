"use client";

import { useQuotationsQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
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
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { ReviewSnapshot } from "@/components/shared/reviews";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";
import { Input } from "@/components/ui/input";

const filters = ["All", "Pending", "Accepted"];

export default function SellerReceivedQuotationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSessionQuery();
  const { data: quotations, isLoading } = useQuotationsQuery({});
  const { t } = useLanguage();

  const filtered = useMemo(() => {
    let result = (quotations || []).filter((q) => q.enquiry?.createdById === session?.user?.id);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => 
        item.id.toLowerCase().includes(q) ||
        (item.quotationLineItems || []).some((li) => 
          li.item?.name?.toLowerCase().includes(q)
        )
      );
    }

    // Status filter
    if (activeFilter !== "All") {
       result = result.filter((q) => {
        const details = q.quotationDetails?.[0];
        if (activeFilter === "Accepted") return q.status === "ACCEPTED";
        return (q.status === "PENDING" || details?.requestedRevision) && 
               q.status !== "ACCEPTED" && 
               q.status !== "REJECTED" && 
               q.enquiry?.status !== "COMPLETED";
      });
    }

    return result;
  }, [quotations, session, activeFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <PageBackButton href="/seller-dashboard/b2b-enquiries" />
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary uppercase">
              {t("received_quotations_title")}
            </h1>
            <p className="text-sm text-primary/60 font-medium mt-1">
              {t("received_quotations_subtitle")}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
            <Input
              type="search"
              className="pl-10 bg-white border-primary/10 rounded-xl h-11 font-medium text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10 shadow-xs"
              placeholder={t("search_quotations", "Search items or ID...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-primary/40 border-primary/10 hover:border-primary/30",
                  )}
                >
                  {filter === "All" && t("all_filter")}
                  {filter === "Pending" && t("pending_filter")}
                  {filter === "Accepted" && t("accepted_filter")}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="grid gap-5">
          {filtered.length === 0 ? (
            <div className="flex h-[240px] flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-primary/10">
              <FileText className="h-10 w-10 text-primary/10 mb-4" />
              <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">
                {searchQuery ? t("no_matching_quotations", "No matching quotations found") : t("no_quotations_msg")}
              </p>
            </div>
          ) : (
            filtered.map((q) => {
              const total = q.quotationLineItems?.reduce((sum, li) => sum + (li.amount || 0), 0) ?? 0;
              const mainItem = q.quotationLineItems?.[0]?.item?.name || t("multiple_items");
              const itemCount = q.quotationLineItems?.length ?? 0;
              const isAccepted = q.status === "ACCEPTED";
              const isEnquiryClosed = q.enquiry?.status === "COMPLETED";
              const details = q.quotationDetails?.[0];
              const isNegotiable = q.quotationLineItems?.some((li) => li.isNegotiable) && !details?.hasBeenRevised;

              return (
                <Card
                  key={q.id}
                  className="bg-white border border-primary/10 hover:border-primary/20 shadow-xs hover:shadow-md rounded-[20px] overflow-hidden transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Status bar */}
                      <div
                        className={cn(
                          "w-full md:w-1.5 h-1.5 md:h-auto",
                          isAccepted
                            ? "bg-emerald-500"
                            : isEnquiryClosed
                              ? "bg-zinc-300"
                              : "bg-amber-400",
                        )}
                      />
                      <div className="flex-1 p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Info Section */}
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Package className="h-7 w-7 text-primary" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                                {q.id.slice(-8).toUpperCase()}
                              </span>
                              <Badge
                                className={cn(
                                  "text-[9px] font-black uppercase tracking-widest border-none px-2.5 py-1",
                                  isAccepted
                                    ? "bg-emerald-100 text-emerald-700"
                                    : isEnquiryClosed
                                      ? "bg-zinc-100 text-zinc-600"
                                      : "bg-amber-100 text-amber-700",
                                )}
                              >
                                {isAccepted
                                  ? t("accepted_label")
                                  : isEnquiryClosed
                                    ? t("enquiry_closed")
                                    : t("pending_label")}
                              </Badge>
                              {isNegotiable && !isAccepted && !isEnquiryClosed && (
                                <Badge className="text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white border-none px-2.5 py-1 animate-pulse">
                                  {t("negotiable_price")}
                                </Badge>
                              )}
                              {details?.requestedRevision && !details?.hasBeenRevised && (
                                <Badge className="text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white border-none px-2.5 py-1 animate-pulse">
                                  {t("revision_requested_label", "Revision Requested")}
                                </Badge>
                              )}
                              {details?.hasBeenRevised && (
                                <Badge className="text-[9px] font-black uppercase tracking-widest bg-violet-600 text-white border-none px-2.5 py-1 flex items-center gap-1.5">
                                  {q.priceChangeType === "DECREASED" && <TrendingDown className="h-3 w-3" />}
                                  {q.priceChangeType === "INCREASED" && <TrendingUp className="h-3 w-3" />}
                                  {q.priceChangeType === "MAINTAINED" && <RefreshCw className="h-3 w-3" />}
                                  {t("revised_label", "Revised")}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-black text-lg text-primary tracking-tight uppercase leading-none">
                              {itemCount > 1
                                ? `${mainItem} (+${itemCount - 1} ${t("more")})`
                                : mainItem}
                            </h3>
                            <div className="flex items-center gap-3">
                              <p className="text-[10px] text-primary/40 font-bold flex items-center gap-1 uppercase tracking-widest">
                                <Clock className="h-3 w-3" />
                                {format(new Date(q.createdAt), "dd MMM yyyy")}
                              </p>
                              <ReviewSnapshot
                                entityId={q.createdBy?.staffAtEntityId || q.createdBy?.createdEntities?.[0]?.id || ""}
                                entityName={q.createdBy?.staffAt?.name || q.createdBy?.createdEntities?.[0]?.name || q.createdBy?.name}
                                className="scale-75 origin-left"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action section */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-1">
                              {t("total_label")}
                            </p>
                            <div className="flex items-center justify-end font-black text-primary text-xl">
                              <IndianRupee className="h-4 w-4" strokeWidth={3} />
                              {total.toLocaleString("en-IN")}
                            </div>
                            {q.priceDifference && q.priceDifference !== 0 && (
                              <p className={cn(
                                "text-[10px] font-bold mt-0.5 uppercase tracking-tighter",
                                q.priceChangeType === "DECREASED" ? "text-teal-600" : "text-amber-600"
                              )}>
                                {q.priceChangeType === "DECREASED" ? "-" : "+"}₹{Math.abs(q.priceDifference).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <Button
                            asChild
                            className="bg-primary hover:bg-primary/90 text-white h-10 px-6 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all duration-300 border-none shadow-sm shadow-primary/20"
                          >
                            <Link href={`/seller-dashboard/b2b-quotations/${q.id}`}>
                              {t("details")}
                              <ChevronRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
