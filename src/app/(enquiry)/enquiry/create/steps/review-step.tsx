"use client";

import { useEnquiryStore } from "../../store/enquiry-store";
import { EnquiryDetailsView } from "@/components/enquiry/enquiry-details-view";
import { StyledCard } from "@/components/ui/styled-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, ClipboardCheck } from "lucide-react";

export function ReviewStep() {
  const { buyerDetails, items, setStep } = useEnquiryStore();

  const handleConfirm = () => {
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StyledCard
        title="Review Your Enquiry"
        description="Please ensure all details are correct before proceeding."
        icon={ClipboardCheck}
        className="border-none shadow-lg"
      >
        <EnquiryDetailsView buyerDetails={buyerDetails} items={items} />
      </StyledCard>

      <div className="flex justify-between pt-4 bg-white p-4 rounded-xl shadow-sm border">
        <Button
          variant="ghost"
          onClick={() => setStep(2)}
          size="lg"
          className="hover:bg-muted"
        >
          <ArrowLeft className="mr-2 size-4" /> Edit Items
        </Button>
        <Button
          onClick={handleConfirm}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20"
        >
          Confirm & Proceed <CheckCircle className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
