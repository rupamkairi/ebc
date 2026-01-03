"use client";

import { OTPVerificationForm } from "@/components/enquiry/otp-verification-form";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function AppointmentOTPVerifyPage() {
  const router = useRouter();

  const handleVerify = () => {
    toast.success("Verified successfully!");
    router.replace("/appointment/create/review-submit");
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <OTPVerificationForm onVerify={handleVerify} />
    </div>
  );
}
