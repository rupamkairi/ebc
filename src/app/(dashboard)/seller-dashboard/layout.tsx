import SellerDashboardLayoutComponent from "@/components/layouts/dashboard/seller-dashboard.layout";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <SellerDashboardLayoutComponent>
        {children}
      </SellerDashboardLayoutComponent>
    </OnboardingGuard>
  );
}
