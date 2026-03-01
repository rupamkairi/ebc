"use client";

import Container from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, UserRound, Scale, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  const trustFeatures = [
    { key: "verified_seller" },
    { key: "free_tools" },
    { key: "transparent_pricing" },
    { key: "engineer_support" },
  ];

  const SearchBar = (
    <div className="w-full flex justify-center mb-6 md:mb-12 mt-2 md:mt-0">
      <div className="w-full max-w-2xl px-2 md:px-4">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full h-12 md:h-14 pl-6 pr-14 rounded-full border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/40 transition-all text-slate-700 text-base md:text-lg"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 h-9 w-9 md:h-11 md:w-11 flex items-center justify-center bg-[#FFA500] hover:bg-[#E69500] rounded-full text-white transition-all shadow-md active:scale-95"
          >
            <Search className="size-4 md:size-5" />
          </button>
        </form>
      </div>
    </div>
  );

  const Heading = (
    <div className="w-full text-center max-w-6xl mb-4 md:mb-12 mx-auto px-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#445EB4] leading-tight mb-3 md:mb-4 tracking-tight">
        Build Your <span className="text-[#FFA500]">Dream Home</span>
        <br className="md:hidden" /> with Confidence Not Confusion
      </h1>
      <p className="text-[13px] sm:text-base md:text-lg text-[#3B5998] md:text-slate-700 font-bold max-w-4xl mx-auto leading-relaxed px-4">
        Know your real construction cost, compare verified sellers, and decide
        with expert guidance.
      </p>
    </div>
  );

  const CTAButtons = (
    <div className="flex flex-col gap-3.5 md:gap-4 w-full md:w-auto">
      {/* CTA 1: Consult with Expert */}
      <Button
        className="group h-[54px] md:h-[60px] pl-1.5 pr-6 md:pr-8 py-0 bg-[#445EB4] hover:bg-[#3b519b] text-white rounded-full flex items-center gap-4 transition-all duration-300 shadow-xl border-none w-full md:w-auto"
        asChild
      >
        <a href="#consult">
          <div className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <UserRound className="size-5 md:size-6 text-white" />
          </div>
          <span className="text-[15px] md:text-lg font-extrabold whitespace-nowrap mx-auto md:mx-0 pr-4 md:pr-0">
            Consult With an Expert (Free)
          </span>
        </a>
      </Button>

      {/* CTA 2: Compare Material Rate */}
      <Button
        className="group h-[54px] md:h-[60px] pl-1.5 pr-6 md:pr-8 py-0 bg-[#445EB4] hover:bg-[#3b519b] text-white rounded-full flex items-center gap-4 transition-all duration-300 shadow-xl border-none w-full md:w-auto"
        asChild
      >
        <a href="#compare">
          <div className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg group-hover:-rotate-12 transition-transform">
            <Scale className="size-5 md:size-6 text-white" />
          </div>
          <span className="text-[15px] md:text-lg font-extrabold whitespace-nowrap mx-auto md:mx-0 pr-4 md:pr-0">
            Compare Material Rate (Free)
          </span>
        </a>
      </Button>
    </div>
  );

  const TrustBar = (
    <div className="w-full bg-white/95 backdrop-blur-sm border-t border-slate-100 py-3 md:py-4 overflow-hidden z-20">
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 md:gap-20">
          {[...trustFeatures, ...trustFeatures, ...trustFeatures].map(
            (feature, index) => (
              <div
                key={`${feature.key}-${index}`}
                className="flex items-center gap-2 shrink-0"
              >
                <CheckCircle2 className="size-4 md:size-6 text-[#FFA500]" />
                <span className="text-[#445EB4] font-bold text-xs md:text-base whitespace-nowrap">
                  {t(feature.key)}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE LAYOUT (Flows cleanly from top to bottom) */}
      <section className="flex flex-col md:hidden w-full bg-white pt-6 pb-0 shadow-sm relative z-0">
        <Container size="xl" className="px-2 relative z-20">
          {SearchBar}
        </Container>

        {/* Stretched Mobile Image with Heading Overlay */}
        <div className="w-full relative h-[380px] sm:h-[480px] mt-1 z-10 flex flex-col justify-start">
          <Image
            src="/images/hero-home.jpg"
            alt="EBC Hero Background"
            fill
            className="object-cover object-right"
            sizes="100vw"
            priority
          />
          {/* Stronger fade at top so the heading text is perfectly readable over the image */}
          <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white via-white/80 to-transparent pointer-events-none" />

          {/* Heading overlayed on the top part of the background image */}
          <div className="relative z-20 w-full pt-4">{Heading}</div>
        </div>

        {/* Buttons fitted securely below the image */}
        <div className="w-full px-4 mt-4 mb-8 relative z-20">{CTAButtons}</div>

        {TrustBar}
      </section>

      {/* DESKTOP LAYOUT (Classic absolute overlay method) */}
      <section className="relative min-h-[600px] sm:min-h-[650px] md:min-h-[700px] w-full overflow-hidden bg-white pt-12 pb-36 hidden md:flex flex-col">
        {/* Absolute Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-home.jpg"
            alt="EBC Hero Background Desktop"
            fill
            className="object-cover object-bottom"
            sizes="100vw"
            priority
          />
          {/* Soft White Gradients */}
          <div className="absolute inset-0 bg-linear-to-b from-white/95 via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-white/60 via-transparent to-transparent" />
        </div>

        <Container
          size="xl"
          className="relative z-10 flex flex-col items-start h-full grow w-full"
        >
          {SearchBar}
          {Heading}
          <div className="w-full flex justify-start my-auto">{CTAButtons}</div>
        </Container>

        <div className="absolute bottom-0 left-0 w-full z-20">{TrustBar}</div>
      </section>
    </>
  );
}
