"use client";

import { USER_ROLE } from "@/constants/enums";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

export default function AppointmentPage() {
  const { user } = useAuthStore();
  if (!user) {
    redirect("/appointment/create");
  }

  if (user) {
    if (user.role === USER_ROLE.USER_BUYER_ADMIN) {
      redirect("/buyer-dashboard/appointments");
    } else if (
      user.role === USER_ROLE.USER_SERVICE_PROVIDER_ADMIN ||
      user.role === USER_ROLE.USER_SERVICE_PROVIDER_STAFF
    ) {
      redirect("/seller-dashboard/appointments");
    } else {
    }
  }
}
