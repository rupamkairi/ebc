"use client";

import { FooterSection } from "@/components/landing/footer-section";
import { Header } from "@/components/shared/header";
import { usePathname } from "next/navigation";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = pathname !== "/";

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">{children}</div>
      <FooterSection />
    </>
  );
}
