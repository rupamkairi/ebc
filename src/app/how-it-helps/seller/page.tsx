"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  TrendingUp,
  Settings2,
  Cpu,
  BarChart3,
  ShieldCheck,
  Briefcase,
  Store,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UnifiedHeader } from "@/components/shared/unified-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerHowItHelps() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <UnifiedHeader />

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

        {/* Hero Section - Dashboard Style (Light Theme) */}
        <section className="relative py-20 overflow-hidden bg-white border-b border-border">
          <div className="absolute inset-0">
            <Image
              src="/images/seller_hero.png"
              alt="Scalable Construction"
              fill
              className="object-cover opacity-10"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/40 to-white/90" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-secondary/20 bg-secondary/10 px-6 py-2 text-sm font-black uppercase tracking-[0.3em] text-secondary">
              <Rocket className="size-4" />
              Empowering Growth
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto text-foreground">
              {t("seller_hero_title")}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/60 font-medium leading-relaxed max-w-3xl mx-auto">
              {t("seller_hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/auth/login?role=seller" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 w-full h-16 px-12 text-lg font-black rounded-xl gap-3 shadow-xl shadow-secondary/20 group"
                >
                  Join EBC&apos;s B2B Network
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Value Pillars Using Dashboard Cards */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border shadow-sm flex flex-col items-start p-6 space-y-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Maximize Profit.</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-bold text-foreground/70 leading-relaxed">
                    Pay-per-lead via Coin Wallet for high-intent enquiries.
                    Protect margins with negotiable quotations.
                  </p>
                  <ul className="space-y-2 text-xs font-bold text-foreground/40">
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 bg-primary rounded-full" />{" "}
                      Negotiable Quotations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 bg-primary rounded-full" /> Bulk
                      Order Leads
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="border-border shadow-sm flex flex-col items-start p-6 space-y-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Settings2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Scale Operations.</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-bold text-foreground/70 leading-relaxed">
                    Integrated logistics with LSPs & LTL carriers. Connect with
                    a wide network of dealers & wholesalers.
                  </p>
                  <ul className="space-y-2 text-xs font-bold text-foreground/40">
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 bg-primary rounded-full" />{" "}
                      Logistics Support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 bg-primary rounded-full" />{" "}
                      Dealer Network
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="border-border shadow-sm flex flex-col items-start p-6 space-y-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Future-Proof Tech.</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-bold text-foreground/70 leading-relaxed">
                    AI-powered Smart Matching. Integrated e-invoicing IRP
                    support. Actionable data analytics.
                  </p>
                  <ul className="space-y-2 text-xs font-bold text-foreground/40">
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 bg-primary rounded-full" /> AI
                      Matching
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 bg-primary rounded-full" />{" "}
                      Compliance Tools
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Retailer vs Professional Paths */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-foreground mb-4">
                {t("seller_path_retailer")} & {t("seller_path_professional")}{" "}
                Paths
              </h2>
              <p className="text-foreground/60 font-bold italic">
                Tailored toolsets for your growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 rounded-[2.5rem] bg-white border border-border shadow-lg flex flex-col items-center text-center space-y-6 group hover:border-primary/50 transition-colors">
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Store size={40} />
                </div>
                <h3 className="text-2xl font-black italic">
                  {t("seller_path_retailer")} & Dealer Dashboard
                </h3>
                <p className="text-foreground/60 font-medium">
                  Control sourcing costs, manage inventory visibility, and get
                  higher margins with direct inquiries.
                </p>
                <div className="h-0.5 w-12 bg-primary/20" />
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white border border-border shadow-lg flex flex-col items-center text-center space-y-6 group hover:border-secondary/50 transition-colors">
                <div className="size-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Briefcase size={40} />
                </div>
                <h3 className="text-2xl font-black italic">
                  Consultant & Specialist
                </h3>
                <p className="text-foreground/60 font-medium">
                  Monetize your expertise, get verified job requirements, and
                  manage workforce scheduling.
                </p>
                <div className="h-0.5 w-12 bg-secondary/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section (Light Theme) */}
        <section className="py-16 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white p-8 md:p-16 rounded-[3rem] border border-border shadow-sm">
              <div className="space-y-6 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-black leading-tight text-foreground">
                  Verified Compliance & Secure Operations
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500 size-5" />
                    <span className="font-bold text-foreground/70 italic">
                      Fraud Detection
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500 size-5" />
                    <span className="font-bold text-foreground/70 italic">
                      Secure Payouts
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 text-center bg-muted/30 p-10 rounded-3xl border border-border">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-primary">500+</div>
                  <div className="text-[10px] uppercase font-bold text-foreground/40">
                    Retailers
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-primary">2004</div>
                  <div className="text-[10px] uppercase font-bold text-foreground/40">
                    Est. Year
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA (Light Theme) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-indigo-500/20 to-secondary/20 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition" />
              <div className="relative bg-white rounded-[3rem] p-12 md:p-20 text-center border border-border overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <BarChart3 size={120} className="text-primary" />
                </div>
                <h2 className="text-3xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-foreground">
                  {t("seller_network_title")}
                </h2>
                <Link
                  href="/auth/login?role=seller"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 h-20 px-16 text-2xl font-black rounded-2xl shadow-2xl shadow-primary/20 group/btn"
                  >
                    JOIN EBC TODAY!
                    <ArrowRight className="size-6 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <p className="mt-8 text-foreground/40 text-xs font-black tracking-[0.4em] uppercase">
                  India&apos;s Premier Digital Construction Ecosystem
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-6 border-t border-border bg-white text-center text-sm text-foreground/50">
        <p>&copy; {new Date().getFullYear()} EBC. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
