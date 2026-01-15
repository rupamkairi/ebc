"use client";

import { OTPVerificationForm } from "@/components/dashboard/buyer/enquiry/otp-verification-form";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { useEnquiryStore } from "@/store/enquiryStore";

export default function OTPVerifyPage() {
  const router = useRouter();
  const { buyerDetails } = useEnquiryStore();

  const handleVerify = () => {
    toast.success("Verified successfully!");
    router.replace("/enquiry/create/review-submit");
  };

  if (!buyerDetails?.phoneNumber) {
    router.replace("/enquiry/create");
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
