import SellerDashboardLayoutComponent from "@/components/layouts/dashboard/seller-dashboard.layout";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerDashboardLayoutComponent>{children}</SellerDashboardLayoutComponent>
  );
}
