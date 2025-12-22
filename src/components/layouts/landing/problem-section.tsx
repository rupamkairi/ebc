"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Tags, Handshake, AlertTriangle, FileQuestion } from "lucide-react";

export function ProblemSection() {
  const { t } = useLanguage();

  const problems = [
    {
      title: t("problem_1_title"),
      desc: t("problem_1_desc"),
      icon: <Tags className="size-8 text-orange-500" />,
      color: "bg-orange-50",
    },
    {
      title: t("problem_2_title"),
      desc: t("problem_2_desc"),
      icon: <Handshake className="size-8 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: t("problem_3_title"),
      desc: t("problem_3_desc"),
      icon: <AlertTriangle className="size-8 text-red-500" />,
      color: "bg-red-50",
    },
    {
      title: t("problem_4_title"),
      desc: t("problem_4_desc"),
      icon: <FileQuestion className="size-8 text-purple-500" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900">
          {t("problems_title")}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((problem, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center space-y-4">
                <div className={`${problem.color} p-4 rounded-2xl`}>
                  {problem.icon}
                </div>
                <h3 className="font-bold text-lg">{problem.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {problem.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="inline-block bg-white px-8 py-4 rounded-full shadow-sm border border-slate-100 italic text-slate-700 font-medium">
          &quot;{t("gamble_text")}&quot;
        </div>
      </div>
    </section>
  );
}
