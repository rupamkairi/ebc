import { SidebarInset } from "@/components/ui/sidebar";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarInset>{children}</SidebarInset>;
}
