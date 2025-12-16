import { AdminDashboardSidebar } from "@/components/layouts/dashboard/admin-dashboard-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

// import { AppSidebar } from "@/components/app-sidebar";
import AdminDashboardHeader from "@/components/layouts/dashboard/admin-dashboard-header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*<h1>Admin Layout</h1>*/}
      <AdminDashboardSidebar />
      <SidebarInset>
        <AdminDashboardHeader />
        <main>{children}</main>
      </SidebarInset>
    </>
  );
}
