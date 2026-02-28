"use client";

import SellerDashboardLayoutComponent from "@/components/layouts/dashboard/seller-dashboard.layout";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import { DashboardGuard } from "@/components/auth/dashboard-guard";
import { SELLER_ROLES } from "@/constants/roles";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard allowedRoles={SELLER_ROLES}>
      <OnboardingGuard>
        <SellerDashboardLayoutComponent>
          {children}
        </SellerDashboardLayoutComponent>
      </OnboardingGuard>
    </DashboardGuard>
  );
}
