"use client";

import Container from "@/components/containers/containers";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyLarge,
  TypographyP,
} from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export function HowItWorksSection() {
  return (
    <section className="py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH2>How it works</TypographyH2>
          <br />
          <TypographyH1>3 Simple Steps</TypographyH1>
        </div>

        <Break />

        <div className="relative">
          {/* Connection Arrows (Desktop) */}
          <div className="hidden md:flex absolute top-[15%] left-[27%] w-[10%] items-center justify-center opacity-20">
            <div className="h-px bg-slate-900 w-full" />
            <ArrowRight className="w-5 h-5 -ml-1" />
          </div>
          <div className="hidden md:flex absolute top-[15%] left-[63%] w-[10%] items-center justify-center opacity-20">
            <div className="h-px bg-slate-900 w-full" />
            <ArrowRight className="w-5 h-5 -ml-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <StepItem
              icon={
                <Image
                  src="/icons/house-hand.png"
                  alt="Requirement"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              }
              title="1 Tell us your requirement"
              description="Plot size or renovation work"
            />
            <StepItem
              icon={
                <Image
                  src="/icons/compare-quotes.png"
                  alt="Compare"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              }
              title="2 Compare quotations & hire manpower"
              description="Choose what fits budget and trust"
            />
            <StepItem
              icon={
                <Image
                  src="/icons/quality-check.png"
                  alt="Quality Check"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              }
              title="3 Build with support and quality checks"
              description="EBC tracks & assists throughout"
            />
          </div>
        </div>

        <Break />

        <div className="flex justify-center">
          <Button size="xl" className="bg-primary hover:bg-primary/90 group">
            Start Your Home Journey <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}

function StepItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
        {icon}
      </div>
      <div>
        <TypographyLarge className="font-bold mb-1">{title}</TypographyLarge>
        <TypographyP className="text-muted-foreground text-sm">
          {description}
        </TypographyP>
      </div>
    </div>
  );
}
