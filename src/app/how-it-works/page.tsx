"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Home,
  Briefcase,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
          {/* Back Button & Header */}
          <div className="space-y-4 animate-in fade-in slide-in-from-top duration-700">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-4"
            >
              <ChevronLeft size={16} />
              Return to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              {t("how_ebc_helps_title")}
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium">
              {t("how_ebc_helps_subtitle")}
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Buyer Path */}
            <div className="group relative animate-in fade-in slide-in-from-left duration-700 delay-200">
              <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-blue-600/20 rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex flex-col h-full bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-xl group-hover:scale-[1.02] transition-all duration-500">
                {/* Card Header Style - Like DashboardCard */}
                <div className="bg-primary p-6 flex items-center gap-4 text-white">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Home size={24} />
                  </div>
                  <h3 className="text-2xl font-black">
                    {t("i_am_buyer_title")}
                  </h3>
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1 space-y-8">
                  <p className="text-lg text-foreground/60 font-medium leading-relaxed flex-1">
                    {t("i_am_buyer_desc")}
                  </p>

                  {/* Feature Lists */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                      <ShieldCheck className="text-emerald-500 size-5" />
                      Verified Material Prices
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                      <Sparkles className="text-amber-500 size-5" />
                      Expert Engineer Guidance
                    </div>
                  </div>

                  <Link href="/how-it-helps/buyer" className="w-full">
                    <Button
                      size="lg"
                      className="h-16 w-full bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 gap-3 group/btn"
                    >
                      {t("get_started_buyer")}
                      <ArrowRight className="size-6 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Seller Path */}
            <div className="group relative animate-in fade-in slide-in-from-right duration-700 delay-400">
              <div className="absolute -inset-2 bg-linear-to-r from-secondary/20 to-orange-500/20 rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex flex-col h-full bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-xl group-hover:scale-[1.02] transition-all duration-500">
                {/* Card Header Style - Like DashboardCard */}
                <div className="bg-secondary p-6 flex items-center gap-4 text-white">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-2xl font-black">
                    {t("i_am_seller_title")}
                  </h3>
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1 space-y-8">
                  <p className="text-lg text-foreground/60 font-medium leading-relaxed flex-1">
                    {t("i_am_seller_desc")}
                  </p>

                  {/* Feature Lists */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                      <TrendingUp className="text-indigo-500 size-5" />
                      Access High-Intent Leads
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                      <Sparkles className="text-secondary size-5" />
                      Scale Your B2B Operations
                    </div>
                  </div>

                  <Link href="/how-it-helps/seller" className="w-full">
                    <Button
                      size="lg"
                      className="h-16 w-full bg-secondary hover:bg-secondary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-secondary/20 gap-3 group/btn"
                    >
                      {t("get_started_seller")}
                      <ArrowRight className="size-6 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 text-foreground/40 text-sm font-bold uppercase tracking-widest animate-in fade-in duration-1000 delay-700">
            EBC Aapke Sath, Har Kadam Par.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
