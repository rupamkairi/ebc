"use client";

import Container from "@/components/containers/containers";
import Break from "@/components/ui/break";
import { TypographyH1 } from "@/components/ui/typography";
import { Play } from "lucide-react";
import Image from "next/image";

interface SolutionCardProps {
  title: string;
  icon: string;
  points: string[];
}

function SolutionCard({ title, icon, points }: SolutionCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-full group transition-all duration-300 hover:-translate-y-1">
      {/* Upper White Section */}
      <div className="p-4 flex items-center gap-4 bg-white border-b border-slate-100 min-h-[80px]">
        <div className="relative size-12 shrink-0">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <h3 className="text-[#445EB4] font-black text-xl tracking-tight leading-tight">
          {title}
        </h3>
      </div>
      
      {/* Bottom Blue Section */}
      <div className="bg-[#445EB4] p-5 grow flex flex-col justify-center">
        <ul className="space-y-3">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3 text-white">
              <Play className="size-3 fill-[#FFA500] text-[#FFA500] mt-1 shrink-0" />
              <span className="text-sm font-medium leading-snug">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SolutionSection() {
  const solutions = [
    {
      title: "Material Depot",
      icon: "/images/solutions/raw-material.svg",
      points: [
        "Centralized digital inventory hub",
        "Manufacturer-dealer-consumer bridge",
        "Assured availability with service linkage",
      ],
    },
    {
      title: "Technical Cabin",
      icon: "/images/solutions/technical-support.svg",
      points: [
        "Technical Support & Validation Hub",
        "Decision-Guidance for Users & Dealers",
        "Quality, Risk & Cost Control Layer of EBC",
      ],
    },
    {
      title: "Manpower Hub",
      icon: "/images/solutions/workers.svg",
      points: [
        "Centralized Workforce Marketplace",
        "On-Demand Hiring & Scheduling Engine",
        "Payments & Performance Control",
      ],
    },
    {
      title: "Fabricator Area",
      icon: "/images/solutions/forklift.svg",
      points: [
        "Central hub for fabrication",
        "Job-to-fabricator matching & execution",
        "Quality, pricing, and compliance control",
      ],
    },
    {
      title: "Hiring Terminal",
      icon: "/images/solutions/recruiter.svg",
      points: [
        "Digital hiring space",
        "Centralized appointment",
        "Trust and control layer",
      ],
    },
    {
      title: "Contract Desk",
      icon: "/images/solutions/contractor.svg",
      points: [
        "Centralized Negotiation & Finalization Hub",
        "End-to-End Contract Management",
        "Trust, Control & Risk Mitigation Layer",
      ],
    },
    {
      title: "Offers Zone",
      icon: "/images/solutions/best-price.svg",
      points: [
        "Dedicated virtual meeting room",
        "Multi-party coordination",
        "Central record-backed collaboration space",
      ],
    },
    {
      title: "Cost Calculator",
      icon: "/images/solutions/budget.svg",
      points: [
        "Construction Cost Estimation",
        "Intelligence for Budget Optimization",
        "Direct Action Enablement Inside Marketplace",
      ],
    },
    {
      title: "Service Support",
      icon: "/images/solutions/budget.svg",
      points: [
        "Mason, plumber, electrician, painter etc.",
        "Ratings & reviews",
      ],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden min-h-[900px]">
      {/* Background with Orange Tint */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/solutions/solution-backgrouond.jpg"
          alt="Solution Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Warm Orange/Yellow Overlay - Lighter for more fade */}
        <div className="absolute inset-0 bg-[#FFA500]/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white/60" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <TypographyH1 className="text-[#445EB4] font-black text-3xl md:text-5xl drop-shadow-sm">
            EBC&apos;s Solution
          </TypographyH1>
          <p className="text-[#445EB4] font-bold text-lg md:text-xl mt-4 opacity-80">
            It&apos;s a Local Marketplace. No Commission. No Hidden Charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {solutions.map((item, index) => (
            <SolutionCard
              key={index}
              title={item.title}
              icon={item.icon}
              points={item.points}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
