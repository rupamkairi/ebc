"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/store/appointmentStore";
import { AppointmentLineItemWrapper } from "@/components/appointment/appointment-line-item";
import { DateTimeSlotSelect } from "@/components/advanced-forms/date-time-slot-select/date-time-slot-select";
import { AppointmentDetailsForm } from "@/components/appointment/appointment-details-form";

export default function CreateAppointmentPage() {
  const router = useRouter();
  const { item, timeSlots, buyerDetails, addTimeSlot, removeTimeSlot } =
    useAppointmentStore();

  const handleNext = () => {
    // 1. Validate Item
    if (!item) {
      toast.error("Please select an item for the appointment.");
      return;
    }

    // 2. Validate Time Slots
    if (timeSlots.length < 3) {
      toast.error("Please provide 3 preferred time slots.");
      return;
    }

    // 3. Validate Details (Basic check)
    if (!buyerDetails || !buyerDetails.name || !buyerDetails.phone) {
      toast.error("Please fill in your contact details.");
      return;
    }

    router.push("/appointment/create/otp-verify");
  };

  return (
    <div className="container mx-auto space-y-8 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Schedule Appointment
        </h1>
        <p className="text-muted-foreground">
          Select an item and choose your preferred time slots.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Item Selection */}
        <AppointmentLineItemWrapper />

        {/* Step 2: Time Slots & Details (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <DateTimeSlotSelect
              timeSlots={timeSlots}
              onAddSlot={addTimeSlot}
              onRemoveSlot={removeTimeSlot}
            />
          </div>
          <div className="space-y-8">
            <AppointmentDetailsForm />

            <Button onClick={handleNext} className="w-full" size="lg">
              Proceed to Verify
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
