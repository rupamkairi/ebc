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
            image="https://placehold.co/600x400?text=G+1+building"
            title="G+1 building on ancestral land"
            aspectRatio="3/2"
          />
          <DisplayCard
            image="https://placehold.co/600x400?text=Floor+extension"
            title="Floor extension"
            aspectRatio="3/2"
          />
          <DisplayCard
            image="https://placehold.co/600x400?text=Renovation"
            title="Bathroom & kitchen renovation"
            aspectRatio="3/2"
          />
          <DisplayCard
            image="https://placehold.co/600x400?text=Home+monitoring"
            title="Home monitoring from outside Bengal"
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
