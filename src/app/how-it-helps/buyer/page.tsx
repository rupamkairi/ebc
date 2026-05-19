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
  BadgeAlert,
  Lock,
  Truck,
  Calendar,
  Search,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/header";
import { FooterSection } from "@/components/landing/footer-section";

export default function BuyerHowItHelps() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: t("buyer_faq_1_q"),
      a: t("buyer_faq_1_a"),
    },
    {
      q: t("buyer_faq_2_q"),
      a: t("buyer_faq_2_a"),
    },
    {
      q: t("buyer_faq_3_q"),
      a: t("buyer_faq_3_a"),
    },
    {
      q: t("buyer_faq_4_q"),
      a: t("buyer_faq_4_a"),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-16 relative overflow-hidden">
        {/* Background Glowing Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        {/* Floating Back Navigation Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40 py-4 shadow-2xs">
          <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
            <Link
              href="/how-it-helps"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-black text-primary hover:text-primary/80 transition-all group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              {t("return_to_selection", "Back to Selection")}
            </Link>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
              {t("homeowner_path", "Homeowner Path")}
            </span>
          </div>
        </div>

        {/* Hero Section - Dashboard Style Glassmorphism */}
        <section className="py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-xl flex flex-col lg:flex-row items-stretch relative">
              
              {/* Left Side: Premium Image Container with Glass Overlay */}
              <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-auto overflow-hidden bg-primary/10">
                <Image
                  src="/images/buyer_hero.png"
                  alt="Family building home"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-primary/15 to-transparent" />
                
                {/* Visual Glassmorphic Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-1 shadow-lg">
                  <span className="text-[9px] font-black tracking-widest uppercase text-secondary">EBC Mission</span>
                  <p className="text-sm font-bold italic leading-relaxed">
                    &quot;{t("buyer_hinglish_tag", "Aapke sapno ka ghar, majboot neev maangta hai.")}&quot;
                  </p>
                </div>
              </div>

              {/* Right Side: Hero Content Copy */}
              <div className="p-8 md:p-14 flex-1 flex flex-col justify-center space-y-6 lg:max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-1.5 text-xs font-black w-fit uppercase tracking-wider">
                  <Sparkles size={14} className="text-secondary" />
                  {t("buyer_hero_badge", "Protected Procurement")}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.05]">
                  {t("buyer_hero_title", "Build Your Home with Total Financial Safety")}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                  {t("buyer_hero_subtitle", "Stop overpaying local retail yards. Compare dynamic wholesale quotes live, access verified specialists, and secure all milestone payments in escrow.")}
                </p>

                {/* Sub CTA Links */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/auth/login?role=buyer" className="w-full sm:w-auto">
                    <Button
                      size="xl"
                      className="bg-secondary hover:bg-secondary/95 text-secondary-foreground w-full sm:w-auto px-10 py-6 text-sm font-black rounded-xl shadow-xl shadow-secondary/20 gap-2 cursor-pointer group"
                    >
                      {t("buyer_final_cta", "Start Building Securely")}
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/browse" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="xl"
                      className="w-full sm:w-auto px-8 py-6 text-sm font-black rounded-xl cursor-pointer border-border hover:bg-accent/40"
                    >
                      Browse Materials
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Three Core Value Proposition Pillars */}
        <section className="py-12 border-t border-border">
          <div className="container max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {t("buyer_free_title", "Everything You Need, Covered 100% Free")}
              </h2>
              <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
              <p className="text-sm text-muted-foreground font-medium max-w-xl mx-auto">
                Homeowners do not pay platform service fees. Compare quotes and connect with contractors for free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Pillar 1: Free Quotations */}
              <div className="bg-white p-8 rounded-3xl border border-border shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <CircleDollarSign className="size-6" />
                </div>
                <h3 className="text-lg font-black text-foreground">{t("free_quotations", "Free Competitive Quotes")}</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  {t("buyer_free_1", "Compare factor-direct prices on steel, brick, and cement directly inside your dashboard.")}
                </p>
                <p className="text-xs font-semibold text-muted-foreground leading-normal">
                  {t("free_quotations_desc", "Dealers bid dynamically to win your order. Review proposals side-by-side without endless phone calls.")}
                </p>
              </div>

              {/* Pillar 2: Verified Professionals */}
              <div className="bg-white p-8 rounded-3xl border border-border shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="size-6" />
                </div>
                <h3 className="text-lg font-black text-foreground">{t("verified_professionals", "Vetted Specialists")}</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  {t("buyer_free_3", "Connect with verified consultants, architectural planners, and civil engineers near your location.")}
                </p>
                <p className="text-xs font-semibold text-muted-foreground leading-normal">
                  {t("verified_professionals_desc", "Review verified customer ratings, past structural drawings, and credentials before initiating contact.")}
                </p>
              </div>

              {/* Pillar 3: Expert Guidance */}
              <div className="bg-white p-8 rounded-3xl border border-border shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-lg font-black text-foreground">{t("expert_guidance", "Escrow & Quality Backing")}</h3>
                <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                  {t("buyer_free_4", "Rest easy with payment escrow protection and structural quality field grade assessments.")}
                </p>
                <p className="text-xs font-semibold text-muted-foreground leading-normal">
                  {t("expert_guidance_desc", "Payments release to providers only after milestone approvals. EBC site engineers perform optional grade tests on plot.")}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Detailed Homeowner Workflow Timeline */}
        <section className="py-16 bg-accent/20 border-y border-border">
          <div className="container max-w-4xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-md">
                EBC Step-by-Step
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                How Your Sourcing Journey Works
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                We streamlined material sourcing and specialist booking into four transparent stages.
              </p>
            </div>

            <div className="border-l-2 border-dashed border-border ml-4 pl-8 space-y-10 relative">
              {[
                {
                  step: 1,
                  title: "Browse & Select Items",
                  icon: Search,
                  desc: "Search materials (bricks, steel, cement) or browse specialists (architects, foundation engineers) inside our curated regional directories.",
                },
                {
                  step: 2,
                  title: "Submit Enquiry or Appointment",
                  icon: Calendar,
                  desc: "For materials, list quantities and your delivery target. For services, pick a specialist and select exactly three preferred time slot options.",
                },
                {
                  step: 3,
                  title: "Receive Competitor Quotes",
                  icon: MessageSquare,
                  desc: "Local yards propose dynamic wholesale rates, while service specialists immediately confirm one of your three requested calendar slots.",
                },
                {
                  step: 4,
                  title: "Secure Escrow Lock & Fulfill",
                  icon: Lock,
                  desc: "Pay securely via EBC Escrow. Funds are locked safely and only paid out once EBC Logistics completes tracked delivery to your site.",
                },
              ].map((flow) => {
                const FlowIcon = flow.icon;
                return (
                  <div key={flow.step} className="relative group/timeline">
                    {/* Circle badge */}
                    <div className="absolute -left-[45px] top-0 size-8 rounded-full bg-primary border-2 border-white text-white flex items-center justify-center text-xs font-black shadow-sm group-hover/timeline:scale-105 transition-transform">
                      {flow.step}
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-2 hover:border-primary/40 transition-colors">
                      <div className="flex items-center gap-2 text-primary">
                        <FlowIcon size={16} />
                        <h4 className="text-sm font-black text-foreground tracking-tight">{flow.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{flow.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose EBC Comparisons: Traditional vs EBC Experience */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {t("buyer_why_title", "Traditional Stress vs. The EBC Advantage")}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {t("buyer_why_desc", "Why handle the old, opaque building logistics alone? See how EBC guarantees a safe project.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Traditional Stress (Red theme) */}
              <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                    <BadgeAlert size={24} />
                  </div>
                  <h4 className="text-lg font-black text-foreground">
                    {t("buyer_why_point_1", "Traditional Self-Procuring Flaws")}
                  </h4>
                  <ul className="space-y-3 text-xs text-red-700/80 font-bold leading-normal">
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span>Opaque local rates; dealers inflate prices based on your project size.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span>High risk of duplicate cement brands or lower-strength structural steel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span>Contractors stall work continuously demanding cash advances.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50/50 p-4 rounded-xl border-l-4 border-red-500 text-xs font-bold text-red-700 italic">
                  {t("buyer_why_result", "Result: Blown budgets, structural defects, and massive stress.")}
                </div>
              </div>

              {/* EBC Experience (Blue/Emerald theme) */}
              <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/10 text-white space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-lg font-black">{t("ebc_experience", "The EBC Experience")}</h4>
                  <ul className="space-y-3 text-xs opacity-90 font-bold leading-normal">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      <span>{t("ebc_experience_1", "Competitive dynamic bidding ensures regional factory-direct wholesale pricing.")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      <span>{t("ebc_experience_2", "Optional physical material grade strength checking directly on your plot.")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      <span>{t("ebc_experience_3", "100% Secure Escrow Accounts: release cash milestones only post successful builds.")}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border-l-4 border-secondary text-xs font-bold italic">
                  Complete peace of mind. EBC coordinates loading, transport, and inspections.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic FAQ Accordion */}
        <section className="py-12 border-t border-border">
          <div className="container max-w-3xl mx-auto px-4 space-y-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <HelpCircle size={28} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight animate-in fade-in">
                {t("buyer_faq_title", "Frequently Asked Questions")}
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-border overflow-hidden shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left font-black text-sm md:text-base py-5 px-6 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-pointer"
                  >
                    <span className="pr-4 font-bold text-foreground">Q: {faq.q}</span>
                    {openFaq === i ? (
                      <Minus size={18} className="text-primary shrink-0" />
                    ) : (
                      <Plus size={18} className="text-muted-foreground/50 shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      openFaq === i
                        ? "grid-rows-[1fr] opacity-100 border-t border-border"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 py-5 text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed bg-accent/10">
                        <span className="font-black text-primary mr-2 uppercase text-[10px] tracking-wider">Answer:</span>
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner Card */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                  {t("buyer_final_title", "Build with Complete Verification")}
                </h2>
                <p className="text-base md:text-lg opacity-85 font-medium leading-relaxed italic">
                  &quot;Aapke sapno ka ghar, majboot neev maangta hai. EBC ke saath shuru karein.&quot;
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link
                    href="/auth/login?role=buyer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="xl"
                      className="bg-secondary hover:bg-secondary/95 text-secondary-foreground w-full h-16 px-12 text-base font-black rounded-xl gap-2 shadow-2xl shadow-black/20 group cursor-pointer"
                    >
                      {t("buyer_final_cta", "Start Building Securely")}
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
