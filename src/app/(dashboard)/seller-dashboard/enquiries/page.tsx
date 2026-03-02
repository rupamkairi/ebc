"use client";

import { Search, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
} from "@/components/ui/card";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useAssignmentsQuery } from "@/queries/activityQueries";
import { ActivityAssignment } from "@/types/activity";
import { Input } from "@/components/ui/input";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { ACTIVITY_TYPE } from "@/constants/enums";
import { cn } from "@/lib/utils";

export default function EnquiriesPage() {
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];

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

  const getTimeBadge = (date: string) => {
    const diffInDays = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24),
    );
    if (diffInDays < 1)
      return { label: "New", className: "bg-[#FFA500] text-white" };
    if (diffInDays < 7)
      return { label: `${diffInDays}d ago`, className: "bg-[#1A237E] text-white" };
    return {
      label: `${Math.floor(diffInDays / 7)}w ago`,
      className: "bg-[#BDBDBD] text-white",
    };
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#3D52A0]">
            Active Enquiries
          </h1>
          <p className="text-[#3D52A0]/60 font-medium text-base ml-1">
            Manage and respond to enquiries from potential Buyer
          </p>
        </div>
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3D52A0]/30 group-focus-within:text-[#3D52A0] transition-colors" />
          <Input
            type="search"
            placeholder="Search enquiries..."
            className="h-10 pl-9 bg-white border-[#3D52A0]/10 rounded-xl focus:border-[#3D52A0] focus:ring-[#3D52A0]/10 transition-all placeholder:text-[#3D52A0]/20 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-5">
        {assignments.length === 0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-[#3D52A0]/10">
            <p className="text-[#3D52A0]/40 font-bold">
              No enquiries assigned yet.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const enq = assignment.enquiry;
            if (!enq) return null;

            const firstItem = enq.enquiryLineItems?.[0];
            const details = enq.enquiryDetails?.[0];
            const badge = getTimeBadge(enq.createdAt);

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
                      {enq.createdBy?.name || "Anonymous Buyer"}
                    </h3>
                    <p className="text-[9px] font-bold text-[#3D52A0]/30 tracking-widest uppercase truncate sm:max-w-[200px]">
                      {details?.address || "No Location"}
                    </p>
                  </div>

                  {/* Slim Divider */}
                  <div className="h-px w-full bg-[#3D52A0]/5" />

                  {/* Requirement Section */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    <div className="flex-1 space-y-2">
                      <p className="text-[9px] font-black text-[#3D52A0]/40 uppercase tracking-[0.25em] leading-none">
                        Requirement
                      </p>
                      <div className="flex flex-wrap items-end gap-2">
                        <p className="text-base font-bold text-[#3D52A0] leading-none">
                          {firstItem?.item?.name || "Enquiry Items"}
                        </p>
                        {enq.enquiryLineItems.length > 1 && (
                          <span className="text-[#3D52A0]/30 font-bold text-[10px] pb-0.5">
                            (+{enq.enquiryLineItems.length - 1} MORE)
                          </span>
                        )}
                        <span className="text-[#3D52A0]/20 mx-1 hidden sm:inline">•</span>
                        <p className="text-[10px] font-bold text-[#3D52A0]/40 tracking-tight pb-0.5">
                          {firstItem?.quantity}{" "}
                          {firstItem?.unitType &&
                            UNIT_TYPE_LABELS[firstItem.unitType as UnitType]}{" "}
                          Piece requested
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
                        {enq.status === "PENDING" ? "Respond" : "Details"}
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
    </div>
  );
}
