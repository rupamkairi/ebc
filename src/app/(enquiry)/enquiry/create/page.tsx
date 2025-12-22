"use client";

import { useEnquiryStore } from "../store/enquiry-store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BuyerDetailsForm } from "./steps/buyer-details-form";
import { ItemSelectionForm } from "./steps/item-selection-form";
import { ReviewStep } from "./steps/review-step";
import { SubmitStep } from "./steps/submit-step";
import { useEffect } from "react";

export default function CreateEnquiryPage() {
  const { step, setStep } = useEnquiryStore();

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const steps = [
    { label: "Buyer Details", step: 1 },
    { label: "Select Items", step: 2 },
    { label: "Review", step: 3 },
    { label: "Submit", step: 4 },
  ];

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto py-4 px-4 max-w-5xl">
          <h1 className="text-2xl font-black tracking-tight text-primary">
            EBC Enquiry
          </h1>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-5xl space-y-10">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            Create New Enquiry
          </h2>
          <p className="text-muted-foreground text-lg">
            Get the{" "}
            <span className="text-secondary font-bold">best quotes</span> for
            your construction materials.
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={step} onStepClick={setStep} />

        <div className="mt-8">
          {step === 1 && <BuyerDetailsForm />}
          {step === 2 && <ItemSelectionForm />}
          {step === 3 && <ReviewStep />}
          {step === 4 && <SubmitStep />}
        </div>
      </div>
    </div>
  );
}
