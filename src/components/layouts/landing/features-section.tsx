"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Coins, Wrench, HardHat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("feature_1_title"),
      desc: t("feature_1_desc"),
      icon: <Coins className="size-10 text-amber-500" />,
      bullets: ["Multiple quotations", "Verified dealers", "Price transparency"],
    },
    {
      title: t("feature_2_title"),
      desc: t("feature_2_desc"),
      icon: <Wrench className="size-10 text-slate-700" />,
      bullets: ["Mason, plumber,", "electrician, painter etc.", "Ratings & reviews"],
    },
    {
      title: t("feature_3_title"),
      desc: t("feature_3_desc"),
      icon: <HardHat className="size-10 text-primary" />,
      bullets: ["BOQ & quantity check", "Site quality visits", "Construction stage guidance"],
    },
  ];

  return (
    <section className="py-24 bg-white border-y">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 uppercase">
            {t("what_is_ebc")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t("ebc_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
                  {feature.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    <span className="text-slate-400 mr-2 text-sm font-normal">({index + 1})</span>
                    {feature.title}
                  </h3>
                  <ul className="space-y-1 text-sm text-slate-600 font-medium">
                    {feature.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <span className="size-1 bg-slate-400 rounded-full" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="rounded-xl px-10 h-14 bg-[#0a5c9a] hover:bg-[#084d82] gap-2 font-bold shadow-lg shadow-blue-500/20">
            How EBC Helps You
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
