"use client";

import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";

export function ProblemSection() {
  const { t } = useLanguage();

  const problems = [
    {
      title: t("problem_1_desc"),
      image: "/images/problems/price-confusion.png",
      icon: "🤔",
    },
    {
      title: t("problem_2_desc"),
      image: "/images/problems/commission-run.png",
      icon: "🏃",
    },
    {
      title: t("problem_3_desc"),
      image: "/images/problems/quality-warning.png",
      icon: "⚠️",
    },
    {
      title: t("problem_4_desc"),
      image: "/images/problems/vague-quotes.jpg",
      icon: "👷",
    },
    {
      title: t("problem_5_desc"),
      image: "/images/problems/family-help.jpg",
      icon: "👨‍👩‍👧‍👦",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white/50">
      {/* Soft gradient background */}
      <div className="inset-0 bg-linear-to-tr from-[#f0f9ff] via-white to-[#fff7ed] -z-10" />

      <h2 className="text-3xl md:text-4xl font-black text-center text-slate-900 mb-16 tracking-tight">
        {t("problems_title")}
      </h2>

      {/* Main Grid for first 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
        {problems.slice(0, 4).map((problem, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
          >
            <div className="relative h-48 w-full">
              <Image
                src={problem.image}
                alt="problem"
                fill
                className="object-contain p-6"
              />
              {/* Floating Icon */}
              <div className="absolute -bottom-5 left-5 size-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-slate-50 text-xl">
                {problem.icon}
              </div>
            </div>
            <div className="pt-8 pb-8 px-6 text-center">
              <p className="text-base font-bold text-slate-800 leading-tight">
                {problem.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Centered 5th card */}
      <div className="flex justify-center mb-16">
        <div className="w-full sm:w-[320px] lg:w-[350px] flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
          <div className="relative h-48 w-full">
            <Image
              src={problems[4].image}
              alt="problem"
              fill
              className="object-cover"
            />
            {/* Floating Icon */}
            <div className="absolute -bottom-5 left-5 size-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-slate-50 text-xl">
              {problems[4].icon}
            </div>
          </div>
          <div className="pt-8 pb-8 px-6 text-center">
            <p className="text-base font-bold text-slate-800 leading-tight">
              {problems[4].title}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-20">
        <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {t("gamble_text")}
        </p>
      </div>
    </section>
  );
}
