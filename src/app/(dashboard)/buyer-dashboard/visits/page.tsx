"use client";

import { useVisitsQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { ReviewSnapshot } from "@/components/shared/reviews";
import { Visit } from "@/types/activity";

const filters = ["All", "Pending", "Accepted", "Completed"];

export default function BuyerVisitsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: session } = useSessionQuery();
  const { data: visits, isLoading } = useVisitsQuery({});
  const { t } = useLanguage();

  const filtered = (visits || []).filter((v: Visit) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Accepted")
      return v.status === "ACCEPTED" || v.isActive;
    if (activeFilter === "Completed") return v.status === "COMPLETED";
    return v.status === "PENDING" && !v.isActive;
  });

  return (
    <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto">
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
          {t("visits_page_title") || "Service Provider Visits"}
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t("visits_page_subtitle") ||
            "Track your scheduled visits and service providers."}
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
            {filter === "All" && (t("all_filter") || "All")}
            {filter === "Pending" && (t("pending_filter") || "Pending")}
            {filter === "Accepted" && (t("accepted_filter") || "Accepted")}
            {filter === "Completed" && (t("completed_filter") || "Completed")}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            {t("loading_visits_msg") || "Loading scheduled visits..."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-muted/20 border border-dashed rounded-2xl">
          <CalendarDays className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">
            {t("no_visits_msg") || "No visits found for this criteria."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((v: Visit) => {
            const appointmentRef =
              v.appointment?.appointmentLineItems?.[0]?.item?.name ||
              "Service Item";
            const isAccepted = v.isActive || v.status === "ACCEPTED";
            const isCompleted = v.status === "COMPLETED";

            let statusColor = "bg-amber-100 text-amber-700";
            let statusText = t("pending_label") || "PENDING";
            if (isCompleted) {
              statusColor = "bg-blue-100 text-blue-700";
              statusText = t("completed_label") || "COMPLETED";
            } else if (isAccepted) {
              statusColor = "bg-emerald-100 text-emerald-700";
              statusText = t("accepted_label") || "ACCEPTED";
            }

            return (
              <Card
                key={v.id}
                className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all bg-white rounded-2xl"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Status bar */}
                    <div
                      className={cn(
                        "w-full md:w-1.5 h-1.5 md:h-auto",
                        isCompleted
                          ? "bg-blue-500"
                          : isAccepted
                            ? "bg-emerald-500"
                            : "bg-amber-400",
                      )}
                    />
                    <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: info */}
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                              {v.id.slice(-8).toUpperCase()}
                            </span>
                            <Badge
                              className={cn(
                                "text-[10px] font-black uppercase tracking-wide border-none",
                                statusColor,
                              )}
                            >
                              {statusText}
                            </Badge>
                          </div>
                          <p className="font-black text-sm">{appointmentRef}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(v.createdAt), "dd MMM yyyy")}
                          </p>
                          <div className="pt-2">
                            <ReviewSnapshot
                              entityId={
                                v.createdBy?.staffAtEntityId ||
                                v.createdBy?.createdEntities?.[0]?.id ||
                                ""
                              }
                              entityName={
                                v.createdBy?.staffAt?.name ||
                                v.createdBy?.createdEntities?.[0]?.name ||
                                v.createdBy?.name
                              }
                              className="scale-90 origin-left"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: amount + action */}
                      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
                        <div className="text-center md:text-right bg-slate-50 p-3 rounded-xl border">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            {t("date_time_label") || "SCHEDULED FOR"}
                          </p>
                          <div className="text-xs font-bold text-primary">
                            {v.visitSlot ? (
                              <>
                                {format(
                                  new Date(v.visitSlot.fromDateTime),
                                  "PPP",
                                )}{" "}
                                <br />
                                {format(
                                  new Date(v.visitSlot.fromDateTime),
                                  "p",
                                )}{" "}
                                -{" "}
                                {format(new Date(v.visitSlot.toDateTime), "p")}
                              </>
                            ) : (
                              "Not specified"
                            )}
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-white font-black rounded-xl h-10 px-5 transition-all group/btn w-full md:w-auto"
                        >
                          <Link
                            href={`/buyer-dashboard/visits/${v.id}`}
                          >
                            Details
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
