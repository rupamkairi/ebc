"use client";

import { EnquiryReview } from "@/components/enquiry/enquiry-review";
import { useEnquiryStore } from "@/store/enquiryStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ReviewSubmitPage() {
  const router = useRouter();
  const resetEnquiry = useEnquiryStore((state) => state.resetEnquiry);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // On success
    setIsSubmitting(false);
    resetEnquiry(); // Clear store
    router.replace("/enquiry/create/submit-success");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Your Enquiry</h1>
        <p className="text-muted-foreground">
          Please verify all details before submitting.
        </p>
      </div>

      <EnquiryReview onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
