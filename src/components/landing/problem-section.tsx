"use client";

import Container from "@/components/containers/containers";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { Wallet, PersonStanding, TriangleAlert, ShieldCheck, Clock, FileText, IndianRupee, ClipboardList } from "lucide-react";

interface ProblemCardProps {
  title: string;
  image: string;
  icon: React.ReactNode;
}

function ProblemCard({ title, image, icon }: ProblemCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl border-2 border-transparent hover:border-[#FFA500]/50 flex flex-col h-full group transition-all duration-300">
      {/* Top Image Area */}
      <div className="relative aspect-square w-full p-4 bg-white flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        </div>
      </div>
      
      {/* Bottom Yellow Info Area */}
      <div className="bg-[#FFA500] p-4 pt-6 flex flex-col grow relative">
        {/* Floating Icon Circle */}
        <div className="absolute -top-4 left-4 size-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#445EB4] border border-[#FFA500] z-10 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        
        <p className="text-[#445EB4] font-black text-sm sm:text-base leading-tight">
          {title}
        </p>
      </div>
    </div>
  );
}

export function ProblemSection() {
  const { t } = useLanguage();

  const problems = [
    { key: "problem_1_desc", icon: <Wallet className="size-4" />, image: "/images/problems/price-variation.svg" },
    { key: "problem_2_desc", icon: <PersonStanding className="size-4" />, image: "/images/problems/commission-bias.svg" },
    { key: "problem_3_desc", icon: <TriangleAlert className="size-4" />, image: "/images/problems/quality-issues.svg" },
    { key: "problem_4_desc", icon: <ShieldCheck className="size-4" />, image: "/images/problems/unverified-workers.svg" },
    { key: "problem_5_desc", icon: <Clock className="size-4" />, image: "/images/problems/helplessness.svg" },
    { key: "problem_6_desc", icon: <FileText className="size-4" />, image: "/images/problems/vague-quotes.svg" },
    { key: "problem_7_desc", icon: <IndianRupee className="size-4" />, image: "/images/problems/cost-idea.svg" },
    { key: "problem_8_desc", icon: <ClipboardList className="size-4" />, image: "/images/problems/lack-of-planning.svg" },
  ];

  return (
    <section className="relative py-24 overflow-hidden min-h-[900px] flex items-center">
      {/* Background Image with Blue Multiplied Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/problem-section.jpg"
          alt="Backdrop"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Blue Overlay with Multiplay effect to match screenshot depth */}
        <div className="absolute inset-0 bg-[#445EB4]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#445EB4]/20 via-transparent to-[#445EB4]/20" />
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-white text-2xl md:text-3xl lg:text-5xl font-black tracking-tight drop-shadow-lg">
            {t("problems_title")}
          </h2>
        </div>

        {/* 4x2 Grid of Problem Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <ProblemCard
              key={index}
              title={t(problem.key)}
              icon={problem.icon}
              image={problem.image}
            />
          ))}
        </div>

        {/* Bottom Tagline */}
        <div className="mt-20 text-center">
          <p className="text-white text-xl md:text-2xl lg:text-4xl font-bold tracking-tight drop-shadow-md">
            {t("gamble_text")}
          </p>
        </div>
      </Container>
    </section>
  );
}
