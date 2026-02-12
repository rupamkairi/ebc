"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, UserRound, Scale, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t } = useLanguage();
  
  const trustFeatures = [
    { key: "verified_seller" },
    { key: "free_tools" },
    { key: "transparent_pricing" },
    { key: "engineer_support" },
  ];

  return (
    <section className="relative min-h-[700px] w-full overflow-hidden bg-white pt-12 pb-24 md:pb-36">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-home.jpg"
          alt="EBC Hero Background"
          fill
          className="object-cover object-bottom"
          priority
        />
        {/* Subtle white-to-transparent gradient from top to bottom and left side */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent hidden md:block" />
      </div>

      <Container size="xl" className="relative z-10 flex flex-col items-start">
        {/* Centered Search Bar */}
        <div className="w-full flex justify-center mb-12">
          <div className="w-full max-w-2xl px-4">
            <div className="relative group">
              <input
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full h-14 pl-8 pr-16 rounded-full border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/40 transition-all text-slate-700 text-lg"
              />
              <button className="absolute right-1.5 top-1.5 h-11 w-11 flex items-center justify-center bg-[#FFA500] hover:bg-[#E69500] rounded-full text-white transition-all shadow-md active:scale-95">
                <Search className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Heading Section - Centered */}
        <div className="w-full text-center max-w-6xl mb-12 mx-auto">
          <h1 className="text-xl md:text-2xl lg:text-5xl font-black text-[#445EB4] leading-tight mb-4 tracking-tight">
            Build Your <span className="text-[#FFA500]">Dream Home</span> with Confidence Not Confusion
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-bold max-w-4xl mx-auto leading-relaxed">
            {t("home_subtitle")}
          </p>
        </div>

        {/* Styled CTA Buttons - Left Aligned */}
        <div className="w-full flex justify-start">
          <div className="flex flex-col gap-4">
            {/* CTA 1: Consult with Expert */}
            <Button
              className="group h-[60px] pl-1.5 pr-8 py-0 bg-[#445EB4] hover:bg-[#3b519b] text-white rounded-full flex items-center gap-4 transition-all duration-300 hover:translate-x-2 shadow-xl border-none"
              asChild
            >
              <a href="#consult">
                <div className="h-11 w-11 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <UserRound className="size-6 text-white" />
                </div>
                <span className="text-lg font-extrabold whitespace-nowrap">
                  {t("home_cta_primary")}
                </span>
              </a>
            </Button>

            {/* CTA 2: Compare Material Rate */}
            <Button
              className="group h-[60px] pl-1.5 pr-8 py-0 bg-[#445EB4] hover:bg-[#3b519b] text-white rounded-full flex items-center gap-4 transition-all duration-300 hover:translate-x-2 shadow-xl border-none"
              asChild
            >
              <a href="#compare">
                <div className="h-11 w-11 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg group-hover:-rotate-12 transition-transform">
                  <Scale className="size-6 text-white" />
                </div>
                <span className="text-lg font-extrabold whitespace-nowrap">
                  {t("home_cta_secondary")}
                </span>
              </a>
            </Button>
          </div>
        </div>
      </Container>

      {/* Trust Bar Bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-slate-100 py-3 md:py-4 z-20 overflow-hidden">
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 md:gap-20">
            {/* Repeat items twice for a smooth continuous scroll */}
            {[...trustFeatures, ...trustFeatures, ...trustFeatures].map((feature, index) => (
              <div key={`${feature.key}-${index}`} className="flex items-center gap-2 shrink-0">
                <CheckCircle2 className="size-5 md:size-6 text-[#FFA500]" />
                <span className="text-[#445EB4] font-bold text-sm md:text-base whitespace-nowrap">
                  {t(feature.key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
