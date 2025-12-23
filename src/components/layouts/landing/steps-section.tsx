"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { ClipboardList, Search, Home } from "lucide-react";

export function StepsSection() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("step_1_title"),
      desc: t("step_1_desc"),
      icon: <ClipboardList className="size-10 text-white" />,
    },
    {
      title: t("step_2_title"),
      desc: t("step_2_desc"),
      icon: <Search className="size-10 text-white" />,
    },
    {
      title: t("step_3_title"),
      desc: t("step_3_desc"),
      icon: <Home className="size-10 text-white" />,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            {t("how_it_works_title")}
          </h2>
          <div className="h-1.5 w-24 bg-secondary mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-16 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[60px] left-0 w-full h-[3px] bg-primary/10 z-0" />
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-8 relative z-10 basis-1/3 group">
              <div className="bg-primary p-10 rounded-full shadow-2xl shadow-primary/30 ring-12 ring-white group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <div className="space-y-4">
                <div className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Step 0{index + 1}</div>
                <h3 className="text-2xl font-black text-foreground">{step.title}</h3>
                <p className="text-foreground/60 max-w-[280px] font-bold text-base leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
