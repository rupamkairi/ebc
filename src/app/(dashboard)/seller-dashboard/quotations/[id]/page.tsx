"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useQuotationQuery,
  useUpdateQuotationMutation,
  useEnquiryQuery,
} from "@/queries/activityQueries";
import { QuotationForm } from "@/components/dashboard/seller/quotation/quotation-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useMemo } from "react";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { CreateQuotationRequest } from "@/types/activity";
import { QuotationState } from "@/store/quotationStore";
import { useLanguage } from "@/hooks/useLanguage";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";

export default function ViewQuotationPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: quotation, isLoading: isQuotationLoading } =
    useQuotationQuery(id);
  const { data: enquiry, isLoading: isEnquiryLoading } = useEnquiryQuery(
    quotation?.enquiryId || "",
  );
  const { data: entities } = useEntitiesQuery();
  const sellerEntityId = entities?.[0]?.id;

  const { data: listings } = useItemListingsQuery({ entityId: sellerEntityId });

  const { mutate: updateQuotation, isPending: isUpdating } =
    useUpdateQuotationMutation();

  const killSwitchUpdateDisabled = false; // Enabled for editing

  const initialData: Pick<QuotationState, "lineItems" | "details"> | null =
    useMemo(() => {
      if (!quotation || !listings || !enquiry) return null;

      return {
        lineItems: quotation.quotationLineItems.map((item) => {
          // Match the item to a listing for the form
          const matchedListing = listings.find((l) => l.itemId === item.itemId);
          const enquiryItem = enquiry.enquiryLineItems.find(
            (eli) => eli.itemId === item.itemId,
          );

          return {
            itemId: item.itemId,
            itemListingId: matchedListing?.id || "",
            rate: item.rate,
            amount: item.amount,
            isNegotiable: item.isNegotiable,
            remarks: item.remarks || "",
            quantity: enquiryItem?.quantity || 0,
          };
        }),
        details: {
          expectedDate: quotation.quotationDetails?.[0]?.expectedDate,
          remarks: quotation.quotationDetails?.[0]?.remarks,
          attachmentIds: quotation.quotationDetails?.[0]?.attachmentIds || [],
        },
      };
    }, [quotation, listings, enquiry]);

  if (isQuotationLoading || (quotation && (isEnquiryLoading || !listings))) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3D52A0]" />
      </div>
    );
  }

  if (!quotation || !enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground font-medium text-lg">
          {t("quotation_enquiry_not_found")}
        </p>
        <Button variant="outline" asChild>
          <Link href="/seller-dashboard/quotations">
            {t("back_to_enquiries")}
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (data: CreateQuotationRequest) => {
    if (killSwitchUpdateDisabled) return;

    updateQuotation(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Quotation updated successfully!");
          router.push("/seller-dashboard/quotations");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update quotation.");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageBackButton
        href="/seller-dashboard/quotations"
        variant="link"
        label={t("back_to_quotation_list")}
      />
      <QuotationForm
        enquiry={enquiry}
        quotation={quotation}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        isUpdate={true}
        killSwitchUpdateDisabled={killSwitchUpdateDisabled}
        initialData={initialData}
      />
    </div>
  );
}
