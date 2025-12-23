"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Coins, Wrench, HardHat, ArrowRight, CheckCircle2, Handshake, UserRound, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      title: "Fair Material Prices",
      id: "①",
      icon: (
        <div className="relative size-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Coins className="size-16 text-amber-500" strokeWidth={1.5} />
          </div>
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
            <CheckCircle2 className="size-5 text-white" />
          </div>
        </div>
      ),
      bullets: ["Multiple quotations", "Verified dealers", "Price transparency"],
    },
    {
      title: "Trusted Service Providers",
      id: "②",
      icon: (
        <div className="relative size-24 flex items-center justify-center">
          <Wrench className="size-12 absolute -top-1 left-1/2 -translate-x-1/2 -rotate-45 text-slate-700" strokeWidth={1.5} />
          <Handshake className="size-16 text-orange-600 mt-4" strokeWidth={1.5} />
        </div>
      ),
      bullets: ["Mason, plumber,", "electrician, painter etc.", "Ratings & reviews"],
    },
    {
      title: "Engineer Support (Optional)",
      id: "③",
      icon: (
        <div className="relative size-24 flex items-center justify-center">
          <UserRound className="size-16 text-primary" strokeWidth={1.5} />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500 rounded-lg p-1 border-2 border-white rotate-12">
            <HardHat className="size-5 text-white" />
          </div>
          <div className="absolute bottom-4 -right-2 bg-blue-500 rounded-md p-1 border-2 border-white -rotate-6">
            <FileText className="size-5 text-white" />
          </div>
        </div>
      ),
      bullets: ["BOQ & quantity check", "Site quality visits", "Construction stage guidance"],
    },
  ];

  return (
    <section className="py-24 bg-[#f0f7ff]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 uppercase">
            {t("what_is_ebc")}
          </h2>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-bold">
            {t("ebc_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="mb-6 flex items-center justify-center h-24">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center justify-center gap-2">
                  <span className="text-2xl">{feature.id}</span>
                  {feature.title}
                </h3>
                
                <ul className="space-y-3 text-left w-full max-w-[220px] mx-auto">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-base font-bold text-slate-800">
                      <span className="mt-2.5 size-1.5 bg-slate-900 rounded-full shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="rounded-xl px-10 h-14 bg-[#0a569d] hover:bg-[#084882] gap-2 font-bold text-lg shadow-xl shadow-blue-900/10">
            How EBC Helps You
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
