"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
              <CheckCircle2 className="size-4" />
              {t("serving_families")}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Build Your <span className="text-primary italic">Dream Home</span> <br className="hidden md:block" />
              With Confidence.
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 max-w-[540px] leading-relaxed font-medium">
              {t("home_subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 h-16 px-10 text-lg font-black rounded-2xl gap-3 shadow-xl shadow-secondary/20 group">
                {t("home_cta_primary")}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-2 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all">
                {t("home_cta_secondary")}
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="size-10 rounded-full border-2 border-background bg-slate-200 overflow-hidden">
                      <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-orange-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-current" />)}
                  </div>
                  <span className="text-xs font-bold text-foreground/60">500+ Happy Families</span>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2 text-primary font-bold">
                <ShieldCheck size={28} />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Verified</span>
                  <span className="text-sm">ISO Certified</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] rotate-3 -z-10" />
            <div className="absolute -inset-4 bg-secondary/10 rounded-[3rem] -rotate-3 -z-10" />
            <div className="relative h-[500px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white">
              <Image
                src="/ebc-hero.png"
                alt="Family with Architect"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-white/20">
                <p className="text-primary font-black italic text-lg leading-tight">
                  &quot;Saving families from the stress of building a home since 2004.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
