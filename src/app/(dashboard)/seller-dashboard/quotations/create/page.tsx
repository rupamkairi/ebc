"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import {
  useEnquiryQuery,
  useCreateQuotationMutation,
} from "@/queries/activityQueries";
import { QuotationForm } from "@/components/dashboard/seller/quotation/quotation-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { CreateQuotationRequest } from "@/types/activity";
import { CoinDeductionModal } from "@/components/dashboard/seller/coin-deduction-modal";
import { useEffect } from "react";
import { useUpdateQuotationMutation, useQuotationQuery } from "@/queries/activityQueries";
import { REF_TYPE } from "@/constants/enums";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";
import { useLanguage } from "@/hooks/useLanguage";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useCreateNotificationMutation } from "@/queries/notificationQueries";
import { NOTIFICATION_TYPE, ACTIVITY_TYPE } from "@/constants/enums";

function CreateQuotationContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get("enquiryId");
  const revisionId = searchParams.get("revisionId");
  const maintain = searchParams.get("maintain") === "true";
  const router = useRouter();
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [pendingData, setPendingData] = useState<CreateQuotationRequest | null>(
    null,
  );

  const { data: enquiry, isLoading: isEnquiryLoading } = useEnquiryQuery(
    enquiryId || "",
  );
  
  const { data: revisionData } = useQuotationQuery(
    revisionId || "",
  );

  const { data: entities, isLoading: isEntitiesLoading } = useEntitiesQuery();
  const sellerEntity = entities?.[0];
  const isApproved = sellerEntity?.verificationStatus === "APPROVED";

  const { mutate: createQuotation, isPending: isCreating } =
    useCreateQuotationMutation();

  const { mutate: updateQuotation, isPending: isUpdating } = 
    useUpdateQuotationMutation();

  const { mutate: createNotification } = useCreateNotificationMutation();

  const isSubmitting = isCreating || isUpdating;

  // Handle 'Maintain Price' flow automatically
  useEffect(() => {
    if (maintain && revisionId && revisionData && !isUpdating) {
      const data: Partial<CreateQuotationRequest> = {
        lineItems: revisionData.quotationLineItems.map(li => ({
          itemId: li.itemId,
          rate: li.rate || 0,
          amount: li.amount || 0,
          isNegotiable: li.isNegotiable,
        })),
        details: {
          expectedDate: revisionData.quotationDetails?.[0]?.expectedDate || undefined,
          remarks: revisionData.quotationDetails?.[0]?.remarks || undefined,
        }
      };
      
      updateQuotation({ 
        id: revisionId, 
        data: { 
          ...data,
          hasBeenRevised: true,
          priceChangeType: "MAINTAINED"
        } 
      }, {
        onSuccess: () => {
          toast.success("Price maintained. Revision request resolved.");
          // Notify buyer
          createNotification({
            type: NOTIFICATION_TYPE.QUOTATION_SUMBIT,
            activityId: revisionId,
            activityType: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
            metadata: {
              subject: "Quotation price maintained",
              isRevision: true,
              priceChangeType: "MAINTAINED"
            }
          });
          router.push(`/seller-dashboard/enquiries/${enquiryId}`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to maintain price.");
          router.push(`/seller-dashboard/enquiries/${enquiryId}`);
        }
      });
    }
  }, [maintain, revisionId, revisionData, enquiryId, isUpdating, updateQuotation, createNotification, router]);

  if (!enquiryId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground font-medium text-lg">
          Oops! Enquiry ID is missing.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (isEnquiryLoading || isEntitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Loader2 className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">Access Restricted</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your business must be <strong>APPROVED</strong> to create
            quotations. Current status:{" "}
            <span className="font-bold uppercase">
              {sellerEntity?.verificationStatus || "unknown"}
            </span>
          </p>
        </div>
        <Button onClick={() => router.back()} className="rounded-xl px-8 h-12">
          Go Back
        </Button>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground font-medium text-lg">
          Enquiry not found.
        </p>
        <Button variant="outline" asChild>
          <Link href="/seller-dashboard/enquiries">View All Enquiries</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (data: CreateQuotationRequest) => {
    setPendingData(data);
    setShowDeductionModal(true);
  };

  const handleConfirmDeduction = () => {
    if (!pendingData) return;

    if (revisionId) {
      // Calculate price change type
      let priceChangeType: "INCREASED" | "DECREASED" | "MAINTAINED" = "MAINTAINED";
      if (revisionData) {
        const oldTotal = revisionData.quotationLineItems.reduce((sum, li) => sum + (li.amount || 0), 0);
        const newTotal = pendingData.lineItems.reduce((sum, li) => sum + (li.amount || 0), 0);
        
        if (newTotal > oldTotal) priceChangeType = "INCREASED";
        else if (newTotal < oldTotal) priceChangeType = "DECREASED";
      }

      updateQuotation({ 
        id: revisionId, 
        data: { 
          ...pendingData, 
          hasBeenRevised: true,
          priceChangeType 
        } 
      }, {
        onSuccess: () => {
          toast.success("Revised quotation submitted successfully!");
          // Notify buyer
          createNotification({
            type: NOTIFICATION_TYPE.QUOTATION_SUMBIT,
            activityId: revisionId,
            activityType: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
            metadata: {
              subject: "Revised quotation received",
              isRevision: true,
              priceChangeType 
            }
          });
          router.push(`/seller-dashboard/enquiries/${enquiryId}`);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update quotation.");
          setShowDeductionModal(false);
        },
      });
    } else {
      createQuotation(pendingData, {
        onSuccess: () => {
          toast.success("Quotation submitted successfully!");
          router.push("/seller-dashboard/quotations");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to submit quotation.");
          setShowDeductionModal(false);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageBackButton
        href={`/seller-dashboard/enquiries/${enquiryId}`}
        variant="link"
        label={t("back_to_enquiry_details", "Back to Enquiry details")}
      />

      <CoinDeductionModal
        isOpen={showDeductionModal}
        onClose={() => setShowDeductionModal(false)}
        onConfirm={handleConfirmDeduction}
        leadType={REF_TYPE.QUOTATION}
        isProcessing={isSubmitting}
      />

      <QuotationForm
        enquiry={enquiry}
        initialData={revisionData ? {
          lineItems: revisionData.quotationLineItems.map(li => ({
            id: li.id,
            itemId: li.itemId,
            itemListingId: "", // Since the API doesn't return listing ID directly in the flat structure usually, but the form will try to find it
            rate: li.rate || 0,
            amount: li.amount || 0,
            isNegotiable: li.isNegotiable,
            remarks: li.remarks || "",
            quantity: enquiry.enquiryLineItems.find(e => e.itemId === li.itemId)?.quantity || 0
          })),
          details: {
            expectedDate: revisionData.quotationDetails?.[0]?.expectedDate || undefined,
            remarks: revisionData.quotationDetails?.[0]?.remarks || undefined,
            attachmentIds: [],
          }
        } : null}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default function CreateQuotationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CreateQuotationContent />
    </Suspense>
  );
}
