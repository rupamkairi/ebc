"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  useEnquiryQuery,
  useCreateQuotationMutation,
} from "@/queries/activityQueries";
import { QuotationForm } from "@/components/dashboard/seller/quotation/quotation-form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Suspense } from "react";
import { CreateQuotationRequest } from "@/types/activity";

function CreateQuotationContent() {
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get("enquiryId");
  const router = useRouter();

  const { data: enquiry, isLoading: isEnquiryLoading } = useEnquiryQuery(
    enquiryId || ""
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
    createQuotation(data, {
      onSuccess: () => {
        toast.success("Quotation submitted successfully!");
        router.push("/seller-dashboard/quotations");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to submit quotation.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/seller-dashboard/enquiries/${enquiryId}`}
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Enquiry details
      </Link>
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
