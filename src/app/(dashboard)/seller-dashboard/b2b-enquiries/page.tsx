"use client";

import { useEnquiriesQuery } from "@/queries/activityQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, ChevronRight, Loader2, Frown, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTimeBadge } from "@/lib/activity-utils";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { ENQUIRY_STATUS } from "@/constants/enums";
import { EnquiryLineItem } from "@/types/activity";

const filters = ["All", "Pending", "Approved", "Rejected"];

export default function EnquiriesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: enquiries, isLoading } = useEnquiriesQuery({});
  const { data: entities = [] } = useEntitiesQuery();
  const { t } = useLanguage();
  const mainEntity = entities[0];
  const isManufacturer = mainEntity?.type === "MANUFACTURER";

  const filteredEnquiries = useMemo(() => {
    let result = enquiries || [];
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => 
        e.id.toLowerCase().includes(q) ||
        (e.enquiryLineItems || []).some((li: EnquiryLineItem) => 
          li.item?.name?.toLowerCase().includes(q)
        )
      );
    }

    // Status filter
    if (activeFilter !== "All") {
      result = result.filter((e) => (e.status || "").toUpperCase() === activeFilter.toUpperCase());
    }

    return result;
  }, [enquiries, searchQuery, activeFilter]);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary uppercase">
              {t("my_enquiries_title")}
            </h1>
            <p className="text-sm text-primary/60 font-medium mt-1">
              {t("manage_track_enquiries_subtitle")}
            </p>
          </div>
          {!isManufacturer && (
            <Link href="/enquiry/create">
              <Button className="bg-secondary hover:bg-secondary/90 text-white px-6 rounded-xl font-black text-[11px] tracking-widest uppercase h-11 shadow-lg shadow-secondary/20 transition-all active:scale-95 border-none">
                <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
                {t("create_enquiry_btn")}
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
            <Input
              type="search"
              className="pl-10 bg-white border-primary/10 rounded-xl h-11 font-medium text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10 shadow-xs"
              placeholder={t("search_enquiries")}
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
                  {filter === "Approved" && t("approved_filter")}
                  {filter === "Rejected" && t("rejected_filter")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enquiries List */}
        <div className="grid gap-5">
          {filteredEnquiries.length === 0 ? (
            <div className="flex h-[240px] flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-primary/10">
              <Frown className="h-10 w-10 text-primary/10 mb-4" />
              <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">
                {searchQuery ? t("no_matching_enquiries") : t("no_enquiries_empty_state")}
              </p>
            </div>
          ) : (
            filteredEnquiries.map((enq) => {
              const firstItem = enq.enquiryLineItems?.[0];
              const details = enq.enquiryDetails?.[0];
              const badge = getTimeBadge(enq.createdAt, t);

              return (
                <Card
                  key={enq.id}
                  className="bg-white border border-primary/10 hover:border-primary/20 shadow-xs hover:shadow-md rounded-[20px] overflow-hidden transition-all duration-300 p-5 md:p-7 group"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Meta & Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                          ID: {enq.id.slice(0, 8)}
                        </div>
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "px-3 py-1 rounded-lg font-black text-[9px] tracking-widest uppercase shrink-0",
                          enq.status === ENQUIRY_STATUS.PENDING && "bg-amber-100 text-amber-700",
                          enq.status === ENQUIRY_STATUS.APPROVED && "bg-sky-100 text-sky-700",
                          enq.status === ENQUIRY_STATUS.COMPLETED && "bg-emerald-100 text-emerald-700",
                          (enq.status === ENQUIRY_STATUS.CANCELLED || enq.status === ENQUIRY_STATUS.REJECTED) && "bg-gray-100 text-gray-700",
                        )}
                      >
                        {enq.status === ENQUIRY_STATUS.APPROVED
                          ? t("active_status_label", "Active")
                          : enq.status === ENQUIRY_STATUS.PENDING
                            ? "Pending"
                            : enq.status}
                      </div>
                    </div>

                    {/* Requirement Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-lg font-black text-primary leading-none uppercase tracking-tight">
                        {firstItem?.item?.name || "Enquiry Items"}
                      </h3>
                      <p className="text-[9px] font-bold text-primary/30 tracking-widest uppercase truncate sm:max-w-[200px]">
                        {details?.address || t("no_location")}
                      </p>
                    </div>

                    {/* Slim Divider */}
                    <div className="h-px w-full bg-primary/5" />

                    {/* Requirement Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      <div className="flex-1 space-y-2">
                        <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.25em] leading-none">
                          {t("sourcing_requirement", "Sourcing Requirement")}
                        </p>
                        <div className="flex flex-wrap items-end gap-2">
                          <p className="text-sm font-bold text-primary/60 leading-none">
                            {enq.enquiryLineItems.length > 1 && (
                              <span className="mr-1">
                                {enq.enquiryLineItems.length} {t("items_requested")}
                              </span>
                            )}
                            {firstItem?.quantity}{" "}
                            {firstItem?.unitType &&
                              UNIT_TYPE_LABELS[
                                firstItem.unitType as UnitType
                              ]}{" "}
                             Requested
                          </p>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-white h-10 w-full md:w-auto px-6 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all duration-300 border-none shadow-sm shadow-primary/20"
                      >
                        <Link
                          href={`/seller-dashboard/b2b-enquiries/${enq.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          {t("view_details")}
                          <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
