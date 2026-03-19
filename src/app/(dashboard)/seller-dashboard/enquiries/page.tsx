"use client";

import {
  Search,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useAssignmentsQuery, useQuotationsQuery } from "@/queries/activityQueries";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import { Input } from "@/components/ui/input";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { ACTIVITY_TYPE, ENQUIRY_STATUS } from "@/constants/enums";
import { cn } from "@/lib/utils";
import { getTimeBadge } from "@/lib/activity-utils";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { EnquiryLineItem } from "@/types/activity";

export default function EnquiriesPage() {
  const { t } = useLanguage();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const [showResponded, setShowResponded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assignments = [], isLoading: loadingAssignments } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });

  const { data: myQuotations = [], isLoading: loadingQuotations } = useQuotationsQuery();

  // Fetch seller's own item listings to filter assignments by category match
  const { data: myListings = [] } = useItemListingsQuery({
    entityId: mainEntity?.id,
  });

  // Build a Set of category IDs the seller actually serves
  const myCategoryIds = useMemo(() => {
    const ids = new Set<string>();
    myListings.forEach((listing) => {
      if (listing.item?.categoryId) ids.add(listing.item.categoryId);
    });
    return ids;
  }, [myListings]);

  // Filter: only show assignments whose enquiry item category matches the seller's catalog
  const relevantAssignments = useMemo(() => {
    if (myCategoryIds.size === 0) return assignments; // no listings yet → show all (don't block new sellers)
    return assignments.filter((a) => {
      const enquiryItems = a.enquiry?.enquiryLineItems;
      if (!enquiryItems || enquiryItems.length === 0) return true; // edge case: show if no item info
      return enquiryItems.some(
        (li: EnquiryLineItem) => li.item?.categoryId && myCategoryIds.has(li.item.categoryId)
      );
    });
  }, [assignments, myCategoryIds]);

  if (loadingAssignments || loadingQuotations) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // IDs of enquiries this seller has actually sent a quotation for
  const myRespondedEnquiryIds = new Set(
    myQuotations
      .filter(q => !!mainEntity?.id && (q.createdBy?.staffAtEntityId === mainEntity.id || 
                   q.createdBy?.createdEntities?.some(e => e.id === mainEntity.id)))
      .map((q) => q.enquiryId)
  );

  // IDs of enquiries where buyer has requested a revision from this seller, and it has NOT been sent yet
  const myRevisionRequestedEnquiryIds = new Set(
    myQuotations
      .filter(q => !!mainEntity?.id && (q.createdBy?.staffAtEntityId === mainEntity.id || 
                   q.createdBy?.createdEntities?.some(e => e.id === mainEntity.id)) && q.quotationDetails?.[0]?.requestedRevision && !q.quotationDetails?.[0]?.hasBeenRevised)
      .map((q) => q.enquiryId)
  );

  // IDs of enquiries where this seller has already responded to a revision request
  const myRevisedEnquiryIds = new Set(
    myQuotations
      .filter(q => !!mainEntity?.id && (q.createdBy?.staffAtEntityId === mainEntity.id || 
                   q.createdBy?.createdEntities?.some(e => e.id === mainEntity.id)) && q.quotationDetails?.[0]?.hasBeenRevised)
      .map((q) => q.enquiryId)
  );

  // Split into pending (active) vs responded
  const pendingAssignments = relevantAssignments.filter(
    (a) => 
      a.enquiry?.id && 
      (!myRespondedEnquiryIds.has(a.enquiry.id) || myRevisionRequestedEnquiryIds.has(a.enquiry.id)) && 
      (!a.enquiry?.status || (a.enquiry.status !== ENQUIRY_STATUS.APPROVED && a.enquiry.status !== ENQUIRY_STATUS.COMPLETED)),
  );
  
  const respondedAssignments = relevantAssignments.filter(
    (a) => a.enquiry?.id && myRespondedEnquiryIds.has(a.enquiry.id) && !myRevisionRequestedEnquiryIds.has(a.enquiry.id),
  );

  // Apply search to both
  const filterBySearch = (list: typeof assignments) =>
    searchQuery.trim()
      ? list.filter((a) => {
          const enq = a.enquiry;
          if (!enq) return false;
          const q = searchQuery.toLowerCase();
          return (
            enq.id.toLowerCase().includes(q) ||
            enq.createdBy?.name?.toLowerCase().includes(q) ||
            enq.enquiryLineItems.some((li: EnquiryLineItem) =>
              li.item?.name?.toLowerCase().includes(q),
            )
          );
        })
      : list;

  const visiblePending = filterBySearch(pendingAssignments);
  const visibleResponded = filterBySearch(respondedAssignments);

  // Visible lists

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary">
              {t("active_enquiries")}
            </h1>
            <p className="text-sm text-primary/60 font-medium mt-1">
              {t("manage_respond_enquiries_buyer")}
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
          <Input
            type="search"
            className="pl-10 bg-white border-primary/10 rounded-xl h-11 font-medium text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10"
            placeholder={t("search_enquiries")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ── Active / Pending ─────────────────────────────────────── */}
        <div className="grid gap-5">
          {visiblePending.length === 0 ? (
            <div className="flex h-[240px] flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-primary/10">
              <p className="text-primary/40 font-bold">
                {searchQuery
                  ? t("no_matching_enquiries")
                  : t("all_enquiries_responded")}
              </p>
            </div>
          ) : (
            visiblePending.map((assignment) => {
              const enq = assignment.enquiry;
              if (!enq) return null;

              const firstItem = enq.enquiryLineItems?.[0];
              const details = enq.enquiryDetails?.[0];
              const badge = getTimeBadge(enq.createdAt, t);

              return (
                <Card
                  key={assignment.id}
                  className="bg-white border border-primary/10 hover:border-primary/20 shadow-xs hover:shadow-md rounded-[20px] overflow-hidden transition-all duration-300 p-5 md:p-7"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Meta & Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                          ID: {enq.id.slice(0, 8)}
                        </div>
                        {myRevisionRequestedEnquiryIds.has(enq.id) && (
                          <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-[9px] font-black tracking-widest uppercase">
                            {t("revision_requested", "Requested Revision")}
                          </div>
                        )}
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary font-black text-[9px] tracking-widest uppercase shrink-0">
                        {enq.status === ENQUIRY_STATUS.PENDING ? "Pending" : enq.status}
                      </div>
                    </div>

                    {/* Buyer Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-lg font-black text-primary leading-none">
                        {enq.createdBy?.name || t("anonymous_buyer")}
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
                          {t("enquiry")}
                        </p>
                        <div className="flex flex-wrap items-end gap-2">
                          <p className="text-base font-bold text-primary leading-none">
                            {firstItem?.item?.name || "Enquiry Items"}
                          </p>
                          {enq.enquiryLineItems.length > 1 && (
                            <span className="text-primary/30 font-bold text-[10px] pb-0.5">
                              (+{enq.enquiryLineItems.length - 1} {t("more")})
                            </span>
                          )}
                          <span className="text-primary/20 mx-1 hidden sm:inline">
                            •
                          </span>
                          <p className="text-[10px] font-bold text-primary/40 tracking-tight pb-0.5">
                            {firstItem?.quantity}{" "}
                            {firstItem?.unitType &&
                              UNIT_TYPE_LABELS[
                                firstItem.unitType as UnitType
                              ]}{" "}
                            {t("piece_requested")}
                          </p>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-white h-10 w-full md:w-auto px-6 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all duration-300 border-none shadow-sm shadow-primary/20"
                      >
                        <Link
                          href={`/seller-dashboard/enquiries/${enq.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          {enq.status === ENQUIRY_STATUS.PENDING
                            ? t("respond")
                            : t("details")}
                          <ChevronRight size={14} strokeWidth={3} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* ── Responded section ─────────────────────────────────────── */}
        {respondedAssignments.length > 0 && (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setShowResponded((v) => !v)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-black text-green-800 tracking-tight">
                  {t("responded_enquiries")}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px] font-black">
                  {respondedAssignments.length}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-green-600 transition-transform duration-300",
                  showResponded ? "rotate-180" : "",
                )}
              />
            </button>

            {showResponded &&  (
              <div className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {visibleResponded.map((assignment) => {
                  const enq = assignment.enquiry;
                  if (!enq) return null;
                  const firstItem = enq.enquiryLineItems?.[0];
                  const details = enq.enquiryDetails?.[0];
                  return (
                    <Card
                      key={assignment.id}
                      className={cn("border-green-100 bg-white/60 border shadow-xs rounded-[20px] overflow-hidden p-5 md:p-7", enq.status === "COMPLETED" ? "opacity-80" : "opacity-100")}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                              ID: {enq.id.slice(0, 8)}
                            </div>
                            {myRevisedEnquiryIds.has(enq.id) && (
                              <div className="px-3 py-1 rounded-full bg-violet-600 text-white text-[9px] font-black tracking-widest uppercase">
                                {t("revised", "Revised")}
                              </div>
                            )}
                          </div>
                          <div className={cn("px-3 py-1 rounded-lg  font-black text-[9px] tracking-widest uppercase shrink-0 flex items-center gap-1", enq.status === ENQUIRY_STATUS.COMPLETED ? "bg-green-100 text-green-700" : "bg-green-100 text-orange-700")}>
                            <CheckCircle2 size={10} />
                            {enq.status}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-base font-black text-primary/70 leading-none">
                            {enq.createdBy?.name || t("anonymous_buyer")}
                          </h3>
                          <p className="text-[9px] font-bold text-primary/30 tracking-widest uppercase truncate sm:max-w-[200px]">
                            {details?.address || t("no_location")}
                          </p>
                        </div>

                        <div className="h-px w-full bg-primary/5" />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.25em] mb-1">
                              {t("enquiry")}
                            </p>
                            <p className="text-sm font-bold text-primary/60">
                              {firstItem?.item?.name || "Enquiry Items"}
                              {enq.enquiryLineItems.length > 1 && (
                                <span className="text-[10px] ml-1 text-primary/30">
                                  (+{enq.enquiryLineItems.length - 1} more)
                                </span>
                              )}
                            </p>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            className="h-9 w-full md:w-auto px-5 rounded-xl font-black text-[11px] tracking-widest uppercase border-primary/20 text-primary/60"
                          >
                            <Link
                              href={`/seller-dashboard/enquiries/${enq.id}`}
                              className="flex items-center justify-center gap-2"
                            >
                              {t("view_details")}
                              <ChevronRight size={13} strokeWidth={3} />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
