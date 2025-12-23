"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
              <CheckCircle2 className="mr-2 size-4 text-primary" />
              {t("serving_families")}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {t("home_title")}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-[600px] leading-relaxed">
              {t("home_subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base font-semibold gap-2">
                {t("home_cta_primary")}
                <ArrowRight className="size-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold">
                {t("home_cta_secondary")}
              </Button>
            </div>
          </div>
          
          <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square animate-in fade-in slide-in-from-right duration-700">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-2" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/ebc-hero.png"
                alt="Family with Architect"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
