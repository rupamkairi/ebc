"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/types/activity";
import { format } from "date-fns";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Clock,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useVisitsQuery } from "@/queries/activityQueries";
import Link from "next/link";
import { Visit } from "@/types/activity";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { t } = useLanguage();
  const firstItem = appointment.appointmentLineItems?.[0];
  const details = appointment.appointmentDetails?.[0];
  const slots = appointment.appointmentSlots || [];

  const { data: visits } = useVisitsQuery({ appointmentId: appointment.id });
  const confirmedSlotId = visits?.find((v: Visit) => v.isActive)?.visitSlot?.id;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
    }
  };

  const parseSlot = (remarks: string) => {
    if (!remarks) return { date: "N/A", time: "" };
    const parts = remarks.split(" ");
    if (parts.length >= 2) {
      try {
        return {
          date: format(new Date(parts[0]), "PPP"),
          time: parts[1],
        };
      } catch {
        return { date: remarks, time: "" };
      }
    }
    return { date: remarks, time: "" };
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-primary/10 overflow-hidden group rounded-2xl bg-white">
      <CardHeader className="pb-4 border-b bg-slate-50/30">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-primary/40 tracking-wider">
              {t("appointment_id")}
            </span>
            <CardTitle className="text-sm font-black text-primary flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-secondary" />
              <span className="truncate max-w-[200px] sm:max-w-md">
                {firstItem?.item?.name || "Appointment Item"}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px] font-black text-primary/60 mt-1 uppercase">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                #{appointment.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-primary/20">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(appointment.createdAt), "dd MMM yyyy")}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(appointment.status || "PENDING")} font-bold text-[10px] uppercase px-3 py-1 rounded-full border shadow-xs`}
          >
            {appointment.status
              ? appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1).toLowerCase()
              : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div>
              <span className="text-[10px] font-black uppercase text-primary/60 mb-4 tracking-widest flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("preferred_time_slots")}
              </span>
              <div className="flex flex-wrap gap-3">
                {slots.map((slot, index) => {
                  const parsed = parseSlot(slot.remarks || "");
                  const isChosen = slot.id === confirmedSlotId;
                  return (
                    <div
                      key={slot.id || index}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 relative ${
                        isChosen
                          ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                          : "bg-slate-50 border-slate-100 hover:border-primary/20"
                      }`}
                    >
                      {isChosen && (
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm z-10">
                          {t("chosen_slot", "CHOSEN")}
                        </div>
                      )}
                      <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50">
                        <CalendarDays className={`h-4 w-4 ${isChosen ? "text-primary" : "text-primary/40"}`} />
                      </div>
                      <div className="text-xs">
                        <p className="font-black text-primary">
                          {parsed.date}
                        </p>
                        <p className="text-primary/60 font-bold uppercase text-[9px] mt-0.5 tracking-wider">
                          {parsed.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {slots.length === 0 && (
                  <p className="text-xs font-bold text-primary/40">
                    {t("no_slots_specified")}
                  </p>
                )}
              </div>
            </div>

            {details?.remarks && (
              <div className="pt-5 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase text-primary/60 mb-3 tracking-widest flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("additional_details")}
                </span>
                <div className="flex items-start gap-3 text-xs font-bold text-primary/80 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <MapPin className="h-4 w-4 shrink-0 text-primary/40 mt-0.5" />
                  <p className="leading-relaxed">{details.remarks}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-end shrink-0 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white border-primary/20 text-primary font-black text-xs px-8 h-12 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 uppercase tracking-widest group"
            >
              <Link href={`/buyer-dashboard/appointments/${appointment.id}`}>
                {t("view_details")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
