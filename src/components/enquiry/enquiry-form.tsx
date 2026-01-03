"use client";

import React from "react";
import { useEnquiryStore } from "@/store/enquiryStore";
import {
  BuyerDetailsForm,
  buyerDetailsSchema,
} from "@/components/shared/forms/buyer-details-form";

export function EnquiryForm() {
  const { buyerDetails, setBuyerDetails } = useEnquiryStore();

  return (
    <BuyerDetailsForm defaultValues={buyerDetails} onChange={setBuyerDetails} />
  );
}

// Export schema for validation in parent
export const formSchema = buyerDetailsSchema;
