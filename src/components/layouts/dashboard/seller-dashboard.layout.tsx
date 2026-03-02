"use client";

import Container from "@/components/ui/containers";
import { SellerDashboardHeader } from "@/components/layouts/dashboard/seller-dashboard-header";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";

export default function SellerDashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppThemeProvider variant="app">
      <div className="min-h-screen bg-muted/30">
        <SellerDashboardHeader />
        <div className="flex flex-col gap-6 py-6">
          <Container>{children}</Container>
        </div>
      </div>
    </AppThemeProvider>
  );
}
