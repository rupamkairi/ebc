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
      question: "What exactly does EBC do?",
      answer:
        "EBC helps you get fair material prices, trusted service providers, and engineer guidance for building or renovating your home — all in one place.",
    },
    {
      question: "I am building my house in a small town — will you support me?",
      answer:
        "Yes. EBC is designed especially for Tier 2 & Tier 3 towns  — including every digitally aware peoples of urban, semi-urban and rural zones in India.",
    },
    {
      question: "I already have a contractor/mason. Can I still use EBC?",
      answer: [
        "Yes! You can use EBC for:",
        <br key={1} />,
        "✓ Material price comparison",
        <br key={2} />,
        "✓ Engineer BOQ verification",
        <br key={3} />,
        "✓ Quality check visits",
        <br key={4} />,
        "✓ Tracking overall project budget",
        <br key={5} />,
        "Your contractor continues working — EBC adds transparency & support.",
      ],
    },
    {
      question: "Is this more expensive than my local shop?",
      answer: [
        "Usually NO — you pay similar or better market prices, and save money by:",
        <br key={1} />,
        "· Avoiding over-buying materials",
        <br key={2} />,
        "· Reducing rework costs",
        <br key={3} />,
        "· Getting better material–work match",
        "Overall budget control improves.",
      ],
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
