"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { 
  Home, 
  CircleHelp, 
  Smartphone, 
  PieChart, 
  BarChart, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepsSection() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("step_1_title"),
      desc: t("step_1_desc"),
      icon: (
        <div className="relative size-24 flex items-center justify-center">
          <Home className="size-16 text-slate-800" strokeWidth={1} fill="#fff7ed" />
          <div className="absolute top-0 right-0 bg-amber-400 rounded-full border-2 border-white p-1">
            <CircleHelp className="size-6 text-slate-900" />
          </div>
        </div>
      ),
    },
    {
      title: t("step_2_title"),
      desc: t("step_2_desc"),
      icon: (
        <div className="relative size-24 flex items-center justify-center">
          <Smartphone className="size-16 text-slate-800" strokeWidth={1} fill="#f8fafc" />
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            <PieChart className="size-5 text-amber-500 fill-amber-500/20" />
            <BarChart className="size-5 text-green-600 fill-green-600/20" />
          </div>
        </div>
      ),
    },
    {
      title: t("step_3_title"),
      desc: t("step_3_desc"),
      icon: (
        <div className="relative size-24 flex items-center justify-center">
          <ShieldCheck className="size-20 text-[#024caa] fill-[#024caa]/10" strokeWidth={1.2} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-green-500">
            <ShieldCheck className="size-10 fill-green-500/20" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20 space-y-2">
          <p className="text-base font-bold text-slate-900 tracking-wider uppercase">
            How it works —
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            3 Simple Steps
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-1 flex-col items-center text-center group">
              <div className="relative flex items-center justify-center w-full mb-8">
                <div className="p-4 transition-transform duration-500 group-hover:scale-110">
                  {step.icon}
                </div>
                
                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2">
                    <ArrowRight className="size-8 text-slate-300" strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-900 flex items-center justify-center gap-3">
                  <span className="bg-[#024caa]/80 text-white rounded-md size-6 flex items-center justify-center text-sm shrink-0">
                    {index + 1}
                  </span>
                  {step.title}
                </h3>
                <p className="text-slate-700 font-bold text-base leading-snug max-w-[240px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button size="lg" className="bg-[#024caa] hover:bg-[#023b8a] h-14 px-10 text-lg font-bold rounded-xl gap-3 shadow-xl shadow-blue-900/10 transition-all active:scale-95 group">
            {t("home_journey_cta")}
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
