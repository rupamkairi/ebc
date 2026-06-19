"use client";

import Container from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="scroll-mt-24 py-responsive bg-white">
      <Container size="lg">
        <div className="text-center mb-12">
          <TypographyH2 className="text-4xl lg:text-5xl font-black text-primary">
            {t("how_it_works_section_title_prefix")}
            <span className="text-secondary">{t("how_it_works_section_title_highlight")}</span>
            {t("how_it_works_section_title_suffix")}
          </TypographyH2>
          <TypographyP className="text-muted-foreground mt-4 text-base md:text-lg font-medium">
            {t("how_it_works_section_subtitle")}
          </TypographyP>
        </div>

        <div className="relative mb-8 md:mb-16">
          <div className="w-full aspect-22/9 relative">
            <Image
              src="/images/how-it-works/steps.png"
              alt="1. Tell us your requirement - Plot size or renovation work, 2. Compare quotations & hire manpower - Choose what fits budget and trust, 3. Build with support and quality checks - EBC tracks & assists throughout"
              fill
              className="object-contain px-2 md:px-0"
              priority
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/browse">
            <Button variant="glow" size="action" className="group">
              {t("home_journey_cta")}
              <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
