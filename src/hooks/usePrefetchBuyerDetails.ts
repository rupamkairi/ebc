"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { BuyerDetails } from "@/store/enquiryStore";

interface UserData {
  name?: string;
  email?: string;
  phoneNumber?: string | null;
}

/**
 * Prefetches the logged-in user's details and populates the buyer details form/store.
 * Uses session user data if provided, otherwise falls back to auth store.
 * Only runs if the current details are largely empty.
 */
export function usePrefetchBuyerDetails(
  setBuyerDetails: (details: BuyerDetails) => void,
  currentDetails: BuyerDetails | null,
  sessionUser?: UserData | null
) {
  const { user: storeUser } = useAuthStore();
  const hasPrefetched = useRef(false);

  useEffect(() => {
    // Prefer sessionUser (fresher from query), fallback to storeUser
    const user = sessionUser || storeUser;

    if (!user || hasPrefetched.current) return;

    // Check if current details are empty or just have default empty strings
    const isEmpty =
      !currentDetails ||
      (!currentDetails.name &&
        !currentDetails.email &&
        !currentDetails.phoneNumber &&
        !currentDetails.address);

    if (isEmpty) {
      setBuyerDetails({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: "",
        pincode: "",
        pincodeDirectoryId: "",
        description: "",
        purpose: "",
      });
      hasPrefetched.current = true;
    }
  }, [sessionUser, storeUser, currentDetails, setBuyerDetails]);
}
