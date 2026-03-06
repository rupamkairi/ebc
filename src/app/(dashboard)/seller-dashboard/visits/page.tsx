"use client";

import React from "react";
import { Map, MapPin, Loader2, CalendarDays, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVisitsQuery } from "@/queries/activityQueries";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export default function VisitsPage() {
  const { t } = useLanguage();

  const { data: visits = [], isLoading } = useVisitsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground/60 font-bold italic">
          {t("loading_visits", "Loading Visits...")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">
            {t("your_visits", "Your Visits")}
          </h1>
          <p className="text-foreground/60 font-bold italic mt-1">
            {t(
              "manage_confirmed_visits",
              "Manage your confirmed scheduled visits",
            )}
          </p>
        </div>
      </div>

      {/* Visits List */}
      <div className="grid gap-6">
        {visits.length === 0 ? (
          <div className="bg-muted/20 border-2 border-dashed border-muted rounded-4xl p-20 text-center">
            <Map size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground/40 italic">
              {t("no_visits_found", "No Visits Found")}
            </h3>
            <p className="text-sm text-foreground/30 italic">
              {t(
                "confirm_appointments_to_see_visits",
                "Confirm appointments to schedule visits.",
              )}
            </p>
          </div>
        ) : (
          visits.map((visit) => {
            return (
              <Card
                key={visit.id}
                className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group bg-white rounded-4xl"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Urgency Stripe */}
                    <div
                      className={cn(
                        "w-full md:w-2 h-2 md:h-auto",
                        visit.status === "PENDING"
                          ? "bg-amber-500"
                          : "bg-emerald-500",
                      )}
                    />

                    <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-muted/20 flex flex-col items-center justify-center text-foreground/20 shrink-0 group-hover:bg-primary/5 transition-colors">
                          <Map size={32} />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                              {t("visit_id", "VISIT ID")}{" "}
                              {visit.id.slice(-8).toUpperCase()}
                            </span>
                            <Badge
                              className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-3 py-1 border-none ${
                                visit.status === "PENDING"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {visit.status}
                            </Badge>
                          </div>

                          <h3 className="text-2xl font-black text-foreground italic">
                            {t("visit_with", "Visit With")}{" "}
                            <span className="text-primary">
                              {visit.createdBy?.name ||
                                t("anonymous_buyer", "Anonymous Buyer")}
                            </span>
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-bold text-foreground/40 italic">
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={16}
                                className="text-primary"
                              />
                              {format(new Date(visit.createdAt), "PPP")}
                            </div>
                            {/* Assuming address is handled elsewhere or not stored directly on Visit in this mock */}
                            <div className="flex items-center gap-3">
                              <MapPin size={16} className="text-primary" />
                              <span className="truncate max-w-[200px]">
                                {t(
                                  "location_derived",
                                  "Location derived from Appointment",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                          {visit.status === "COMPLETED" ? (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-black text-xs uppercase px-4 py-2 rounded-xl border border-emerald-100 italic">
                              <CheckCircle size={16} />{" "}
                              {t("visit_completed", "Completed")}
                            </div>
                          ) : (
                            <Button
                              className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-black rounded-2xl px-10 h-14 bg-white shadow-sm italic"
                              variant="outline"
                            >
                              {t("manage_visit", "Manage Visit")}
                            </Button>
                          )}
                        </div>
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
  );
}
