"use client";

import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { ProblemSection } from "./problem-section";
import { FeaturesSection } from "./features-section";
import { StepsSection } from "./steps-section";
import { BenefitsSection } from "./benefits-section";
import { EnquiryCtaSection } from "./enquiry-cta-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <EnquiryCtaSection />
        <StepsSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
