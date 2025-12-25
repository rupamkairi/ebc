"use client";

import { AdminDashboardSidebar } from "@/components/layouts/dashboard/admin-dashboard-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import "@/app/globals-admin.css";
// import "@/app/globals.css";

// import { AppSidebar } from "@/components/app-sidebar";
import AdminDashboardHeader from "@/components/layouts/dashboard/admin-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <AuthGuard>
        <AdminDashboardSidebar />
        <SidebarInset>
          <AdminDashboardHeader />
          <main>{children}</main>
        </SidebarInset>
      </AuthGuard>
    </LayoutProvider>
  );
}
