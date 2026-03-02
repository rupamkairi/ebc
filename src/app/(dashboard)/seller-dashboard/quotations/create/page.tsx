"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import {
  useEnquiryQuery,
  useCreateQuotationMutation,
} from "@/queries/activityQueries";
import { QuotationForm } from "@/components/dashboard/seller/quotation/quotation-form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { CreateQuotationRequest } from "@/types/activity";
import { CoinDeductionModal } from "@/components/dashboard/seller/coin-deduction-modal";
import { REF_TYPE } from "@/constants/enums";

function CreateQuotationContent() {
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get("enquiryId");
  const router = useRouter();
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [pendingData, setPendingData] = useState<CreateQuotationRequest | null>(
    null,
  );

  const { data: enquiry, isLoading: isEnquiryLoading } = useEnquiryQuery(
    enquiryId || "",
  );
  const { mutate: createQuotation, isPending: isSubmitting } =
    useCreateQuotationMutation();

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

  if (isEnquiryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/seller-dashboard/enquiries/${enquiryId}`}
        className="inline-flex items-center gap-2 text-sm font-black text-[#3D52A0]/60 hover:text-[#3D52A0] transition-colors"
      >
        <span className="h-8 w-8 rounded-xl bg-[#FFA500] hover:bg-[#e69500] flex items-center justify-center shadow-sm transition-colors">
          <ArrowLeft className="h-4 w-4 text-white" />
        </span>
        Back to Enquiry details
      </Link>

      <CoinDeductionModal
        isOpen={showDeductionModal}
        onClose={() => setShowDeductionModal(false)}
        onConfirm={handleConfirmDeduction}
        leadType={REF_TYPE.QUOTATION}
        isProcessing={isSubmitting}
      />

      <QuotationForm
        enquiry={enquiry}
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
