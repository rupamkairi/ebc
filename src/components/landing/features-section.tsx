"use client";

import Container from "@/components/containers/containers";
import { DisplayCard2 } from "@/components/shared/cards/display-card-2";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function FeaturesSection() {
  return (
    <section className="bg-blue-50/50 py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>What is ECON Building Centre (EBC)?</TypographyH1>
          <br />
          <TypographyH2>
            It&apos;s a Local Marketplace. No Commission. No Hidden Charges.
          </TypographyH2>
        </div>

        <Break />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/material-depot.png"
                width={64}
                height={64}
                alt="Material Depo"
              />
            }
            title="Material Depo"
            items={[
              "Multiple quotations",
              "Verified dealers",
              "Price transparency",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/technical-cabin.png"
                width={64}
                height={64}
                alt="Technical Cabin"
              />
            }
            title="Technical Cabin"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/manpower-hub.png"
                width={64}
                height={64}
                alt="Manpower Hub"
              />
            }
            title="Manpower Hub"
            items={[
              "Estimate & quantity check",
              "Site quality visits",
              "Construction stage guidance",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/fabricator-area.png"
                width={64}
                height={64}
                alt="Fabricator Area"
              />
            }
            title="Fabricator Area"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/hiring-terminal.png"
                width={64}
                height={64}
                alt="Hiring Terminal"
              />
            }
            title="Hiring Terminal"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/contract-desk.png"
                width={64}
                height={64}
                alt="Contract Desk"
              />
            }
            title="Contract Desk"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/offers-zone.png"
                width={64}
                height={64}
                alt="Offers Zone"
              />
            }
            title="Offers Zone"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
            ]}
          />
          <DisplayCard2
            icon={
              <Image
                src="/images/featured/cost-calculator.png"
                width={64}
                height={64}
                alt="Cost Calculator"
              />
            }
            title="Cost Calculator"
            items={[
              "Mason, plumber, electrician, painter etc.",
              "Ratings & reviews",
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
