"use client";

import { useAppointmentStore } from "@/store/appointmentStore";
import { useCreateAppointmentMutation } from "@/queries/activityQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AppointmentReview } from "@/components/appointment/appointment-review";
import { toast } from "sonner";

export default function AppointmentReviewSubmitPage() {
  const router = useRouter();
  const { item, timeSlots, buyerDetails, resetAppointment } =
    useAppointmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAppointment = useCreateAppointmentMutation();

  const handleSubmit = async () => {
    if (!buyerDetails || !item || timeSlots.length === 0) {
      toast.error("Missing details or slots");
      return;
    }

    setIsSubmitting(true);

    // Construct payload
    const payload = {
      lineItems: [
        {
          itemId: item.itemId,
          // remarks: item.description || "", // If definitions line up
        },
      ],
      details: {
        remarks: "Web Appointment Request",
        address: buyerDetails.address,
        pincodeDirectoryId: buyerDetails.pincodeDirectoryId,
      },
      slots: timeSlots.map((slot) => {
        const fromDate = new Date(slot.date);
        const [startH, startM] = slot.startTime.split(":").map(Number);
        fromDate.setHours(startH, startM, 0, 0);

        const toDate = new Date(slot.date);
        const [endH, endM] = slot.endTime.split(":").map(Number);
        toDate.setHours(endH, endM, 0, 0);

        return {
          remarks: `${slot.date} ${slot.startTime}-${slot.endTime}`,
          fromDateTime: fromDate,
          toDateTime: toDate,
        };
      }),
    };

    createAppointment.mutate(payload, {
      onSuccess: () => {
        toast.success("Appointment request submitted");
        setIsSubmitting(false);
        resetAppointment();
        router.replace("/appointment/create/submit-success");
      },
      onError: (error) => {
        toast.error("Failed to submit appointment");
        console.error(error);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Appointment</h1>
        <p className="text-muted-foreground">
          Please verify all details before submitting.
        </p>
      </div>

      <AppointmentReview onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
