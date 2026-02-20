"use client";

import { Navbar } from "@/components/shared/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { ConferenceHero } from "@/components/conference-hall/conference-hero";
import { ConferenceFilters } from "@/components/conference-hall/conference-filters";
import { SessionList } from "@/components/conference-hall/session-card";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function ConferenceHallPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <ConferenceHero />
      
      <ConferenceFilters />
      
      <SessionList />
      
      <FooterSection />
      
      <WhatsAppButton />
    </main>
  );
}
