"use client";

import { OTPVerificationForm } from "@/components/dashboard/buyer/enquiry/otp-verification-form";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { useAppointmentStore } from "@/store/appointmentStore";

export default function AppointmentOTPVerifyPage() {
  const router = useRouter();
  const { buyerDetails } = useAppointmentStore();

  const handleVerify = () => {
    toast.success("Verified successfully!");
    router.replace("/appointment/create/review-submit");
  };

  if (!buyerDetails?.phoneNumber) {
    router.replace("/appointment/create");
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <OTPVerificationForm
        phoneNumber={buyerDetails.phoneNumber}
        onVerify={handleVerify}
      />
    </div>
  );
}
