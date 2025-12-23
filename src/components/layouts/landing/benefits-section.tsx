"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { 
  PiggyBank, 
  MousePointer2, 
  Target, 
  BadgeCheck, 
  FileText, 
  Hammer 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function BenefitsSection() {
  const { t } = useLanguage();

  const benefits = [
    { title: t("benefit_1_title"), desc: t("benefit_1_desc"), icon: <PiggyBank className="size-8 text-primary" /> },
    { title: t("benefit_2_title"), desc: t("benefit_2_desc"), icon: <MousePointer2 className="size-8 text-primary" /> },
    { title: t("benefit_3_title"), desc: t("benefit_3_desc"), icon: <Target className="size-8 text-primary" /> },
    { title: t("benefit_4_title"), desc: t("benefit_4_desc"), icon: <BadgeCheck className="size-8 text-primary" /> },
    { title: t("benefit_5_title"), desc: t("benefit_5_desc"), icon: <FileText className="size-8 text-primary" /> },
    { title: t("benefit_6_title"), desc: t("benefit_6_desc"), icon: <Hammer className="size-8 text-primary" /> },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            {t("benefits_title")}
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none bg-background/50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-3xl group">
              <CardContent className="p-8 flex items-start gap-6">
                <div className="shrink-0 p-4 rounded-2xl bg-white shadow-md border border-border group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-xl text-foreground leading-tight">{benefit.title}</h4>
                  <p className="text-base text-foreground/60 font-medium leading-relaxed">{benefit.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 text-center text-foreground/40 text-lg font-black italic tracking-wide uppercase">
          A better home. A better decision. A better sleep at night.
        </div>
      </div>
    </section>
  );
}
