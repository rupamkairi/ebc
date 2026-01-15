"use client";

import { EnquiryReview } from "@/components/dashboard/buyer/enquiry/enquiry-review";
import { useEnquiryStore } from "@/store/enquiryStore";
import { useCreateEnquiryMutation } from "@/queries/activityQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ReviewSubmitPage() {
  const router = useRouter();
  const { items, buyerDetails, resetEnquiry } = useEnquiryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEnquiry = useCreateEnquiryMutation();

  const handleSubmit = async () => {
    if (!buyerDetails || items.length === 0) {
      toast.error("Missing details or items");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      lineItems: items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        unitType: item.unit || "Piece",
        remarks: item.remarks || "",
        flexibleWithBrands: true, // Defaulting to true as per common flow
      })),
      details: {
        address: buyerDetails.address,
        remarks: "Enquiry via Web",
        pincodeDirectoryId: buyerDetails.pincodeDirectoryId,
      },
    };

    createEnquiry.mutate(payload, {
      onSuccess: () => {
        toast.success("Enquiry submitted successfully");
        setIsSubmitting(false);
        resetEnquiry();
        router.replace("/enquiry/create/submit-success");
      },
      onError: (error) => {
        toast.error("Failed to submit enquiry");
        console.error(error);
        setIsSubmitting(false);
      },
    });
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
