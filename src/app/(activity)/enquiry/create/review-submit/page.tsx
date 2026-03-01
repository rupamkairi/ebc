"use client";

import { EnquiryReview } from "@/components/dashboard/buyer/enquiry/enquiry-review";
import { useEnquiryStore } from "@/store/enquiryStore";
import { useCreateEnquiryMutation } from "@/queries/activityQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ReviewSubmitPage() {
  const router = useRouter();
  const { items, buyerDetails, clearEnquiry } = useEnquiryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEnquiry = useCreateEnquiryMutation();

  const handleSubmit = async () => {
    if (!buyerDetails || items.length === 0) {
      toast.error("Missing details or items");
      return;
    }

    setIsSubmitting(true);

    try {
      // Group items by categoryId or subCategoryId
      const groupedItems = items.reduce(
        (acc, item) => {
          const key = item.subCategoryId || item.categoryId || "uncategorized";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {} as Record<string, typeof items>,
      );

      // Create a payload for each group
      const payloads = Object.values(groupedItems).map((groupItems) => ({
        lineItems: groupItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitType: item.unitType || "Nos",
          remarks: item.remarks || "",
          flexibleWithBrands: true, // Defaulting to true as per common flow
        })),
        details: {
          address: buyerDetails.address,
          remarks:
            Object.keys(groupedItems).length > 1
              ? "Split Enquiry via Web"
              : "Enquiry via Web",
          pincodeDirectoryId: buyerDetails.pincodeDirectoryId,
          expectedDate: buyerDetails.expectedDate,
        },
      }));

      // Submit all payloads in parallel
      await Promise.all(
        payloads.map((payload) => createEnquiry.mutateAsync(payload)),
      );

      toast.success(
        payloads.length > 1
          ? `Successfully split into ${payloads.length} enquiries`
          : "Enquiry submitted successfully",
      );

      clearEnquiry();
      router.replace("/enquiry/create/submit-success");
    } catch (error) {
      toast.error("Failed to submit one or more enquiries");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
