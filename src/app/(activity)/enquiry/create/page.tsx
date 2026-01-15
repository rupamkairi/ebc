"use client";

import { AddEnquiryItemWrapper } from "@/components/dashboard/buyer/enquiry/add-enquiry-item-wrapper";
import { EnquiryForm } from "@/components/dashboard/buyer/enquiry/enquiry-form";
import { EnquiryLineItems } from "@/components/dashboard/buyer/enquiry/enquiry-line-items";
import { Button } from "@/components/ui/button";
import { useEnquiryStore } from "@/store/enquiryStore";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useSessionQuery, useSendOtpMutation } from "@/queries/authQueries";
import { ProfileCard } from "@/components/dashboard/seller/profile-card";

export default function CreateEnquiryPage() {
  const router = useRouter();
  const { items, buyerDetails } = useEnquiryStore();
  const { data: session } = useSessionQuery();
  const sendOtp = useSendOtpMutation();

  const handleNext = async () => {
    // Validate that items exist
    if (items.length === 0) {
      toast.error("Please add at least one item to your enquiry.");
      return;
    }

    // Validate form details
    if (
      !buyerDetails ||
      !buyerDetails.name ||
      !buyerDetails.phoneNumber ||
      !buyerDetails.pincodeDirectoryId
    ) {
      toast.error("Please fill in all required buyer details.");
      return;
    }

    // If no active session, initiate silent registration/login
    if (!session?.user) {
      try {
        await sendOtp.mutateAsync({
          phone: buyerDetails.phoneNumber,
          name: buyerDetails.name,
          type: "BUYER",
        });
        toast.info("Verification code sent to your phone.");
        router.push("/enquiry/create/otp-verify");
      } catch (error) {
        toast.error("Failed to send verification code. Please try again.");
        console.error(error);
      }
      return;
    }

    // If session exists, proceed to review or verify (depending on if we want to skip OTP)
    // For now, let's proceed to review if already logged in?
    // Or does the user always want OTP verify?
    // Prompt says: "If there is not active session found... Create the user silently & verify in the otp step, then later move to review-submit page."
    // This implies if session FOUND, we skip OTP.
    router.push("/enquiry/create/review-submit");
  };

  return (
    <div className="container mx-auto space-y-8 py-8 px-4">
      {/* Session Profile Card */}
      {session?.user && (
        <ProfileCard
          user={{
            name: session.user.name,
            role: session.user.role || "Buyer",
            avatarUrl: session.user.image || undefined,
          }}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Enquiry
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to request a quote.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Items & Search (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <EnquiryLineItems />
          <AddEnquiryItemWrapper />
        </div>

        {/* Right Col: Buyer Details Form (Sticky?) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <EnquiryForm />

            <Button onClick={handleNext} className="w-full" size="lg">
              Proceed to Verify
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
