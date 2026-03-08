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
import { useAssignmentsQuery } from "@/queries/activityQueries";
import { Input } from "@/components/ui/input";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { ACTIVITY_TYPE } from "@/constants/enums";
import { cn } from "@/lib/utils";
import { getTimeBadge } from "@/lib/activity-utils";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function EnquiriesPage() {
  const { t } = useLanguage();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const [showResponded, setShowResponded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assignments = [], isLoading: loading } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Split into pending (active) vs responded
  const pendingAssignments = assignments.filter(
    (a) => !a.enquiry?.status || a.enquiry.status === "PENDING",
  );
  const respondedAssignments = assignments.filter(
    (a) => a.enquiry?.status && a.enquiry.status !== "PENDING",
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
            enq.enquiryLineItems.some((li) =>
              li.item?.name?.toLowerCase().includes(q),
            )
          );
        })
      : list;

  const visiblePending = filterBySearch(pendingAssignments);
  const visibleResponded = filterBySearch(respondedAssignments);

  // Set of responded enquiry IDs for notification badge
  const respondedEnquiryIds = new Set(
    respondedAssignments.map((a) => a.enquiry!.id),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="col-span-4 flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-[#3D52A0]">
              {t("active_enquiries")}
            </h1>
            <p className="text-[#3D52A0]/60 font-medium text-base ml-1">
              {t("manage_respond_enquiries_buyer")}
            </p>
          </div>
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3D52A0]/30 group-focus-within:text-[#3D52A0] transition-colors" />
            <Input
              type="search"
              placeholder={t("search_enquiries")}
              className="h-10 pl-9 bg-white border-[#3D52A0]/10 rounded-xl focus:border-[#3D52A0] focus:ring-[#3D52A0]/10 transition-all placeholder:text-[#3D52A0]/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Active / Pending ─────────────────────────────────────── */}
        <div className="grid gap-5">
          {visiblePending.length === 0 ? (
            <div className="flex h-[240px] flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-[#3D52A0]/10">
              <p className="text-[#3D52A0]/40 font-bold">
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
                  className="bg-white border border-[#3D52A0]/10 hover:border-[#3D52A0]/20 shadow-xs hover:shadow-md rounded-[20px] overflow-hidden transition-all duration-300 p-5 md:p-7"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Meta & Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-3 py-1 rounded-full border border-[#3D52A0]/10 text-[#3D52A0] text-[9px] font-black tracking-widest bg-[#3D52A0]/5 uppercase">
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
                      <div className="px-3 py-1 rounded-lg bg-[#FFA500]/10 text-[#FFA000] font-black text-[9px] tracking-widest uppercase shrink-0">
                        {enq.status || "Pending"}
                      </div>
                    </div>

                    {/* Buyer Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-lg font-black text-[#3D52A0] leading-none">
                        {enq.createdBy?.name || t("anonymous_buyer")}
                      </h3>
                      <p className="text-[9px] font-bold text-[#3D52A0]/30 tracking-widest uppercase truncate sm:max-w-[200px]">
                        {details?.address || t("no_location")}
                      </p>
                    </div>

                    {/* Slim Divider */}
                    <div className="h-px w-full bg-[#3D52A0]/5" />

                    {/* Requirement Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      <div className="flex-1 space-y-2">
                        <p className="text-[9px] font-black text-[#3D52A0]/40 uppercase tracking-[0.25em] leading-none">
                          {t("enquiry")}
                        </p>
                        <div className="flex flex-wrap items-end gap-2">
                          <p className="text-base font-bold text-[#3D52A0] leading-none">
                            {firstItem?.item?.name || "Enquiry Items"}
                          </p>
                          {enq.enquiryLineItems.length > 1 && (
                            <span className="text-[#3D52A0]/30 font-bold text-[10px] pb-0.5">
                              (+{enq.enquiryLineItems.length - 1} {t("more")})
                            </span>
                          )}
                          <span className="text-[#3D52A0]/20 mx-1 hidden sm:inline">
                            •
                          </span>
                          <p className="text-[10px] font-bold text-[#3D52A0]/40 tracking-tight pb-0.5">
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
                        className="bg-[#0F28A9] hover:bg-[#1A237E] text-white h-10 w-full md:w-auto px-6 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all duration-300 border-none shadow-sm shadow-[#0F28A9]/20"
                      >
                        <Link
                          href={`/seller-dashboard/enquiries/${enq.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          {enq.status === "PENDING"
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

            {showResponded && (
              <div className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {visibleResponded.map((assignment) => {
                  const enq = assignment.enquiry;
                  if (!enq) return null;
                  const firstItem = enq.enquiryLineItems?.[0];
                  const details = enq.enquiryDetails?.[0];
                  return (
                    <Card
                      key={assignment.id}
                      className="bg-white/60 border border-green-100 shadow-xs rounded-[20px] overflow-hidden p-5 md:p-7 opacity-80"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="px-3 py-1 rounded-full border border-[#3D52A0]/10 text-[#3D52A0] text-[9px] font-black tracking-widest bg-[#3D52A0]/5 uppercase">
                              ID: {enq.id.slice(0, 8)}
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-black text-[9px] tracking-widest uppercase shrink-0 flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            {enq.status}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-base font-black text-[#3D52A0]/70 leading-none">
                            {enq.createdBy?.name || t("anonymous_buyer")}
                          </h3>
                          <p className="text-[9px] font-bold text-[#3D52A0]/30 tracking-widest uppercase truncate sm:max-w-[200px]">
                            {details?.address || t("no_location")}
                          </p>
                        </div>

                        <div className="h-px w-full bg-[#3D52A0]/5" />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-[9px] font-black text-[#3D52A0]/40 uppercase tracking-[0.25em] mb-1">
                              {t("enquiry")}
                            </p>
                            <p className="text-sm font-bold text-[#3D52A0]/60">
                              {firstItem?.item?.name || "Enquiry Items"}
                              {enq.enquiryLineItems.length > 1 && (
                                <span className="text-[10px] ml-1 text-[#3D52A0]/30">
                                  (+{enq.enquiryLineItems.length - 1} more)
                                </span>
                              )}
                            </p>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            className="h-9 w-full md:w-auto px-5 rounded-xl font-black text-[11px] tracking-widest uppercase border-[#3D52A0]/20 text-[#3D52A0]/60"
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
