"use client";

import React from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface AppointmentReviewProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function AppointmentReview({
  onSubmit,
  isSubmitting,
}: AppointmentReviewProps) {
  const { item, timeSlots, buyerDetails } = useAppointmentStore();

  if (!buyerDetails || !item) return <div>Missing details.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{buyerDetails.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{buyerDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{buyerDetails.phoneNumber}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>
                  {buyerDetails.address} (Pin: {buyerDetails.pincode})
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Appointment For
            </h3>
            <div className="p-3 border rounded-md bg-muted/10">
              <p className="font-medium text-lg">{item.title}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {item.type}
              </p>
            </div>
          </div>

          <Separator />

          {/* Time Slots */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Preferred Time Slots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 border rounded-md flex items-center gap-3 bg-secondary/20"
                >
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(slot.date), "PPP")}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          onClick={onSubmit}
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Request..." : "Request Appointment"}
        </Button>
      </div>
    </div>
  );
}
