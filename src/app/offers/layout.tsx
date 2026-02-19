import React from "react";
import { Navbar } from "@/components/shared/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
