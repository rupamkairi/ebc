"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { BuyerDetails } from "@/store/enquiryStore";

type PrefetchUser =
  | {
      name?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
      phone?: string | null;
    }
  | null
  | undefined;

/**
 * Prefetches the logged-in user's details and populates the buyer details form/store.
 * Uses session user data if provided, otherwise falls back to auth store.
 * Only runs if the current details are largely empty.
 */
export function usePrefetchBuyerDetails(
  setBuyerDetails: (details: BuyerDetails) => void,
  currentDetails: BuyerDetails | null,
  sessionUser?: PrefetchUser,
) {
  const { user: storeUser } = useAuthStore() as { user: PrefetchUser };
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
      const rawPhone = user.phoneNumber || user.phone || "";
      const localPhone = rawPhone.replace(/^\+?91/, "").replace(/\D/g, "").slice(0, 10);
      setBuyerDetails({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: localPhone,
        address: "",
        pincode: "",
        pincodeDirectoryId: "",
        description: "",
      });
      hasPrefetched.current = true;
    }
  }, [sessionUser, storeUser, currentDetails, setBuyerDetails]);
}
