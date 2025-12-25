"use client";

import Container from "@/components/containers/containers";
import { DisplayCard } from "@/components/shared/cards/display-cards";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";

export function UseCasesSection() {
  return (
    <section className="py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>Use Cases</TypographyH1>
          <Break />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DisplayCard
            image="images/use-cases/building-on-ancestral-land.jpg"
            title="Public or private projects of any size"
            aspectRatio="3/2"
          />
          <DisplayCard
            image="images/use-cases/floor-extension.jpg"
            title="Floor extension or upgradation"
            aspectRatio="3/2"
          />
          <DisplayCard
            image="images/use-cases/kitchen.jpg"
            title="Building repair or renovation"
            aspectRatio="3/2"
          />
          <DisplayCard
            image="images/use-cases/monitoring-from-outside.jpeg"
            title="Work Monitoring from anywhere"
            aspectRatio="3/2"
          />
        </div>

        <Break />

        <div className="flex justify-center">
          <Button
            size="xl"
            className="bg-primary hover:bg-primary/90 group"
            asChild
          >
            <a href="#">
              Check if EBC fits your requirement{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
