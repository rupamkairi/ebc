"use client";

import { BuyerDashboardSidebar } from "@/components/layouts/dashboard/buyer-dashboard-sidebar";
import BuyerDashboardHeader from "@/components/layouts/dashboard/buyer-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";

export default function EnquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen flex-col bg-[#F8F9FC] w-full">
        <BuyerDashboardHeader />
        <div className="flex flex-1 w-full flex-row">
          <BuyerDashboardSidebar />
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
