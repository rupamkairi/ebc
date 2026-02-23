"use client";

import { NewEnquiryItemSearch } from "@/components/dashboard/buyer/enquiry/new-enquiry-item-search";
import { NewBuyerDetailsForm } from "@/components/dashboard/buyer/enquiry/new-buyer-details-form";
import { EnquiryLineItems } from "@/components/dashboard/buyer/enquiry/enquiry-line-items";
import { Button } from "@/components/ui/button";
import { useEnquiryStore } from "@/store/enquiryStore";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useSessionQuery, useSendOtpMutation } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-v2-components";

export default function CreateEnquiryPage() {
  const router = useRouter();
  const { items, buyerDetails, setBuyerDetails } = useEnquiryStore();
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

    router.push("/enquiry/create/review-submit");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-10 px-4 mb-20 animate-in fade-in duration-700">
      {/* Session Profile Card */}
      {session?.user && (
        <BuyerProfileCard
          name={session.user.name}
          role={session.user.role || "Buyer"}
          avatarUrl={session.user.image || undefined}
        />
      )}

      <div className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter text-[#3D52A0] uppercase">
          Create New Enquiries
        </h1>
        <p className="text-[#3D52A0]/60 font-medium ml-1">
          Fill in the details below to request a quote.
        </p>
      </div>

      <div className="space-y-16">
        {/* Step 1: Items Selector */}
        <section className="space-y-8">
          <NewEnquiryItemSearch />
          
          {items.length > 0 && (
            <div className="pt-4 border-t border-[#3D52A0]/10">
              <h3 className="text-sm font-black tracking-widest text-[#3D52A0]/40 uppercase mb-4 ml-1">
                Items Added to Enquiry ({items.length})
              </h3>
              <EnquiryLineItems />
            </div>
          )}
        </section>

        {/* Step 2: Buyer Details Form */}
        <section className="space-y-10 pt-8">
          <h2 className="text-4xl font-black italic tracking-tighter text-[#3D52A0] uppercase">
            Buyer Details
          </h2>
          <NewBuyerDetailsForm 
            defaultValues={buyerDetails} 
            onChange={setBuyerDetails} 
          />
        </section>

        {/* Action Footer */}
        <div className="flex justify-center pt-10">
          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-[#0F28A9] to-[#0A1B75] hover:from-[#FFA500] hover:to-[#FF8C00] text-white font-black italic tracking-tight py-8 px-14 rounded-2xl text-2xl shadow-[0_20px_50px_rgba(15,40,169,0.3)] transition-all duration-500 hover:scale-105 active:scale-95 group border-none"
          >
            Proceed To Verify 
            <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-3 duration-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
