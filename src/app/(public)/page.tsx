"use client";

import Container from "@/components/containers/containers";
import { AiCalculatorSection } from "@/components/landing/ai-calculator-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { ConferenceHallSection } from "@/components/landing/conference-hall-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { Hero } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { Navbar } from "@/components/shared/navbar";
import Break from "@/components/ui/break";
import { Button } from "@/components/ui/button";
import {
  TypographyLarge,
  TypographyMuted,
  TypographyResponsiveSmall,
} from "@/components/ui/typography";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { WhySection } from "@/components/landing/why-section";
import { EcosystemSection } from "@/components/landing/ecosystem-section";
import { AdvantagesSection } from "@/components/landing/advantages-section";

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

      {/* WHY JOIN EBC? SECTION */}
      <WhySection />

      {/* MOST LOVED BENEFITS SECTION */}
      <BenefitsSection />

      {/* USE CASES SECTION */}
      <UseCasesSection />

      {/* PRICING SECTION */}
      <PricingSection />

      {/* FAQ SECTION */}
      <FaqSection />

      {/* FINAL CTA SECTION */}
      <CtaSection />

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-lg">
        <Container size="lg">
          <div className="text-center">
            <div className="space-y-2">
              <TypographyLarge className="font-bold">
                E-CON Building Centre — Powered by Engineers. Trusted by
                Families.
              </TypographyLarge>
              <TypographyMuted>Made in India • Built for ALL.</TypographyMuted>
            </div>
            <Break />

            <div className="flex justify-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-[#25D366] hover:bg-[#20bd5c] rounded-full px-12 py-6 shadow-xl flex items-center gap-2 group">
          <IconBrandWhatsapp className="h-8 w-8" />
          <TypographyResponsiveSmall className="text-sm font-semibold text-white">
            WhatsApp help
          </TypographyResponsiveSmall>
        </Button>
      </div>
    </main>
  );
}
