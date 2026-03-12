"use client";

import { USER_ROLE } from "@/constants/enums";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

export default function EnquiryPage() {
  const { user } = useAuthStore();
  if (!user) {
    redirect("/enquiry/create");
  }

  if (user) {
    if (user.role === USER_ROLE.USER_BUYER_ADMIN) {
      redirect("/buyer-dashboard/enquiries");
    } else if (
      user.role === USER_ROLE.USER_PRODUCT_SELLER_ADMIN ||
      user.role === USER_ROLE.USER_PRODUCT_SELLER_STAFF
    ) {
      redirect("/seller-dashboard/enquiries");
    } else {
    }
  }
}
