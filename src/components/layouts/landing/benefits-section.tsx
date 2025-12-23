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
        <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">
          {t("benefits_title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <CardContent className="p-8 flex items-start gap-6">
                <div className="shrink-0 p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                  {benefit.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center text-slate-500 text-sm italic">
          A better home. A better decision. A better sleep at night.
        </div>
      </div>
    </section>
  );
}
