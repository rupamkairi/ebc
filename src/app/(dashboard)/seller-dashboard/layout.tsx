import { SidebarInset } from "@/components/ui/sidebar";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarInset>{children}</SidebarInset>;
}
