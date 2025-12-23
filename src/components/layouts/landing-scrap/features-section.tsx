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
    <section className="py-24 bg-white border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary uppercase">
            {t("what_is_ebc")}
          </h2>
          <p className="text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto font-medium">
            {t("ebc_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-4xl bg-background/50 group">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-8">
                <div className="p-6 rounded-3xl bg-white shadow-lg border border-border group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-foreground flex items-center justify-center gap-3">
                    <span className="text-primary/30 text-lg font-black">0{index + 1}</span>
                    {feature.title}
                  </h3>
                  <ul className="space-y-3 text-base text-foreground/60 font-bold">
                    {feature.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center justify-center gap-3">
                        <span className="size-2 bg-secondary rounded-full" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button size="lg" className="rounded-2xl px-12 h-16 bg-primary hover:bg-primary/90 gap-3 font-black text-lg shadow-2xl shadow-primary/20 group">
            How EBC Helps You
            <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
