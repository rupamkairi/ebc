"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Briefcase, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layouts/landing/navbar";
import { Footer } from "@/components/layouts/landing/footer";

export default function HowItHelpsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
          <div className="space-y-4 animate-in fade-in slide-in-from-top duration-700">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-4"
            >
              <ChevronLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              {t("how_ebc_helps_title")}
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium">
              {t("how_ebc_helps_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Buyer Path */}
            <div className="group relative animate-in fade-in slide-in-from-left duration-700 delay-200">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex flex-col items-center text-center h-full bg-white border border-border rounded-[2.5rem] p-10 md:p-14 shadow-xl group-hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                <div className="relative z-20 size-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-300">
                  <Home size={48} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4">
                  {t("i_am_buyer_title")}
                </h3>
                <p className="text-lg text-foreground/60 font-bold mb-10 leading-relaxed flex-1">
                  {t("i_am_buyer_desc")}
                </p>
                <Link href="/how-it-helps/buyer" className="w-full">
                  <Button size="lg" className="h-16 w-full bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 gap-3 group/btn">
                    {t("get_started_buyer")}
                    <ArrowRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Seller Path */}
            <div className="group relative animate-in fade-in slide-in-from-right duration-700 delay-400">
              <div className="absolute -inset-1 bg-linear-to-r from-secondary to-orange-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex flex-col items-center text-center h-full bg-white border border-border rounded-[2.5rem] p-10 md:p-14 shadow-xl group-hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                <div className="relative z-20 size-24 rounded-3xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:bg-secondary transition-all duration-300">
                  <Briefcase size={48} className="text-secondary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4">
                  {t("i_am_seller_title")}
                </h3>
                <p className="text-lg text-foreground/60 font-bold mb-10 leading-relaxed flex-1">
                  {t("i_am_seller_desc")}
                </p>
                <Link href="/how-it-helps/seller" className="w-full">
                  <Button size="lg" className="h-16 w-full bg-secondary hover:bg-secondary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-secondary/20 gap-3 group/btn">
                    {t("get_started_seller")}
                    <ArrowRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
