"use client";
import { QUOTATION_STATUS } from "@/constants/enums";

import { useParams, useRouter } from "next/navigation";
import {
  useQuotationQuery,
  useUpdateQuotationMutation,
  useEnquiryQuery,
} from "@/queries/activityQueries";
import { QuotationForm } from "@/components/dashboard/seller/quotation/quotation-form";
import { 
  Loader2, 
  MessageSquare, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const sellerEntity = entities?.[0];
  const isApproved = sellerEntity?.verificationStatus === "APPROVED";
  const sellerEntityId = sellerEntity?.id;

  const { data: listings } = useItemListingsQuery({ entityId: sellerEntityId });

  const { mutate: updateQuotation, isPending: isUpdating } =
    useUpdateQuotationMutation();

  const killSwitchUpdateDisabled = !isApproved; // Restricted if not approved

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
            id: item.id,
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    if (killSwitchUpdateDisabled) {
      toast.error(
        `Your business must be APPROVED to update quotations. Current status: ${sellerEntity?.verificationStatus || "unknown"}`,
      );
      return;
    }

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

  const isRevisionRequested = !!quotation.quotationDetails?.[0]?.requestedRevision && !quotation.quotationDetails?.[0]?.hasBeenRevised;
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageBackButton
          href="/seller-dashboard/quotations"
          variant="link"
          label={t("back_to_quotation_list")}
        />
        <div className="flex flex-wrap gap-2 px-4">
          {quotation.status === QUOTATION_STATUS.ACCEPTED && (
            <Badge className="bg-green-600 text-white font-black uppercase text-[10px] tracking-widest px-3 py-1">
              <CheckCircle2 className="h-3 w-3 mr-1.5" />
              Accepted
            </Badge>
          )}
          {isRevisionRequested && (
            <Badge className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest animate-pulse px-3 py-1">
              <MessageSquare className="h-3 w-3 mr-1.5" />
              Action Required: Revision Requested
            </Badge>
          )}
          {quotation.quotationDetails?.[0]?.hasBeenRevised && (
            <Badge className="bg-violet-600 text-white font-black uppercase text-[10px] tracking-widest px-3 py-1 flex items-center">
              {quotation.priceChangeType === "DECREASED" && <TrendingDown className="h-3 w-3 mr-1.5" />}
              {quotation.priceChangeType === "INCREASED" && <TrendingUp className="h-3 w-3 mr-1.5" />}
              {quotation.priceChangeType === "MAINTAINED" && <RefreshCw className="h-3 w-3 mr-1.5" />}
              Revised
            </Badge>
          )}
        </div>
      </div>

      {isRevisionRequested && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shrink-0">
                 <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-black text-orange-900">Buyer Requested Reconsideration</h4>
                 <p className="text-sm text-orange-700 font-medium italic">
                    &quot;{quotation.quotationDetails?.[0]?.revisionRemarks || "No remarks provided."}&quot;
                 </p>
              </div>
           </div>
           <Button asChild className="rounded-xl bg-orange-600 hover:bg-orange-700 h-10 px-6 font-black text-xs uppercase tracking-widest">
              <Link href={`/seller-dashboard/enquiries/${quotation.enquiryId}`}>
                Review & Respond
              </Link>
           </Button>
        </div>
      )}

      {quotation.quotationDetails?.[0]?.hasBeenRevised && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shrink-0">
                 <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-black text-violet-900">This Quotation has been Revised</h4>
                 <p className="text-sm text-violet-700 font-medium">
                    You have responded to the buyer&apos;s request. 
                    {quotation.priceChangeType === "DECREASED" && " You provided a price reduction."}
                    {quotation.priceChangeType === "MAINTAINED" && " You maintained the original pricing."}
                 </p>
              </div>
           </div>
        </div>
      )}
      <QuotationForm
        enquiry={enquiry}
        quotation={quotation}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        isUpdate={true}
        disabled={isRevisionRequested}
        killSwitchUpdateDisabled={killSwitchUpdateDisabled}
        initialData={initialData}
      />
    </div>
  );
}
