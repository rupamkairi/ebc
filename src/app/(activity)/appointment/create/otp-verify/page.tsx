"use client";

import { BuyerOtpForm } from "@/components/dashboard/buyer/shared/buyer-otp-form";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { useAppointmentStore } from "@/store/appointmentStore";
import { useLanguage } from "@/hooks/useLanguage";

export default function AppointmentOTPVerifyPage() {
  const router = useRouter();
  const { buyerDetails } = useAppointmentStore();
  const { t } = useLanguage();

  const handleVerify = () => {
    toast.success(t("verified_successfully"));
    router.replace("/appointment/create/review-submit");
  };

  if (!buyerDetails?.phoneNumber) {
    router.replace("/appointment/create");
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <BuyerOtpForm
        phoneNumber={buyerDetails.phoneNumber}
        onVerify={handleVerify}
      />
    </div>
  );
}
