"use client";

import BuyerDashboardHeader from "@/components/layouts/dashboard/buyer-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";

export default function EnquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppThemeProvider variant="app">
      <LayoutProvider>
        <div className="flex min-h-screen flex-col bg-[#F8F9FC] w-full">
          <BuyerDashboardHeader />
          <main className="flex-1 overflow-y-auto w-full">{children}</main>
        </div>
      </LayoutProvider>
    </AppThemeProvider>
  );
}
