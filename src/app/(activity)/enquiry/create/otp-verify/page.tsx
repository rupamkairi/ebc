"use client";

import { BuyerOtpForm } from "@/components/dashboard/buyer/shared/buyer-otp-form";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { useEnquiryStore } from "@/store/enquiryStore";
import { useLanguage } from "@/hooks/useLanguage";

export default function OTPVerifyPage() {
  const router = useRouter();
  const { buyerDetails } = useEnquiryStore();
  const { t } = useLanguage();

  const handleVerify = () => {
    toast.success(t("verified_successfully"));
    router.replace("/enquiry/create/review-submit");
  };

  if (!buyerDetails?.phoneNumber) {
    router.replace("/enquiry/create");
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
