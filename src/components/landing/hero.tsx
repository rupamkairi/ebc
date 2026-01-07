"use client";

import Container from "@/components/containers/containers";
import Break from "@/components/spacing/break";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyLarge } from "@/components/ui/typography";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden bg-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ebc-hero.png"
          // src="/ebc-hero.jpg"
          // src="/ebc-hero.jpeg"
          alt="EBC Hero Background"
          fill
          className="object-cover object-top-right md:object-top-right"
          priority
        />
        {/* Subtle white-to-transparent gradient from left to right */}
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/50 to-transparent md:from-white md:via-white/25 md:to-transparent" />
      </div>

      <Container className="relative z-10 py-16 md:py-24">
        <div className="max-w-xl md:max-w-2xl flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <TypographyH1 className="text-4xl md:text-5xl lg:text-6xl text-[#024caa] leading-tight">
            Build Your Dream Home with Confidence. Not Confusion.
          </TypographyH1>

          <TypographyLarge className="text-slate-900 font-bold max-w-[550px]">
            {t("home_subtitle")}
          </TypographyLarge>

          <div className="flex flex-col sm:flex-row gap-5 pt-2">
            <Button
              size="lg"
              className="cursor-pointer bg-[#024caa] hover:bg-[#023b8a] h-16 px-10 text-lg font-black rounded-xl gap-3 shadow-lg group"
            >
              {t("home_cta_primary")}
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer h-16 px-10 text-lg font-bold border-[#024caa] text-[#024caa] border-2 rounded-xl hover:bg-primary/5 transition-all gap-3"
            >
              {t("home_cta_secondary")}
              <ArrowRight className="size-5" />
            </Button>
          </div>

          <Break />

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 backdrop-blur-sm border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm">
              <ShieldCheck className="size-5 text-[#024caa] fill-[#024caa]/20" />
              {t("serving_families")}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
