"use client";

import Container from "@/components/containers/containers";
import { DisplayCard2 } from "@/components/shared/cards/display-card-2";
import Break from "@/components/spacing/break";
import { TypographyH1 } from "@/components/ui/typography";
import {
  ArrowRight,
  Calculator,
  FileText,
  LayoutTemplate,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";

export function AiCalculatorSection() {
  return (
    <section className="bg-white py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>EBC Offers AI-Powered Cost Calculator</TypographyH1>
        </div>

        <Break />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <DisplayCard2
            icon={<Calculator className="w-10 h-10 text-primary" />}
            title="Accurate & Dynamic Estimations"
            items={[
              "Uses AI and rules for real-time estimates of materials & labour",
              "accounting for local rates and wastage factors",
            ]}
          />
          <DisplayCard2
            icon={<Settings className="w-10 h-10 text-primary" />}
            title="Customizable Project Parameters"
            items={[
              "Tailor calculations to specific project details like slab area and concrete grade",
              "for precise results",
            ]}
          />
          <DisplayCard2
            icon={<LayoutTemplate className="w-10 h-10 text-primary" />}
            title="Integrated Marketplace Advantage"
            items={[
              "A unique platform differentiator,",
              "seamlessly connected to the EBC construction ecosystem",
            ]}
          />
          <DisplayCard2
            icon={<FileText className="w-10 h-10 text-primary" />}
            title="Actionable & Exportable Bids"
            items={[
              "Easily export detailed estimations to PDF format for use in professional bids and planning.",
            ]}
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
              Calculate cost of work{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
