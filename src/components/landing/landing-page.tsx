"use client";

import { Navbar } from "../shared/navbar";
import { Hero } from "./hero";
import { ProblemSection } from "./problem-section";
import { WhatSection } from "./what-section";
import { StepsSection } from "./steps-section";
import { BenefitsSection } from "./benefits-section";
import { EnquiryCtaSection } from "./enquiry-cta-section";
import { Footer } from "../shared/footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <WhatSection />
        <EnquiryCtaSection />
        <StepsSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
