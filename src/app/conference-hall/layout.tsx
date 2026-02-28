"use client";

import { AppThemeProvider } from "@/components/providers/app-theme-provider";

export default function ConferenceHallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppThemeProvider variant="app">{children}</AppThemeProvider>;
}
