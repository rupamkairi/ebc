"use client";

import { useAppointmentStore } from "@/store/appointmentStore";
import { useCreateAppointmentMutation } from "@/queries/activityQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AppointmentReview } from "@/components/dashboard/buyer/appointment/appointment-review";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft } from "lucide-react";

export default function AppointmentReviewSubmitPage() {
  const router = useRouter();
  const { item, timeSlots, buyerDetails, resetAppointment } =
    useAppointmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const createAppointment = useCreateAppointmentMutation();

  const handleSubmit = async () => {
    if (!buyerDetails || !item || timeSlots.length === 0) {
      toast.error(t("missing_details_slots"));
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
        remarks: buyerDetails.description || t("web_appointment_request"),
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
        toast.success(t("appointment_request_submitted"));
        setIsSubmitting(false);
        resetAppointment();
        router.replace("/appointment/create/submit-success");
      },
      onError: (error) => {
        toast.error(t("failed_submit_appointment"));
        console.error(error);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-8 animate-in fade-in duration-700">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {t("review_appointment")}
        </h1>
        <p className="text-primary/60 font-medium ml-1">
          {t("verify_details_before_submit")}
        </p>
      </div>

      <AppointmentReview onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
