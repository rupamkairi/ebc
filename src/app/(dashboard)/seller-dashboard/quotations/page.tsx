"use client";

import {
  FileText,
  Search,
  IndianRupee,
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuotationsQuery } from "@/queries/activityQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getTimeBadge } from "@/lib/activity-utils";

export default function QuotationsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: entities } = useEntitiesQuery();
  const sellerEntity = entities?.[0];
  const isApproved = sellerEntity?.verificationStatus === "APPROVED";

  const { data: quotations, isLoading } = useQuotationsQuery();

  const displayQuotations = useMemo(() => {
    if (!quotations) return [];

    const filtered = quotations.filter((qut) => {
      const q = searchQuery.toLowerCase();
      const customerName = qut.enquiry?.createdBy?.name?.toLowerCase() || "";
      const id = qut.id.toLowerCase();
      const itemName =
        qut.quotationLineItems?.[0]?.item?.name?.toLowerCase() || "";
      return customerName.includes(q) || id.includes(q) || itemName.includes(q);
    });

    return filtered.map((qut) => {
      const totalAmount = qut.quotationLineItems.reduce(
        (sum, item) => sum + (item.amount || 0),
        0,
      );
      const mainItem =
        qut.quotationLineItems[0]?.item?.name ||
        t("multiple_items", "Multiple Items");
      const itemCount = qut.quotationLineItems.length;

      return {
        ...qut,
        displayAmount: totalAmount.toLocaleString("en-IN"),
        displayItems:
          itemCount > 1 ? `${mainItem} (+${itemCount - 1} more)` : mainItem,
        customerName:
          qut.enquiry?.createdBy?.name ||
          `${t("enquiry_id_label", "Enquiry")} #${qut.enquiryId.slice(0, 8)}`,
        displayDate: format(new Date(qut.createdAt), "dd MMM yyyy"),
        uiStatus: qut.status === "ACCEPTED" ? "Accepted" : "Sent",
      };
    });
  }, [quotations, searchQuery, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">
            {t("deal_board", "Deal Board")}
          </h1>
          <p className="text-sm text-primary/60 font-medium mt-1">
            {t(
              "track_active_quotations",
              "Track and manage your sent and accepted quotations",
            )}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
        <Input
          className="pl-10 bg-white border-primary/10 rounded-xl h-11 font-medium text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10"
          placeholder={t(
            "search_quote_customer",
            "Search by ID, customer or item name...",
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {displayQuotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
            <FileText className="h-12 w-12 text-primary/20" />
            <p className="text-primary/40 font-bold text-sm">
              {t("no_quotations_found", "No Quotations Found")}
            </p>
            <p className="text-primary/30 text-xs max-w-md">
              {t(
                "when_respond_enquiries_appear",
                "When you respond to enquiries, they will appear here.",
              )}
            </p>
          </div>
        ) : (
          displayQuotations.map((qut) => {
            const badge = getTimeBadge(qut.createdAt, t);
            return (
              <Card
                key={qut.id}
                className="bg-white border border-primary/10 rounded-[20px] p-5 md:p-7 shadow-none hover:shadow-md hover:border-primary/25 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                        ID: {qut.id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black tracking-widest",
                          badge.className,
                        )}
                      >
                        {badge.label}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase",
                          qut.uiStatus === "Accepted"
                            ? "bg-green-600 text-white"
                            : "bg-primary text-white",
                        )}
                      >
                        {qut.uiStatus}
                      </span>
                    </div>

                    {/* Customer Name */}
                    <h3 className="font-black text-primary text-base">
                      {qut.customerName}
                    </h3>

                    {/* Items */}
                    <p className="text-sm font-bold text-secondary flex items-center gap-2">
                      {qut.displayItems}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-primary/50 font-medium flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {t("updated", "Updated")}: {qut.displayDate}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 shrink-0">
                    {/* Amount */}
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-0.5">
                        {t("quote_value", "Quote Value")}
                      </p>
                      <div className="flex items-center sm:justify-end font-black text-primary text-2xl tracking-tighter">
                        <IndianRupee size={20} className="mr-0.5" />
                        {qut.displayAmount}
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[11px] tracking-widest uppercase px-5 h-10 shadow-sm transition-all group-hover:shadow-md"
                    >
                      <Link href={`/seller-dashboard/quotations/${qut.id}`}>
                        {t("view_details", "View Details")}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Tip */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <div className="bg-white p-3 rounded-xl shadow-sm text-secondary shrink-0 mt-0.5">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="text-base font-black text-primary">
            {t("pro_tip_title", "Pro Tip")}:{" "}
            {t(
              "follow_up_tip",
              "Following up on sent quotations within 24 hours increases conversion by 40%!",
            )}
          </p>
          <p className="text-xs font-medium text-primary/60 mt-1">
            {t(
              "follow_up_subtitle",
              "Personal reaching out builds trust and shows commitment to the buyer's needs.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
