"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  Loader2,
  Calendar,
  MapPin,
  ChevronDown,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVisitsQuery } from "@/queries/activityQueries";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { getTimeBadge } from "@/lib/activity-utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function VisitsPage() {
  const { t } = useLanguage();
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: visits = [], isLoading } = useVisitsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Split into active (pending/accepted) vs completed/cancelled
  const activeVisits = visits.filter(
    (v) =>
      v.status === "PENDING" ||
      v.status === "ACCEPTED" ||
      v.status === "SCHEDULED",
  );
  const completedVisits = visits.filter(
    (v) => v.status === "COMPLETED" || v.status === "CANCELLED",
  );

  // Filter by search
  const filterBySearch = (list: typeof visits) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((v) => {
      const buyerName = v.createdBy?.name?.toLowerCase() || "";
      const id = v.id.toLowerCase();
      // Also search by appointment item name if available
      const itemName =
        v.appointment?.appointmentLineItems?.[0]?.item?.name?.toLowerCase() ||
        "";
      return buyerName.includes(q) || id.includes(q) || itemName.includes(q);
    });
  };

  const filteredActive = filterBySearch(activeVisits);
  const filteredCompleted = filterBySearch(completedVisits);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">
            {t("my_site_visits", "Site Visits")}
          </h1>
          <p className="text-sm text-primary/60 font-medium mt-1">
            {t(
              "manage_confirmed_visits",
              "Manage your scheduled site visits and consultations",
            )}
          </p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[11px] tracking-widest uppercase px-5 h-10 shadow-sm transition-all shrink-0"
        >
          <Link href="/seller-dashboard/visits/create">
            <Plus className="h-4 w-4 mr-2" />
            {t("create_visit", "Create Visit")}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
        <Input
          className="pl-10 bg-white border-primary/10 rounded-xl h-11 font-medium text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10"
          placeholder={t(
            "search_visits",
            "Search visits by ID or buyer name...",
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Visits List */}
      {filteredActive.length === 0 && filteredCompleted.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
          <MapPin className="h-12 w-12 text-primary/20" />
          <p className="text-primary/40 font-bold text-sm">
            {t("no_visits_found", "No Visits Found")}
          </p>
          <p className="text-primary/30 text-xs max-w-md">
            {t(
              "confirm_appointments_to_see_visits",
              "Confirm appointments to schedule visits.",
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActive.map((visit) => {
            const badge = getTimeBadge(visit.createdAt, t);
            const appointment = visit.appointment;
            const firstItem = appointment?.appointmentLineItems?.[0];
            const address = appointment?.appointmentDetails?.[0]?.address;

            return (
              <Card
                key={visit.id}
                className="bg-white border border-primary/10 rounded-[20px] p-5 md:p-7 shadow-none hover:shadow-md hover:border-primary/25 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                        ID: {visit.id.slice(0, 8)}
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
                        {visit.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-secondary text-base">
                      {firstItem?.item?.name || t("site_visit", "Site Visit")}
                    </h3>

                    {/* Buyer */}
                    <p className="text-sm text-primary/60 font-medium">
                      {t("visit_with", "Visit with")}{" "}
                      <span className="font-bold text-primary">
                        {visit.createdBy?.name || t("anonymous_buyer")}
                      </span>
                    </p>

                    {/* Date/Time */}
                    <p className="text-xs text-primary/50 font-medium flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(visit.createdAt), "MMM do, yyyy")}
                    </p>

                    {/* Location */}
                    {address && (
                      <p className="text-xs text-primary/40 font-medium truncate max-w-md">
                        📍 {address}
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
                        href={`/seller-dashboard/visits/${visit.id}`}
                        className="flex items-center gap-2"
                      >
                        {t("view_details", "View Details")}
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

      {/* Completed Visits (collapsible) */}
      {filteredCompleted.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-black text-primary/60 hover:text-primary transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t("completed_visits", "Completed / Cancelled")} (
            {filteredCompleted.length})
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showCompleted && "rotate-180",
              )}
            />
          </button>

          {showCompleted && (
            <div className="space-y-4">
              {filteredCompleted.map((visit) => {
                const badge = getTimeBadge(visit.createdAt, t);
                const appointment = visit.appointment;
                const firstItem = appointment?.appointmentLineItems?.[0];

                return (
                  <Card
                    key={visit.id}
                    className="bg-white/60 border border-gray-100 rounded-[20px] p-5 md:p-7 shadow-none group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[9px] font-black tracking-widest bg-primary/5 uppercase">
                            ID: {visit.id.slice(0, 8)}
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
                              visit.status === "COMPLETED"
                                ? "bg-green-600 text-white"
                                : "bg-gray-400 text-white",
                            )}
                          >
                            {visit.status}
                          </span>
                        </div>
                        <h3 className="font-black text-secondary/70 text-base">
                          {firstItem?.item?.name || t("site_visit")}
                        </h3>
                        <p className="text-sm text-primary/40 font-medium">
                          {t("visit_with")}{" "}
                          <span className="font-bold text-primary/60">
                            {visit.createdBy?.name || t("anonymous_buyer")}
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
                            href={`/seller-dashboard/visits/${visit.id}`}
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
