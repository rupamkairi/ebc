"use client";

import Container from "@/components/containers/containers";
import { DisplayCard2 } from "@/components/shared/cards/display-card-2";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { ArrowRight, Banknote, HardHat, Users } from "lucide-react";
import React from "react";

export function FeaturesSection() {
  return (
    <section className="bg-blue-50/50 py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>What is EBC?</TypographyH1>
          <br />
          <TypographyH2>
            It&apos;s a Local Marketplace. No Commission. No Hidden Charges.
          </TypographyH2>
        </div>

        <Break />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DisplayCard2
            icon={<Banknote className="w-8 h-8 text-primary" />}
            title="① Fair Material Prices"
            items={[
              "Multiple quotations",
              "Verified dealers",
              "Price transparency",
            ]}
          />
          <DisplayCard2
            icon={<Users className="w-8 h-8 text-primary" />}
            title="② Trusted Service Providers"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
            ]}
          />
          <DisplayCard2
            icon={<HardHat className="w-8 h-8 text-primary" />}
            title="③ Engineer Support (Optional)"
            items={[
              "Estimate & quantity check",
              "Site quality visits",
              "Construction stage guidance",
            ]}
          />
        </div>

        <Break />

        <div className="flex justify-center">
          <Button size="xl" className="bg-primary hover:bg-primary/90 group">
            How EBC Helps You <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
