"use client";

import Container from "@/components/containers/containers";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-blue-50/50 text-center py-xl">
      <Container size="lg">
        <TypographyH1>
          You are building your life&apos;s biggest asset. Don&apos;t leave it
          to chance.
        </TypographyH1>
        <Break />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="2xl" className="bg-primary font-bold">
            Consult with an Expert (Free){" "}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="2xl"
            className="border-primary/20 bg-white text-lg font-bold hover:bg-blue-50 text-foreground"
          >
            Compare material rate (Free) <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
