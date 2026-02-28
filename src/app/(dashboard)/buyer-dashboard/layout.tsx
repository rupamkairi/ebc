"use client";

import BuyerDashboardHeader from "@/components/layouts/dashboard/buyer-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { DashboardGuard } from "@/components/auth/dashboard-guard";
import { BUYER_ROLES } from "@/constants/roles";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard allowedRoles={BUYER_ROLES}>
      <AppThemeProvider variant="app">
        <LayoutProvider>
          <div className="flex min-h-screen flex-col bg-[#F8F9FC] w-full">
            <BuyerDashboardHeader />
            <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 sm:py-10 w-full flex flex-col">
              <div className="flex-1">{children}</div>
            </main>
          </div>
        </LayoutProvider>
      </AppThemeProvider>
    </DashboardGuard>
  );
}
