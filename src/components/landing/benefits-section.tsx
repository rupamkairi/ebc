"use client";

import Container from "@/components/containers/containers";
import { DisplayCard } from "@/components/shared/cards/display-cards";
import Break from "@/components/spacing/break";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";

export function BenefitsSection() {
  return (
    <section className="bg-blue-50/50 py-responsive ">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>Most Loved Benefits</TypographyH1>
        </div>

        <Break />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DisplayCard
            image="https://placehold.co/400x300?text=Savings"
            title="Save ₹50,000–₹3,00,000 by avoiding wrong purchases"
          />
          <DisplayCard
            image="https://placehold.co/400x300?text=Convenience"
            title="No running around — everything online"
          />
          <DisplayCard
            image="https://placehold.co/400x300?text=Accuracy"
            title="Engineer help = fewer mistakes"
          />
          <DisplayCard
            image="https://placehold.co/400x300?text=Renovation"
            title="Bathroom & kitchen renovation"
          />
          <DisplayCard
            image="https://placehold.co/400x300?text=Verification"
            title="Verified workers — not random labour"
          />
          <DisplayCard
            image="https://placehold.co/400x300?text=Documentation"
            title="Documentation for future proof"
          />
        </div>

        <Break />

        <div className="text-center">
          <TypographyH2>
            A better home. A better decision. A better sleep at night.
          </TypographyH2>
        </div>
      </Container>
    </section>
  );
}
