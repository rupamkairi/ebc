"use client";

import React from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { BuyerDetailsForm } from "@/components/shared/forms/buyer-details-form";
import { BuyerDetails } from "@/store/enquiryStore";

export function AppointmentDetailsForm() {
  const { buyerDetails, setBuyerDetails } = useAppointmentStore();

  return (
    <BuyerDetailsForm
      title="Contact Details"
      defaultValues={buyerDetails}
      onChange={(details: BuyerDetails) => setBuyerDetails(details)}
    />
  );
}
