import SellerDashboardLayoutComponent from "@/components/layouts/dashboard/seller-dashboard.layout";
import { SellerGuard } from "@/components/auth/seller-guard";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerGuard>
      <SellerDashboardLayoutComponent>{children}</SellerDashboardLayoutComponent>
    </SellerGuard>
  );
}
