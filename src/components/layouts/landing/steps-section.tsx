"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { ClipboardList, Search, Home, ArrowRight } from "lucide-react";

export function StepsSection() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("step_1_title"),
      desc: t("step_1_desc"),
      icon: <ClipboardList className="size-8 text-white" />,
    },
    {
      title: t("step_2_title"),
      desc: t("step_2_desc"),
      icon: <Search className="size-8 text-white" />,
    },
    {
      title: t("step_3_title"),
      desc: t("step_3_desc"),
      icon: <Home className="size-8 text-white" />,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">
          {t("how_it_works_title")}
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 z-0" />
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-6 relative z-10 basis-1/3">
              <div className="bg-primary p-6 rounded-full shadow-lg ring-8 ring-white">
                {step.icon}
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Step {index + 1}</div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 max-w-[280px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
