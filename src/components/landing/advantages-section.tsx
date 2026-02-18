"use client";

import Container from "@/components/containers/containers";
import { Check, PiggyBank, Monitor, HardHat, ShieldCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

interface AdvantageCardProps {
  title: string;
  description: string;
  detail: string;
  image: string;
  icon: React.ReactNode;
}

function AdvantageCard({ title, description, detail, image, icon }: AdvantageCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-xl border border-white/5 flex flex-col h-full group transition-all duration-300 hover:-translate-y-2">
      {/* Photo Area - More compact aspect ratio */}
      <div className="relative aspect-square w-full bg-slate-800">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Info Box - Tightened padding and text */}
      <div className="bg-white p-4 flex flex-col grow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded-md bg-orange-50 text-[#ec8305]">
            {icon}
          </div>
          <h3 className="text-[#ec8305] font-black text-base md:text-lg tracking-tight leading-tight">
            {title}
          </h3>
        </div>

        <p className="text-slate-400 text-[10px] font-bold leading-tight mb-3 uppercase tracking-wide">
          {description}
        </p>

        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-start gap-2">
          <div className="shrink-0 mt-0.5">
            <Check className="size-3.5 text-green-500 stroke-3" />
          </div>
          <span className="text-slate-600 text-[9px] md:text-[11px] font-bold leading-snug">
            {detail}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AdvantagesSection() {
  const advantages = [
    {
      title: "Save money",
      description: "Avoid wrong purchases",
      detail: "Save ₹50,000-₹3,00,000 by avoiding wrong purchases",
      image: "/images/advantages/home-finance.png",
      icon: <PiggyBank className="size-5" />,
    },
    {
      title: "Everything Online",
      description: "From quotes to hiring",
      detail: "Everything from online from quotations to hiring",
      image: "/images/advantages/online-dashboard.png",
      icon: <Monitor className="size-5" />,
    },
    {
      title: "Engineer Help",
      description: "Seamless constructions",
      detail: "Enjoy seamless constructions without errors",
      image: "/images/advantages/engineer-site.png",
      icon: <HardHat className="size-5" />,
    },
    {
      title: "Trusted Hirement",
      description: "Rated and reviewed",
      detail: "Rated and reviewed manpower, no random hiring",
      image: "/images/advantages/worker-handshake.png",
      icon: <ShieldCheck className="size-5" />,
    },
  ];

  return (
    <section className="relative py-24 bg-[#111111] overflow-hidden min-h-[800px] flex items-center">
      {/* Background Texture Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/advantages/advantages-bg.png"
          alt="Dark Texture Background"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg">
            Top <span className="text-[#ec8305]">Advantages</span> of EBC
          </h2>
        </div>

        {/* Compact 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
          {advantages.map((item, index) => (
            <AdvantageCard
              key={index}
              title={item.title}
              description={item.description}
              detail={item.detail}
              image={item.image}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-20 text-center">
          <p className="text-white text-lg md:text-2xl font-black tracking-tight">
            A better home. <span className="text-white/60">A better decision.</span> A better sleep at night.
          </p>
        </div>
        
        {/* Concrete Pipes Placeholder Visual (Bottom Right) */}
        <div className="hidden lg:block absolute -bottom-12 -right-12 w-[450px] h-[300px] z-[-1] pointer-events-none">
          <Image
            src="/images/advantages/advantages-pipes.png"
            alt="Pipes Illustration"
            fill
            className="object-contain opacity-40"
            sizes="450px"
          />
        </div>
      </Container>
    </section>
  );
}
