"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  Users,
  ShieldCheck,
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { BuyerHeader } from "@/app/(dashboard)/buyer-dashboard/buyer-header";
// import { BuyerBottomNav } from "@/app/(dashboard)/buyer-dashboard/buyer-bottom-nav";
import { DashboardCard } from "@/components/dashboard/seller/dashboard-card";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function BuyerHowItHelps() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is EBC really free for me?",
      a: "Yes! Search materials, get quotes, find workers, and access basic guidance completely free.",
    },
    {
      q: "How do I know material prices are fair?",
      a: "We provide direct quotes from multiple verified local sellers so you can compare real market prices.",
    },
    {
      q: "Are workers and contractors reliable?",
      a: "We verify identity (KYC) and provide ratings/reviews from other homeowners for every professional.",
    },
    {
      q: "Can an engineer help with a small house?",
      a: "Yes! Right quantity and quality are crucial for any size to prevent future problems.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* <BuyerHeader /> */}

      <main className="flex-1">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-border py-4">
          <div className="container mx-auto px-4">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
            >
              <ChevronLeft size={16} />
              {t("return_to_selection")}
            </Link>
          </div>
        </div>

        {/* Hero Section - Dashboard Style */}
        <section className="py-12 bg-muted/20 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-4xl border border-border overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch">
              <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/buyer_hero.png"
                  alt="Family building home"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-primary/10" />
              </div>
              <div className="p-8 md:p-12 flex-1 flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-wider w-fit">
                  <Sparkles size={14} />
                  Homeowner Path
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
                  {t("buyer_hero_title")}
                </h1>
                <p className="text-lg text-foreground/60 font-medium leading-relaxed">
                  {t("buyer_hero_subtitle")}
                </p>
                <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary italic font-bold text-primary">
                  &quot;{t("buyer_hinglish_tag")}&quot;
                </div>
                <Link href="/auth/login?role=buyer">
                  <Button
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 w-full md:w-fit px-12 py-7 text-lg font-black rounded-xl shadow-lg shadow-secondary/20 gap-3 group"
                  >
                    {t("buyer_final_cta")}
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Proposition - Using Dashboard Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-foreground mb-4">
                {t("buyer_free_title")}
              </h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <DashboardCard
                title="Free Quotations."
                iconComponent={
                  <CircleDollarSign className="size-5 mr-3 text-primary" />
                }
              >
                <div className="space-y-4">
                  <p className="font-bold text-foreground/70 leading-relaxed">
                    {t("buyer_free_1")}
                  </p>
                  <p className="text-sm font-medium text-foreground/40">
                    Multiple local sellers compete to give you the best market
                    rates.
                  </p>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Verified Professionals."
                iconComponent={<Users className="size-5 mr-3 text-primary" />}
              >
                <div className="space-y-4">
                  <p className="font-bold text-foreground/70 leading-relaxed">
                    {t("buyer_free_3")}
                  </p>
                  <p className="text-sm font-medium text-foreground/40">
                    Mistris, Plumbers & Electricians with identity checks and
                    reviews.
                  </p>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Expert Guidance."
                iconComponent={
                  <ShieldCheck className="size-5 mr-3 text-primary" />
                }
              >
                <div className="space-y-4">
                  <p className="font-bold text-foreground/70 leading-relaxed">
                    {t("buyer_free_4")}
                  </p>
                  <p className="text-sm font-medium text-foreground/40">
                    Standard guidance on construction stages to prevent costly
                    mistakes.
                  </p>
                </div>
              </DashboardCard>
            </div>
          </div>
        </section>

        {/* Why Choose EBC Comparisons */}
        <section className="py-16 bg-muted/10 border-y border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-foreground">
                {t("buyer_why_title")}
              </h2>
              <p className="text-foreground/60 font-medium mt-2">
                {t("buyer_why_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm space-y-4">
                <div className="size-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <Plus className="rotate-45" size={24} />
                </div>
                <h4 className="text-xl font-black text-foreground">
                  {t("buyer_why_point_1")}
                </h4>
                <p className="text-red-500/80 font-bold italic">
                  {t("buyer_why_result")}
                </p>
              </div>

              <div className="bg-primary p-8 rounded-2xl shadow-xl shadow-primary/10 space-y-4 text-white">
                <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-xl font-black">The EBC Experience</h4>
                <ul className="space-y-3 font-bold opacity-80 italic">
                  <li className="flex items-center gap-2">
                    Sahi rates, sahi material
                  </li>
                  <li className="flex items-center gap-2">
                    No unwanted delays
                  </li>
                  <li className="flex items-center gap-2">
                    Strength that lasts
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - App Style Accordion */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-3xl font-black text-foreground">
                {t("buyer_faq_title")}
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left font-bold text-lg py-5 px-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <span className="flex-1 pr-4 font-black">Q: {faq.q}</span>
                    {openFaq === i ? (
                      <Minus size={20} className="text-primary" />
                    ) : (
                      <Plus size={20} className="text-foreground/20" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      openFaq === i
                        ? "grid-rows-[1fr] opacity-100 border-t border-border"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden px-6 py-6 text-foreground/60 font-medium leading-relaxed bg-muted/10">
                      <span className="font-black text-primary mr-2 uppercase text-xs">
                        Answer:
                      </span>{" "}
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[2.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  {t("buyer_final_title")}
                </h2>
                <p className="text-xl md:text-2xl opacity-80 font-medium leading-relaxed italic">
                  &quot;Aapke sapno ka ghar, majboot neev maangta hai. EBC ke
                  saath shuru karein.&quot;
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Link
                    href="/auth/login?role=buyer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 w-full h-16 px-12 text-lg font-black rounded-xl gap-3 shadow-2xl shadow-black/20 group"
                    >
                      {t("buyer_final_cta")}
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <BuyerBottomNav /> */}
    </div>
  );
}
