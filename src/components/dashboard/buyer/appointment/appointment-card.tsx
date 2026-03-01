"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/types/activity";
import { format } from "date-fns";
import { CalendarDays, MapPin, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const firstItem = appointment.appointmentLineItems?.[0];
  const details = appointment.appointmentDetails?.[0];
  const slots = appointment.appointmentSlots || [];

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "COMPLETED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
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
    <Card className="hover:shadow-lg transition-all duration-300 border-[#3D52A0]/10 overflow-hidden group">
      <CardHeader className="pb-4 border-b bg-slate-50/50">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#3D52A0]/40">
              Appointment ID
            </span>
            <CardTitle className="text-sm font-bold text-[#3D52A0] flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="truncate max-w-[200px] sm:max-w-md">
                {firstItem?.item?.name || "Appointment Item"}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#3D52A0]/60 mt-1">
              <span className="font-mono">
                #{appointment.id.slice(0, 8).toUpperCase()}
              </span>
              <span>•</span>
              <span>
                {format(new Date(appointment.createdAt), "dd MMM yyyy")}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(appointment.status || "PENDING")} font-semibold text-xs px-3 py-1 rounded-full border shadow-sm`}
          >
            {appointment.status
              ? appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1).toLowerCase()
              : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div>
              <span className="text-xs font-semibold text-[#3D52A0]/60 block mb-3">
                Preferred Time Slots
              </span>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot, index) => {
                  const parsed = parseSlot(slot.remarks || "");
                  return (
                    <div
                      key={slot.id || index}
                      className="flex items-center gap-2 px-3 py-2 bg-[#3D52A0]/5 rounded-xl border border-[#3D52A0]/10 hover:border-[#3D52A0]/20 transition-colors"
                    >
                      <Clock className="h-3.5 w-3.5 text-[#3D52A0]" />
                      <div className="text-xs">
                        <p className="font-bold text-[#3D52A0]">
                          {parsed.date}
                        </p>
                        <p className="text-[#3D52A0]/60 font-medium">
                          {parsed.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {slots.length === 0 && (
                  <p className="text-sm font-medium text-[#3D52A0]/40">
                    No time slots specified
                  </p>
                )}
              </div>
            </div>

            {details?.remarks && (
              <div className="pt-4 border-t border-[#3D52A0]/10">
                <span className="text-xs font-semibold text-[#3D52A0]/60 block mb-2">
                  Additional Details
                </span>
                <div className="flex items-start gap-2 text-xs font-medium text-[#3D52A0]/70 bg-[#3D52A0]/5 p-3 rounded-xl border border-[#3D52A0]/10">
                  <MapPin className="h-4 w-4 shrink-0 text-[#3D52A0]/40 mt-0.5" />
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
              className="bg-white border-[#3D52A0]/20 text-[#3D52A0] font-semibold text-sm px-6 h-10 rounded-xl hover:bg-[#3D52A0] hover:text-white transition-all shadow-sm"
            >
              <Link
                href={`/buyer-dashboard/appointments/${appointment.id}`}
                className="flex items-center gap-2"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
