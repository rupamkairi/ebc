"use client";

import Container from "@/components/ui/containers";
import { AccordionBase } from "@/components/shared/accordion-base";
import Break from "@/components/ui/break";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function FaqSection() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t("faq_1_q"),
      answer: t("faq_1_a"),
    },
    {
      question: t("faq_2_q"),
      answer: t("faq_2_a"),
    },
    {
      question: t("faq_3_q"),
      answer: t("faq_3_a"),
    },
    {
      question: t("faq_4_q"),
      answer: t("faq_4_a"),
    },
    {
      question: t("faq_5_q"),
      answer: t("faq_5_a"),
    },
    {
      question: t("faq_6_q"),
      answer: t("faq_6_a"),
    },
    {
      question: t("faq_7_q"),
      answer: t("faq_7_a"),
    },
    {
      question: t("faq_8_q"),
      answer: t("faq_8_a"),
    },
    {
      question: t("faq_9_q"),
      answer: t("faq_9_a"),
    },
    {
      question: t("faq_10_q"),
      answer: t("faq_10_a"),
    },
    {
      question: t("faq_bonus_q"),
      answer: t("faq_bonus_a"),
    },
  ];

  return (
    <section className="py-responsive">
      <div className="text-center">
        <TypographyH1>{t("faq_title")}</TypographyH1>
        <Break size="sm" />
      </div>
      <Container size="md">
        <div className="space-y-4">
          <AccordionBase items={faqItems} />
        </div>

        <Break />

        <div className="flex justify-center">
          <Button variant="glow" size="action" className="group">
            {t("faq_still_questions")}
            <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
