"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { useSessionQuery } from "@/queries/authQueries";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {} = useSessionQuery();

  return <SidebarInset>{children}</SidebarInset>;
}
