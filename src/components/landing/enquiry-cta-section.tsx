"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, Users, Zap } from "lucide-react";
import Link from "next/link";

export function EnquiryCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 shadow-sm relative overflow-hidden">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
          />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest leading-none">
                <ClipboardCheck size={14} />
                Market Transparency
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                  {t("enquiry_section_title")}
                </h2>
                <p className="text-xl text-foreground/60 font-medium leading-relaxed">
                  {t("enquiry_section_subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <span className="text-sm font-bold text-foreground/70">{t("enquiry_benefit_1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                    <Users size={20} />
                  </div>
                  <span className="text-sm font-bold text-foreground/70">{t("enquiry_benefit_2")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                    <ClipboardCheck size={20} />
                  </div>
                  <span className="text-sm font-bold text-foreground/70">{t("enquiry_benefit_3")}</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center gap-4">
              <Link href="/enquiry" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-20 px-12 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 group">
                  {t("enquiry_section_cta")}
                  <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em]">
                Takes less than 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
