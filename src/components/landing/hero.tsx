"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, UserRound, Scale } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[700px] w-full overflow-hidden bg-white pt-12 pb-24 md:pb-36">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-home.jpg"
          alt="EBC Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Subtle white-to-transparent gradient from top to bottom and left side */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent hidden md:block" />
      </div>

      <Container className="relative z-10 flex flex-col items-center">
        {/* Centered Search Bar */}
        <div className="w-full max-w-2xl mb-16 px-4">
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

        {/* Main Heading Section */}
        <div className="w-full text-center max-w-5xl mb-16 px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#445EB4] leading-tight mb-6 tracking-tight">
            Build Your <span className="text-[#FFA500]">Dream Home</span> with Confidence Not Confusion
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-bold max-w-3xl mx-auto leading-relaxed">
            {t("home_subtitle")}
          </p>
        </div>

        {/* Styled CTA Buttons - Left Aligned on Desktop */}
        <div className="w-full flex justify-center md:justify-start">
          <div className="flex flex-col gap-6 md:pl-10">
            {/* CTA 1: Consult with Expert */}
            <Button
              className="group h-[72px] pl-1.5 pr-10 py-0 bg-[#445EB4] hover:bg-[#3b519b] text-white rounded-full flex items-center gap-6 transition-all duration-300 hover:translate-x-2 shadow-2xl border-none"
              asChild
            >
              <a href="#consult">
                <div className="h-14 w-14 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <UserRound className="size-8 text-white" />
                </div>
                <span className="text-xl font-extrabold whitespace-nowrap">
                  {t("home_cta_primary")}
                </span>
              </a>
            </Button>

            {/* CTA 2: Compare Material Rate */}
            <Button
              className="group h-[72px] pl-1.5 pr-10 py-0 bg-[#445EB4] hover:bg-[#3b519b] text-white rounded-full flex items-center gap-6 transition-all duration-300 hover:translate-x-2 shadow-2xl border-none"
              asChild
            >
              <a href="#compare">
                <div className="h-14 w-14 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg group-hover:-rotate-12 transition-transform">
                  <Scale className="size-8 text-white" />
                </div>
                <span className="text-xl font-extrabold whitespace-nowrap">
                  {t("home_cta_secondary")}
                </span>
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
