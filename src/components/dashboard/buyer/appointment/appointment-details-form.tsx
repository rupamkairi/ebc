"use client";

import React from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { BuyerDetailsForm } from "@/components/dashboard/buyer/shared/buyer-details-form";
import { BuyerDetails } from "@/store/enquiryStore";

import { usePrefetchBuyerDetails } from "@/hooks/usePrefetchBuyerDetails";
import { useSessionQuery } from "@/queries/authQueries";

export function AppointmentDetailsForm() {
  const { buyerDetails, setBuyerDetails } = useAppointmentStore();
  const { data: session } = useSessionQuery();
  usePrefetchBuyerDetails(setBuyerDetails, buyerDetails, session?.user);

  return (
    <BuyerDetailsForm
      title="Contact Details"
      defaultValues={buyerDetails}
      onChange={(details: BuyerDetails) => setBuyerDetails(details)}
    />
  );
}
