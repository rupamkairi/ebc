"use client";

import LayoutProvider from "@/components/layouts/dashboard/layout-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // session verification happens here.

  return (
    <LayoutProvider>
      {/*<h1>Dashboard Layout</h1>*/}
      {children}
    </LayoutProvider>
  );
}
