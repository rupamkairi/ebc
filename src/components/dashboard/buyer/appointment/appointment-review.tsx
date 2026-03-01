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
  ArrowRight,
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
      <Card className="border-[#3D52A0]/10 shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-[#3D52A0]/5 pb-4 border-b border-[#3D52A0]/10">
          <CardTitle className="text-xl font-bold tracking-tight text-[#3D52A0]">
            Review Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#3D52A0]/60 flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="h-4 w-4 text-[#3D52A0]/60" />
                </div>
                <span className="font-bold text-[#3D52A0]">
                  {buyerDetails.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Mail className="h-4 w-4 text-[#3D52A0]/60" />
                </div>
                <span className="font-medium text-[#3D52A0]/80 text-sm">
                  {buyerDetails.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Phone className="h-4 w-4 text-[#3D52A0]/60" />
                </div>
                <span className="font-medium text-[#3D52A0]/80 text-sm">
                  {buyerDetails.phoneNumber}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                  <MapPin className="h-4 w-4 text-[#3D52A0]/60" />
                </div>
                <span className="font-medium text-[#3D52A0]/80 text-sm leading-relaxed">
                  {buyerDetails.address} (Pin: {buyerDetails.pincode})
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-[#3D52A0]/10" />

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#3D52A0]/60">
              Appointment For
            </h3>
            <div className="p-4 border border-[#3D52A0]/10 rounded-xl bg-[#3D52A0]/5 flex justify-between items-center sm:flex-row flex-col gap-2 sm:gap-0">
              <p className="font-bold text-lg text-[#3D52A0]">{item.title}</p>
              <span className="bg-white border border-[#3D52A0]/10 text-[#3D52A0] px-3 py-1 rounded-lg text-xs font-semibold shadow-sm">
                {item.type}
              </span>
            </div>
          </div>

          <Separator className="bg-[#3D52A0]/10" />

          {/* Time Slots */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#3D52A0]/60">
              Preferred Time Slots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 border border-slate-100 rounded-xl hover:border-[#3D52A0]/20 flex items-center gap-3 bg-white shadow-sm transition-all group"
                >
                  <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-[#FFA500] transition-colors">
                    <CalendarIcon className="h-4 w-4 text-[#FFA500] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#3D52A0]">
                      {format(new Date(slot.date), "PPP")}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#3D52A0]/60 mt-0.5">
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
          className="w-full md:w-auto bg-linear-to-r from-[#0F28A9] to-[#0A1B75] hover:from-[#FFA500] hover:to-[#FF8C00] text-white font-bold tracking-tight py-7 px-10 rounded-2xl text-lg shadow-[0_20px_50px_rgba(15,40,169,0.3)] transition-all duration-500 hover:scale-105 active:scale-95 border-none flex items-center gap-2 group"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Request..." : "Request Appointment"}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </div>
    </div>
  );
}
