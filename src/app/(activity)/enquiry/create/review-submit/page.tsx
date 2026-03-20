"use client";

import { EnquiryReview } from "@/components/dashboard/buyer/enquiry/enquiry-review";
import { useEnquiryStore } from "@/store/enquiryStore";
import { useCreateEnquiryMutation } from "@/queries/activityQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft } from "lucide-react";

export default function ReviewSubmitPage() {
  const router = useRouter();
  const { items, buyerDetails, clearEnquiry } = useEnquiryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const createEnquiry = useCreateEnquiryMutation();

  const handleSubmit = async () => {
    if (!buyerDetails || items.length === 0) {
      toast.error(t("missing_details_or_items"));
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
            buyerDetails.description ||
            (Object.keys(groupedItems).length > 1
              ? "Split Enquiry via Web"
              : "Enquiry via Web"),
          pincodeDirectoryId: buyerDetails.pincodeDirectoryId,
          ...(buyerDetails.expectedDate && {
            expectedDate: new Date(buyerDetails.expectedDate).toISOString(),
          }),
        },
      }));

      // Submit all payloads in parallel
      await Promise.all(
        payloads.map((payload) => createEnquiry.mutateAsync(payload)),
      );

      toast.success(
        payloads.length > 1
          ? t("enquiries_split", { count: payloads.length })
          : t("enquiry_submitted"),
      );

      clearEnquiry();
      router.replace("/enquiry/create/submit-success");
    } catch (error) {
      toast.error(t("failed_submit_enquiries"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
          {t("review_enquiry")}
        </h1>
        <p className="text-primary/60 font-medium ml-1">
          {t("verify_details_before_submit")}
        </p>
      </div>

      <EnquiryReview onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
