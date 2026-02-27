"use client";

import Container from "@/components/containers/containers";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface EcosystemCardProps {
  title: string;
  subtitle: string;
  benefits: string[];
  image: string;
  className?: string;
}

function EcosystemCard({ title, subtitle, benefits, image, className }: EcosystemCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 relative",
      className
    )}>
      {/* Top Illustration Placeholder */}
      <div className="mb-6 -mt-20 md:-mt-24 w-32 h-32 md:w-40 md:h-40 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 128px, 160px"
          unoptimized // Useful if assets are not yet present in build time
        />
      </div>
      
      <div className="space-y-1 mb-8">
        <h3 className="text-[#ec8305] font-black text-sm md:text-base tracking-tight uppercase">
          {title}
        </h3>
        <p className="text-[#2b429d] font-bold text-base md:text-lg leading-tight uppercase">
          — {subtitle}
        </p>
      </div>

      <ul className="space-y-3 text-left w-full mt-auto">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <div className="mt-0.5 shrink-0 bg-slate-100 rounded-full p-0.5 border border-slate-200">
               <Check className="size-3.5 text-slate-900 stroke-3" />
            </div>
            <span className="text-slate-700 text-[11px] md:text-xs font-bold leading-snug">
              {benefit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EcosystemSection() {
  const ecosystemData = [
    {
      title: "HOMEOWNER (End User)",
      subtitle: "Build Better, Save More",
      image: "/images/ecosystem/homeowner.png",
      benefits: [
        "Save Budget & Costs",
        "Access Verified Professionals",
        "Get Engineer Guidance & Quality Checks",
        "Avoid Confusion, Ensure Transparency",
      ],
    },
    {
      title: "RETAILER / DEALER (B2C Seller)",
      subtitle: "Expand Your Reach",
      image: "/images/ecosystem/retailer.png",
      benefits: [
        "Gain New Customers & Orders",
        "Zero Marketing Cost",
        "Fair Price Discovery Platform",
        "Increased Online Visibility",
      ],
    },
    {
      title: "WHOLESALER (B2B Seller)",
      subtitle: "Bulk Business Made Easy",
      image: "/images/ecosystem/wholesaler.png",
      benefits: [
        "Receive Bulk Leads & Inquiries",
        "Data-Driven Pricing Insights",
        "Connect with Multiple Dealers",
        "Streamlined Logistics Support",
      ],
    },
    {
      title: "MANUFACTURER (B2B Seller)",
      subtitle: "Strengthen Your Channel",
      image: "/images/ecosystem/manufacturer.png",
      benefits: [
        "Direct Channel Access & Visibility",
        "Push Technical Documents & Offers",
        "Transparent Market Strength Data",
        "Brand Promotion to End Users",
      ],
    },
    {
      title: "SERVICE PROVIDER (Professional)",
      subtitle: "Secure More Jobs",
      image: "/images/ecosystem/service-provider.png",
      benefits: [
        "Access Verified Job Requirements",
        "Better Income & Reliable Payments",
        "Build Reputation with Ratings & Reviews",
        "Quality Supervision & Standards",
      ],
    },
  ];

  return (
    <section className="bg-[#2b429d] py-32 relative overflow-hidden">
      {/* Optional: Subtle background pattern could go here */}
      
      <Container size="xl">
        <div className="text-center mb-32 space-y-4">
          <h2 className="text-white text-3xl md:text-5xl lg:text-5xl font-black tracking-tight drop-shadow-lg">
            Local <span className="text-[#ec8305]">Construction</span> Eco-System of India
          </h2>
          <p className="text-white/90 text-xl md:text-2xl font-bold tracking-wide uppercase">
            ECON Building Centre , Benefits for ALL
          </p>
        </div>

        {/* Row 1: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 mb-24">
          {ecosystemData.slice(0, 3).map((item, index) => (
            <EcosystemCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              benefits={item.benefits}
              image={item.image}
            />
          ))}
        </div>

        {/* Row 2: 2 cards centered */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-24">
          {ecosystemData.slice(3, 5).map((item, index) => (
            <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)]">
              <EcosystemCard
                title={item.title}
                subtitle={item.subtitle}
                benefits={item.benefits}
                image={item.image}
              />
            </div>
          ))}
        </div>

        <div className="mt-32 text-center max-w-4xl mx-auto">
          <p className="text-white text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
            Join EBC for a Smart & Stress-Free Home Building Journey
          </p>
        </div>
      </Container>
    </section>
  );
}
