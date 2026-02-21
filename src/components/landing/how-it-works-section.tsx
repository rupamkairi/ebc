"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import {
  TypographyH2,
  TypographyP,
} from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export function HowItWorksSection() {
  return (
    <section className="py-responsive bg-white">
      <Container size="lg">
        <div className="text-center mb-12">
          <TypographyH2 className="text-4xl lg:text-5xl font-black text-primary">
            How It <span className="text-secondary">Works?</span>
          </TypographyH2>
          <TypographyP className="text-muted-foreground mt-4 text-base md:text-lg font-medium">
            3 Simple Steps
          </TypographyP>
        </div>

        <div className="relative mb-8 md:mb-16">
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <div className="min-w-[700px] md:min-w-0 w-full aspect-[22/9] relative">
              <Image
                src="/images/how-it-works/steps.png"
                alt="1. Tell us your requirement - Plot size or renovation work, 2. Compare quotations & hire manpower - Choose what fits budget and trust, 3. Build with support and quality checks - EBC tracks & assists throughout"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="glow" size="action" className="group max-w-full md:w-[399px]">
            Start Your Home Journey 
            <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
