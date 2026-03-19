"use client";

import {
  Search,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useAssignmentsQuery } from "@/queries/activityQueries";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import { Input } from "@/components/ui/input";
import { ACTIVITY_TYPE } from "@/constants/enums";
import { cn } from "@/lib/utils";
import { getTimeBadge } from "@/lib/activity-utils";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { format } from "date-fns";
import { AppointmentLineItem } from "@/types/activity";

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assignments = [], isLoading: loading } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.APPOINTMENT_ASSIGNMENT,
  });

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

  // Filter: only show assignments whose appointment item category matches the seller's catalog
  const relevantAssignments = useMemo(() => {
    if (myCategoryIds.size === 0) return assignments; // no listings yet → show all (don't block new sellers)
    return assignments.filter((a) => {
      const appointmentItems = a.appointment?.appointmentLineItems;
      if (!appointmentItems || appointmentItems.length === 0) return true; // edge case: show if no item info
      return appointmentItems.some(
        (li: AppointmentLineItem) => li.item?.categoryId && myCategoryIds.has(li.item.categoryId)
      );
    });
  }, [assignments, myCategoryIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Split into pending (active) vs confirmed/completed
  const pendingAssignments = relevantAssignments.filter(
    (a) => !a.appointment?.status || a.appointment.status === "PENDING" || a.appointment.status === "APPROVED",
  );
  const confirmedAssignments = relevantAssignments.filter(
    (a) => a.appointment?.status && (a.appointment.status === "CONFIRMED" || a.appointment.status === "COMPLETED"),
  );

  // Filter by search
  const filterBySearch = (list: typeof assignments) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((a) => {
      const apt = a.appointment;
      if (!apt) return false;
      const buyerName = apt.createdBy?.name?.toLowerCase() || "";
      const itemName =
        apt.appointmentLineItems?.[0]?.item?.name?.toLowerCase() || "";
      const id = apt.id.toLowerCase();
      return buyerName.includes(q) || itemName.includes(q) || id.includes(q);
    });
  };

  const filteredPending = filterBySearch(pendingAssignments);
  const filteredConfirmed = filterBySearch(confirmedAssignments);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">
            {t("site_appointments")}
          </h1>
          <p className="text-sm text-primary/60 font-medium mt-1">
            {t("manage_onsite_visits")}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
        <Input
          className="pl-10 bg-white border-primary/10 rounded-xl h-11 font-medium text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10"
          placeholder={t("search_appointments")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pending Appointments */}
      {filteredPending.length === 0 && filteredConfirmed.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
          <Calendar className="h-12 w-12 text-primary/20" />
          <p className="text-primary/40 font-bold text-sm">
            {t("no_appointments_found")}
          </p>
          <p className="text-primary/30 text-xs max-w-md">
            {t("new_site_visit_requests")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPending.map((assignment) => {
            const apt = assignment.appointment;
            if (!apt) return null;

            const firstItem = apt.appointmentLineItems?.[0];
            const details = apt.appointmentDetails?.[0];
            const badge = getTimeBadge(apt.createdAt, t);
            const firstSlot = apt.appointmentSlots?.[0];

            return (
              <Card
                key={assignment.id}
                className="bg-white border border-primary/10 rounded-[20px] p-5 md:p-7 shadow-none hover:shadow-md hover:border-primary/25 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                        ID: {apt.id.slice(0, 8)}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black tracking-widest",
                          badge.className,
                        )}
                      >
                        {badge.label}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary text-white text-[9px] font-black tracking-widest uppercase">
                        {apt.status}
                      </span>
                    </div>

                    {/* Item name */}
                    <h3 className="font-black text-secondary text-base">
                      {firstItem?.item?.name || t("site_visit")}
                    </h3>

                    {/* Buyer name */}
                    <p className="text-sm text-primary/60 font-medium">
                      {t("consultation_with")}{" "}
                      <span className="font-bold text-primary/80">
                        {apt.createdBy?.name || t("anonymous_buyer")}
                      </span>
                    </p>

                    {/* Slot time if available */}
                    {firstSlot && (
                      <p className="text-xs text-primary/50 font-medium flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {format(
                          new Date(firstSlot.fromDateTime),
                          "MMM do, yyyy · h:mm a",
                        )}
                      </p>
                    )}

                    {/* Location (pincode only — full address is shown after payment) */}
                    {details?.pincode && (
                      <p className="text-xs text-primary/40 font-medium truncate max-w-md">
                        📍 {details.pincode.pincode} · {details.pincode.district}, {details.pincode.state}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center shrink-0">
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[11px] tracking-widest uppercase px-5 h-10 shadow-sm transition-all group-hover:shadow-md"
                    >
                      <Link
                        href={`/seller-dashboard/appointments/${apt.id}`}
                        className="flex items-center gap-2"
                      >
                        {t("view_details")}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmed/Completed Appointments (collapsible) */}
      {filteredConfirmed.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowConfirmed(!showConfirmed)}
            className="flex items-center gap-2 text-sm font-black text-primary/60 hover:text-primary transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t("confirmed_appointments", "Confirmed / Completed")} (
            {filteredConfirmed.length})
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showConfirmed && "rotate-180",
              )}
            />
          </button>

          {showConfirmed && (
            <div className="space-y-4">
              {filteredConfirmed.map((assignment) => {
                const apt = assignment.appointment;
                if (!apt) return null;

                const firstItem = apt.appointmentLineItems?.[0];
                const badge = getTimeBadge(apt.createdAt, t);

                return (
                  <Card
                    key={assignment.id}
                    className="bg-white/60 border border-gray-100 rounded-[20px] p-5 md:p-7 shadow-none group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                            ID: {apt.id.slice(0, 8)}
                          </span>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-black tracking-widest",
                              badge.className,
                            )}
                          >
                            {badge.label}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-green-600 text-white text-[9px] font-black tracking-widest uppercase">
                            {apt.status}
                          </span>
                        </div>
                        <h3 className="font-black text-secondary/70 text-base">
                          {firstItem?.item?.name || t("site_visit")}
                        </h3>
                        <p className="text-sm text-primary/40 font-medium">
                          {t("consultation_with")}{" "}
                          <span className="font-bold text-primary/80/60">
                            {apt.createdBy?.name || t("anonymous_buyer")}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center shrink-0">
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-xl font-black text-[11px] tracking-widest uppercase px-5 h-10"
                        >
                          <Link
                            href={`/seller-dashboard/appointments/${apt.id}`}
                            className="flex items-center gap-2"
                          >
                            {t("view_details")}
                            <ChevronRight className="h-4 w-4" />
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
  );
}
