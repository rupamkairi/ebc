"use client";

import React, { Suspense, useState } from "react";
import Container from "@/components/ui/containers";
import { useLanguage } from "@/hooks/useLanguage";
import {
  CheckCircle2,
  ChevronRight,
  Tag,
  Calendar,
  MapPin,
  User,
  Search,
  Filter,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOffersQuery } from "@/queries/conferenceHallQueries";
import { useCategoriesQuery } from "@/queries/catalogQueries";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Offer } from "@/types/conference-hall";

// --- Types ---

interface FilterSectionProps {
  title: string;
  options: { label: string; id: string; checked?: boolean }[];
  onToggle: (id: string) => void;
}

// --- Components ---

function FilterSection({ title, options, onToggle }: FilterSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#445EB4] bg-[#445EB4]/5 px-3 py-1.5 rounded-md inline-block">
        {title}
      </h3>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={() => onToggle(opt.id)}
                className="peer appearance-none size-4 rounded-sm border-2 border-slate-200 checked:bg-[#FFA500] checked:border-[#FFA500] transition-all"
              />
              <CheckCircle2 className="absolute size-3 text-white scale-0 peer-checked:scale-100 transition-all" />
            </div>
            <span
              className={cn(
                "text-[11px] font-bold uppercase tracking-tight transition-colors",
                opt.checked
                  ? "text-slate-900"
                  : "text-slate-400 group-hover:text-slate-600",
              )}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Sidebar({
  selectedCategories,
  onCategoryToggle,
}: {
  selectedCategories: string[];
  onCategoryToggle: (id: string) => void;
}) {
  const { t } = useLanguage();
  const { data: categories } = useCategoriesQuery({ isSubCategory: false });

  const categoryOptions =
    categories?.map((cat) => ({
      label: cat.name,
      id: cat.id,
      checked: selectedCategories.includes(cat.id),
    })) || [];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-10">
      <div className="bg-[#445EB4] p-5 rounded-t-2xl shadow-lg shadow-[#445EB4]/20">
        <h2 className="text-xl font-black text-white italic tracking-tight flex items-center gap-3">
          <Tag className="size-5 fill-white/20" />
          {t("offers")}
        </h2>
      </div>

      <div className="bg-white border border-slate-100 rounded-b-2xl p-6 shadow-xl shadow-slate-200/50 space-y-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t("filter")}
          </p>
          <div className="h-px bg-slate-100 w-full" />
        </div>

        <FilterSection
          title={t("offer_categories")}
          options={categoryOptions}
          onToggle={onCategoryToggle}
        />

        <FilterSection
          title={t("offer_validity")}
          options={[
            { label: t("today"), id: "today" },
            { label: t("this_week"), id: "week" },
            { label: t("this_month"), id: "month" },
          ]}
          onToggle={() => {}}
        />

        <FilterSection
          title={t("use_type")}
          options={[
            { label: t("new_home"), id: "new" },
            { label: t("renovation"), id: "renovation" },
          ]}
          onToggle={() => {}}
        />
      </div>
    </aside>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const { t } = useLanguage();
  const detail = offer.offerDetails?.[0];
  const isVerified = offer.verificationStatus === "APPROVED";
  const location = offer.targetRegions?.[0]?.pincode;
  const locationText = location
    ? `${location.district}, ${location.state}`
    : "West Bengal, India";

  return (
    <div className="bg-[#445EB4] rounded-2xl overflow-hidden flex flex-col group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#445EB4]/30 shadow-lg h-full">
      {/* Seller Header */}
      <div className="p-4 bg-white/5 backdrop-blur-md flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-inner">
            <User className="size-6 text-[#445EB4]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-[11px] font-black uppercase tracking-tight truncate">
                {offer.entity?.name || "ABC Supplies"}
              </span>
              {isVerified && (
                <CheckCircle2 className="size-3 text-[#4ade80] fill-[#4ade80]/20 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-white/60 font-medium">
              <MapPin className="size-2.5" />
              <span className="truncate">{locationText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Content */}
      <div className="p-5 flex flex-col gap-4 grow">
        <div className="bg-white/10 rounded-xl p-4 border border-white/5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 opacity-20">
            <Tag className="size-8 text-white rotate-12" />
          </div>
          <div className="flex items-start gap-2 pr-6">
            <ShieldCheck className="size-4 text-[#FFA500] shrink-0 mt-0.5" />
            <h3 className="text-white text-[13px] font-black uppercase leading-tight line-clamp-2 tracking-tight">
              {offer.name}
            </h3>
          </div>

          <div className="space-y-1.5">
            {detail?.startDate && (
              <div className="flex items-center gap-2 text-[9px] font-bold text-white/50 uppercase tracking-widest">
                <Calendar className="size-3" />
                <span>
                  {t("valid_till")}{" "}
                  {detail.endDate
                    ? format(new Date(detail.endDate), "dd/MM/yyyy")
                    : "18/01/2026"}
                </span>
              </div>
            )}
            <div className="text-[9px] font-bold text-[#FFA500]/70 uppercase tracking-widest">
              {t("ends_in")}{" "}
              {(offer.id
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                28) +
                2}{" "}
              {t("days")}
            </div>
          </div>
        </div>

        {/* Badge / Tagline */}
        <div className="flex items-center gap-2 text-[10px] text-white/80 font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <ShieldCheck className="size-3.5 text-[#FFA500]" />
          <span className="truncate uppercase tracking-tight">
            {t("recommended_houses")}
          </span>
        </div>

        <div className="space-y-2 mt-auto">
          <Button className="w-full bg-[#FFA500] hover:bg-[#FFB52E] text-slate-900 font-black rounded-lg h-10 text-[10px] uppercase tracking-[0.1em] transition-all shadow-lg shadow-[#FFA500]/20 border-none">
            {t("get_offer")}
          </Button>
          <Button
            variant="ghost"
            className="w-full border border-white/20 text-white hover:bg-white/10 hover:text-white font-black rounded-lg h-10 text-[10px] uppercase tracking-[0.1em] transition-all"
          >
            {t("ask_question")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OffersHeader() {
  const { t } = useLanguage();
  return (
    <div className="py-12 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="text-[#445EB4]">EBC</span>{" "}
          <span className="text-[#FFA500]">{t("conference_hall")}</span>{" "}
          <span className="text-[#445EB4]">{t("offers")}</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
          &ldquo;Limited-time offers from verified sellers &amp; service
          providers near you&rdquo;
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 pt-4">
        {[
          t("verified_seller_badge"),
          t("transparent_pricing_badge"),
          t("no_hidden_charges"),
          t("admin_approved"),
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-8 rounded-full border-2 border-[#FFA500] flex items-center justify-center">
              <CheckCircle2 className="size-5 text-[#FFA500]" />
            </div>
            <span className="text-slate-600 font-bold text-sm tracking-tight">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OffersPageContent() {
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data: offers, isLoading } = useOffersQuery({});

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const filteredOffers =
    offers?.filter((offer) => {
      if (selectedCategories.length === 0) return true;
      // Check if offer has any relation to selected categories
      return offer.offerRelations.some(
        (rel) =>
          rel.relationType === "CATEGORY" &&
          rel.relationId &&
          selectedCategories.includes(rel.relationId),
      );
    }) || [];

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      <Container size="xl">
        <OffersHeader />

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          <Sidebar
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
          />

          <div className="flex-1 space-y-16">
            {/* Section 1: Today's Offers */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-[#445EB4] tracking-tight">
                  {t("today")}&apos;s <span className="text-[#FFA500]">{t("offers")}</span>{" "}
                  {t("todays_offers_near_you")}
                </h2>
                <div className="h-[3px] bg-slate-100 grow rounded-full" />
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-80 bg-slate-100 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredOffers.slice(0, 3).map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                  {filteredOffers.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed rounded-3xl border-slate-200">
                      <p className="text-slate-400 font-black uppercase tracking-widest">
                        {t("no_offers_found")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Banner */}
            <div className="bg-[#FFF9F0] border border-[#FFE4B5] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="size-12 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                <ShieldCheck className="size-7 text-[#FFA500]" />
              </div>
              <p className="text-slate-600 font-bold text-sm">
                {t("offers_reviewed")}
              </p>
            </div>

            {/* Section 2: Offers Zone */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-[#445EB4] tracking-tight">
                  {t("offers_zone")}
                </h2>
                <div className="h-[3px] bg-slate-100 grow rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading
                  ? [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-80 bg-slate-100 animate-pulse rounded-2xl"
                      />
                    ))
                  : filteredOffers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function OffersPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center font-black text-2xl text-[#445EB4] animate-pulse italic">
          EBC LOADING...
        </div>
      }
    >
      <OffersPageContent />
    </Suspense>
  );
}
