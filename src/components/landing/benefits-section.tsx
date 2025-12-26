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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DisplayCard
            image="/images/benefits/savings.jpg"
            title="Save ₹50,000–₹3,00,000 by avoiding wrong purchases"
          />
          <DisplayCard
            image="/images/benefits/convenience.jpg"
            title="No running around — everything online"
          />
          <DisplayCard
            image="/images/benefits/accuracy.jpg"
            title="Engineer help = fewer mistakes"
          />
          {/* <DisplayCard
            image="/images/benefits/renovation.jpg"
            title="Bathroom & kitchen renovation"
          /> */}
          <DisplayCard
            image="/images/benefits/past-review-of-workers.jpg"
            title="Get past review & comments - No random workers"
          />
          {/* <DisplayCard
            image="/images/benefits/documentation.jpg"
            title="Documentation for future proof"
          /> */}
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
