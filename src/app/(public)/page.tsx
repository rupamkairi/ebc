"use client";

import { AiCalculatorSection } from "@/components/landing/ai-calculator-section";
import { ConferenceHallSection } from "@/components/landing/conference-hall-section";
import { FaqSection } from "@/components/landing/faq-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { Hero } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { Navbar } from "@/components/shared/navbar";
import { EcosystemSection } from "@/components/landing/ecosystem-section";
import { AdvantagesSection } from "@/components/landing/advantages-section";
import { MaterialsSection } from "@/components/landing/materials-section";
import { ServicesSection } from "@/components/landing/services-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { FooterSection } from "@/components/landing/footer-section";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white-background">
      <Navbar />
      <Hero />

      {/* AI CALCULATOR SECTION */}
      <AiCalculatorSection />

      {/* Existing Header/Banner would go here */}
      <ProblemSection />

      {/* WHAT IS EBC? SECTION (Now SolutionSection) */}
      <SolutionSection />

      {/* CONFERWENCE HALL SECTION */}
      <ConferenceHallSection />

      {/* HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* ECO SYSTEM SECTION */}
      <EcosystemSection />

      {/* ADVANTAGES SECTION */}
      <AdvantagesSection />

      {/* MATERIALS SECTION */}
      <MaterialsSection />

      {/* SERVICES SECTION */}
      <ServicesSection />

      {/* PRICING SECTION */}
      <PricingSection />

      {/* FAQ SECTION */}
      <FaqSection />

      {/* REVIEWS SECTION */}
      <ReviewsSection />

      {/* These sections are currently commented out per request */}
      {/* <WhySection /> */}
      {/* <BenefitsSection /> */}
      {/* <UseCasesSection /> */}
      {/* <CtaSection /> */}

      {/* FOOTER */}
      <FooterSection />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </main>
  );
}
