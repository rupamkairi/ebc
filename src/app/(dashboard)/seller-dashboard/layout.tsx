"use client";

import SellerDashboardLayoutComponent from "@/components/layouts/dashboard/seller-dashboard.layout";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import { useSessionQuery } from "@/queries/authQueries";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {} = useSessionQuery();

  return (
    <OnboardingGuard>
      <SellerDashboardLayoutComponent>
        {children}
      </SellerDashboardLayoutComponent>
    </OnboardingGuard>
  );
}
