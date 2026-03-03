"use client";

import React, { Suspense, useMemo } from "react";
import Container from "@/components/ui/containers";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useBrowseData, Product } from "@/queries/browse.queries";
import { useBrowseParams, BrowseParams } from "@/hooks/useBrowseParams";
import { cn } from "@/lib/utils";

// --- Types ---

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

interface ServiceCategoryGridProps {
  categories: CategoryItem[] | undefined;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface SubServiceTabsProps {
  subCategories: CategoryItem[] | undefined;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

// --- Components ---

function HireHeader() {
  return (
    <div className="py-12 md:py-16 text-center space-y-6 bg-slate-50/50">
      <Container size="lg">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight flex flex-col md:block line-shimmer">
          <span className="text-[#445EB4]">Hire Professional</span>{" "}
          <span className="text-[#FFA500]">Construction Services</span>
        </h1>
        <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mt-4">
          Connect with verified Experts &amp; get your project done right
        </p>

        <div className="flex flex-col items-center gap-2 pt-6">
          {[
            "Directly engage with qualified professionals.",
            "Transparent pricing and verified work quality.",
            "Services which every Home Construction need.",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-slate-100 max-w-xs w-full justify-center"
            >
              <CheckCircle2 className="size-4 text-[#FFA500] shrink-0" />
              <span className="text-slate-600 font-bold text-xs md:text-sm">{text}</span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

function ServiceCategoryGrid({
  categories,
  selectedId,
  onSelect,
}: ServiceCategoryGridProps) {
  const categoryStyles: Record<string, { icon: string; bg: string }> = {
    "house construction services": { icon: "🏠", bg: "bg-white" },
    "design & consultancy services": { icon: "📐", bg: "bg-white" },
    "civil & structural works": { icon: "🏢", bg: "bg-white" },
    "plumbing services": { icon: "🔧", bg: "bg-white" },
    "electrical services": { icon: "⚡", bg: "bg-white" },
  };

  return (
    <div className="py-10 md:py-16 bg-white border-y border-slate-100">
      <Container size="lg">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg md:text-2xl font-black text-[#445EB4] uppercase tracking-wider relative inline-block">
            Service Categories
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FFA500] rounded-full" />
          </h2>
        </div>

        {/* On mobile: 2-col stacked icon+label. On desktop: 5-col side-by-side */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {categories?.map((cat) => {
            const style = categoryStyles[cat.name.toLowerCase()] || {
              icon: "🛠️",
              bg: "bg-white",
            };
            const isActive = selectedId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(isActive ? null : cat.id)}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-2 md:gap-4 p-3 md:p-5 rounded-xl border transition-all duration-300 group relative overflow-hidden text-center md:text-left",
                  isActive
                    ? "bg-[#FFA500] border-[#FFA500] text-white shadow-xl scale-105 z-10"
                    : "bg-white border-slate-200 text-slate-800 hover:border-[#FFA500] hover:shadow-lg",
                )}
              >
                <span className="text-2xl md:text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {style.icon}
                </span>
                <span className="font-black text-[10px] md:text-xs uppercase leading-tight tracking-tight">
                  {cat.name}
                </span>
                {isActive && (
                  <div className="absolute top-0 right-0 p-1">
                    <CheckCircle2 className="size-3 text-white/50" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

function SubServiceTabs({
  subCategories,
  selectedIds,
  onToggle,
}: SubServiceTabsProps) {
  if (!subCategories || subCategories.length === 0) return null;

  return (
    <div className="py-8 md:py-12 bg-slate-50/50">
      <Container size="lg">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-base md:text-xl font-black text-[#445EB4] uppercase tracking-wider">
            Sub Service Categories
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
          {subCategories.map((sub) => {
            const isActive = selectedIds.includes(sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => onToggle(sub.id)}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-full border text-[10px] md:text-xs font-black uppercase transition-all tracking-widest",
                  isActive
                    ? "bg-[#FFA500] border-[#FFA500] text-white shadow-lg -translate-y-0.5"
                    : "bg-white border-slate-200 text-slate-400 hover:border-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/5",
                )}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

function ServiceCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group h-full">
      <div className="bg-[#4D4D4D] p-3 md:p-4 text-center group-hover:bg-[#445EB4] transition-colors duration-500">
        <h3 className="text-white text-[11px] md:text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug">
          {product.title}
        </h3>
      </div>
      <div className="p-3 md:p-6 flex flex-col gap-4 md:gap-6 items-center grow relative">
        <div className="relative size-20 md:size-36 transition-all duration-500 group-hover:scale-110">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain grayscale contrast-125 brightness-110 group-hover:grayscale-0 transition-all duration-700"
            unoptimized
          />
        </div>
        <Button
          className="w-full bg-white border border-slate-200 text-[#FFA500] hover:bg-[#FFA500] hover:text-white font-black rounded-lg h-9 md:h-12 text-[10px] md:text-[12px] uppercase tracking-widest transition-all duration-300 shadow-sm"
          variant="outline"
        >
          Request Appointment
        </Button>
      </div>
      <div className="h-1.5 w-0 bg-[#FFA500] group-hover:w-full transition-all duration-700" />
    </div>
  );
}

function CTASection() {
  return (
    <div className="py-16 md:py-24 bg-white text-center space-y-8 border-t border-slate-100 px-4">
      <h2 className="text-2xl md:text-5xl font-black tracking-tight">
        <span className="text-[#445EB4]">Not sure which service</span>{" "}
        <span className="text-[#FFA500]">you need?</span>
      </h2>
      <div className="flex justify-center">
        <Button className="bg-[#0A1D56] hover:bg-[#152C74] text-white w-full max-w-sm px-5 py-6 md:py-8 rounded-xl font-black text-sm md:text-base whitespace-nowrap shadow-[0_20px_50px_rgba(10,29,86,0.3)] transition-all hover:scale-105 active:scale-95 group">
          Talk to an Expert | Get Free Consultation
          <ChevronRight className="ml-2 shrink-0 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

// --- Main Page Content ---

function HirePageContent() {
  const { params, setParentCategory, toggleSubCategory } = useBrowseParams();

  const serviceParams: BrowseParams = useMemo(
    () => ({
      ...params,
      type: "SERVICE" as const,
    }),
    [params],
  );

  const { data, isLoading } = useBrowseData(serviceParams);

  return (
    <div className="min-h-screen bg-slate-50/20">
      <HireHeader />

      <ServiceCategoryGrid
        categories={data?.categories}
        selectedId={params.parentCategory}
        onSelect={setParentCategory}
      />

      <SubServiceTabs
        subCategories={data?.subCategories}
        selectedIds={params.subCategory}
        onToggle={toggleSubCategory}
      />

      <div className="py-12 md:py-20 bg-white">
        <Container size="lg">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xl md:text-3xl font-black text-[#445EB4] uppercase tracking-wider relative inline-block">
              Available Services
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#FFA500] rounded-full" />
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-56 md:h-80 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {data?.products.map((service) => (
                <ServiceCard key={service.id} product={service} />
              ))}
            </div>
          )}

          {!isLoading && (!data?.products || data.products.length === 0) && (
            <div className="py-20 md:py-32 text-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200">
              <div className="max-w-md mx-auto space-y-4 px-4">
                <p className="text-slate-400 font-bold text-base md:text-lg uppercase tracking-widest">
                  No matching services
                </p>
                <p className="text-slate-500 text-sm">
                  We couldn&apos;t find any services matching your current
                  filters. Try selecting a different category or clearing some
                  filters.
                </p>
                <Button
                  variant="link"
                  onClick={() => setParentCategory(null)}
                  className="text-[#FFA500] font-black"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>

      <CTASection />
    </div>
  );
}

export default function HirePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center font-black text-2xl text-[#445EB4] animate-pulse">
          EBC LOADING...
        </div>
      }
    >
      <HirePageContent />
    </Suspense>
  );
}
