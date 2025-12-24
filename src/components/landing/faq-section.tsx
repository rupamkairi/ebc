"use client";

import Container from "@/components/containers/containers";
import { AccordionBase } from "@/components/shared/accordion-base";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";

export function FaqSection() {
  const faqItems = [
    {
      question: "How does EBC ensure material quality?",
      answer:
        "We work with verified suppliers and provide detailed material specifications to ensure you get the best quality for your construction.",
    },
    {
      question: "Are the workers verified?",
      answer:
        "Yes, all workers and contractors on our platform go through a verification process and their past work is vetted by our engineers.",
    },
    {
      question: "What is the cost of engineer support?",
      answer:
        "Engineer support costs vary based on the extent of assistance required. You can choose specific services as per your project needs.",
    },
  ];

  return (
    <section className="py-responsive">
      <div className="text-center">
        <TypographyH1>FAQs</TypographyH1>
        <Break />
      </div>
      <Container size="md">
        <div className="space-y-4">
          <AccordionBase items={faqItems} />
        </div>

        <Break />

        <div className="flex justify-center">
          <Button
            size="xl"
            variant="default"
            className="bg-primary hover:bg-primary/90 group"
          >
            Still Have Questions? Talk to Us{" "}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
