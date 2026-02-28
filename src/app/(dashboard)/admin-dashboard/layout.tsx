"use client";

import { AdminDashboardSidebar } from "@/components/layouts/dashboard/admin-dashboard-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardGuard } from "@/components/auth/dashboard-guard";
import "@/app/globals-admin.css";
// import "@/app/globals.css";

// import { AppSidebar } from "@/components/app-sidebar";
import AdminDashboardHeader from "@/components/layouts/dashboard/admin-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";
import { ADMIN_ROLES } from "@/constants/roles";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <DashboardGuard allowedRoles={ADMIN_ROLES} loginPath="/auth/admin-login">
        <div className="font-open-sans flex min-h-screen w-full">
          <AdminDashboardSidebar />
          <SidebarInset>
            <AdminDashboardHeader />
            <main>{children}</main>
          </SidebarInset>
        </div>
      </DashboardGuard>
    </LayoutProvider>
  );
}
