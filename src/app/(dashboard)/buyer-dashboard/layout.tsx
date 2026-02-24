"use client";

import { useSessionQuery } from "@/queries/authQueries";
import { BuyerDashboardSidebar } from "@/components/layouts/dashboard/buyer-dashboard-sidebar";
import BuyerDashboardHeader from "@/components/layouts/dashboard/buyer-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {} = useSessionQuery();

  return (
    <LayoutProvider>
      <div className="flex min-h-screen flex-col bg-[#F8F9FC] w-full">
        <BuyerDashboardHeader />
        <div className="flex flex-1 w-full flex-row">
          <BuyerDashboardSidebar />
          <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 sm:py-10 w-full flex flex-col">
            <div className="flex-1">{children}</div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
