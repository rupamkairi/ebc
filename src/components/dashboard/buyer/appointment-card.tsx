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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b bg-muted/5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span className="truncate max-w-[200px] sm:max-w-md">
                {firstItem?.item?.name || "Appointment Item"}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">
                ID: {appointment.id.slice(0, 8)}
              </span>
              <span>•</span>
              <span>
                Created {format(new Date(appointment.createdAt), "PP")}
              </span>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status || "PENDING")}>
            {appointment.status || "PENDING"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-2">
                Preferred Time Slots
              </span>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot, index) => {
                  const parsed = parseSlot(slot.remarks || "");
                  return (
                    <div
                      key={slot.id || index}
                      className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-md border border-primary/10"
                    >
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <div className="text-xs">
                        <p className="font-semibold">{parsed.date}</p>
                        <p className="text-muted-foreground">{parsed.time}</p>
                      </div>
                    </div>
                  );
                })}
                {slots.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No time slots specified
                  </p>
                )}
              </div>
            </div>

            {details?.remarks && (
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                  Additional Details
                </span>
                <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{details.remarks}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-end shrink-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-primary hover:text-primary hover:bg-primary/5 border-primary/20"
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
