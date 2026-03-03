"use client";

import { useVisitsQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = ["All", "Pending", "Completed"];

export default function BuyerVisitsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: session } = useSessionQuery();
  const { data: visits, isLoading } = useVisitsQuery({});

  const filtered = (visits || []).filter((v) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Completed") return v.status === "COMPLETED";
    return v.status === "PENDING";
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
        <h1 className="text-3xl font-black text-[#3D52A0] tracking-tight">
          My Site Visits
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Track scheduled and completed site visits from service providers
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
                ? "bg-[#3D52A0] text-white shadow-[#3D52A0]/20"
                : "bg-white text-[#3D52A0] hover:bg-muted border border-muted",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#3D52A0]" />
          <p className="text-muted-foreground font-medium">Loading visits...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-muted/20 border border-dashed rounded-2xl">
          <MapPin className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">No site visits found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((v) => {
            const isCompleted = v.status === "COMPLETED";
            const isActive = v.isActive;
            const fromDate = v.visitSlot?.fromDateTime
              ? new Date(v.visitSlot.fromDateTime)
              : null;
            const toDate = v.visitSlot?.toDateTime
              ? new Date(v.visitSlot.toDateTime)
              : null;
            const provider =
              v.createdBy?.staffAt?.name || v.createdBy?.name || "Service Provider";

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
                          : isActive
                          ? "bg-emerald-500"
                          : "bg-amber-400",
                      )}
                    />
                    <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: info */}
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                            isCompleted
                              ? "bg-blue-50"
                              : isActive
                              ? "bg-emerald-50"
                              : "bg-amber-50",
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-blue-500" />
                          ) : (
                            <MapPin
                              className={cn(
                                "h-6 w-6",
                                isActive ? "text-emerald-600" : "text-amber-500",
                              )}
                            />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              className={cn(
                                "text-[10px] font-black uppercase tracking-wide border-none",
                                isCompleted
                                  ? "bg-blue-100 text-blue-700"
                                  : isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700",
                              )}
                            >
                              {isCompleted ? "Completed" : isActive ? "Confirmed" : "Awaiting"}
                            </Badge>
                          </div>
                          <p className="font-black text-sm">{provider}</p>
                          {fromDate && (
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(fromDate, "dd MMM yyyy")}
                              </span>
                              {toDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(fromDate, "p")} – {format(toDate, "p")}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: action */}
                      {v.appointmentId && (
                        <Button
                          asChild
                          variant="outline"
                          className="border-[#3D52A0] text-[#3D52A0] hover:bg-[#3D52A0] hover:text-white font-black rounded-xl h-10 px-5 transition-all group/btn shrink-0"
                        >
                          <Link href={`/buyer-dashboard/appointments/${v.appointmentId}`}>
                            View Appointment
                            <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      )}
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
