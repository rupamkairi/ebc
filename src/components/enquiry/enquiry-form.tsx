"use client";

import React from "react";
import { useEnquiryStore } from "@/store/enquiryStore";
import {
  BuyerDetailsForm,
  buyerDetailsSchema,
} from "@/components/shared/forms/buyer-details-form";

import { usePrefetchBuyerDetails } from "@/hooks/usePrefetchBuyerDetails";
import { useSessionQuery } from "@/queries/authQueries";

export function EnquiryForm() {
  const { buyerDetails, setBuyerDetails } = useEnquiryStore();
  const { data: session } = useSessionQuery();
  usePrefetchBuyerDetails(setBuyerDetails, buyerDetails, session?.user);

  return (
    <BuyerDetailsForm defaultValues={buyerDetails} onChange={setBuyerDetails} />
  );
}

// Export schema for validation in parent
export const formSchema = buyerDetailsSchema;
