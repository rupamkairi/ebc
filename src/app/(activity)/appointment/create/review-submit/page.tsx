"use client";

import { useAppointmentStore } from "@/store/appointmentStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AppointmentReview } from "@/components/appointment/appointment-review";

export default function AppointmentReviewSubmitPage() {
  const router = useRouter();
  const resetAppointment = useAppointmentStore(
    (state) => state.resetAppointment
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // On success
    setIsSubmitting(false);
    resetAppointment();
    router.replace("/appointment/create/submit-success");
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
