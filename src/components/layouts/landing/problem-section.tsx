"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tags, 
  Users,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import Image from "next/image";

export function ProblemSection() {
  const { t } = useLanguage();

  const problems = [
    {
      title: t("problem_1_desc"),
      icon: <TrendingDown className="size-5 text-orange-600" />,
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800",
      iconBg: "bg-white",
    },
    {
      title: t("problem_2_desc"),
      icon: <TrendingDown className="size-5 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800",
      iconBg: "bg-white",
    },
    {
      title: t("problem_3_desc"),
      icon: <Tags className="size-5 text-red-600" />, // 'Hidded' tag style in image
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800",
      iconBg: "bg-white",
    },
    {
      title: t("problem_4_desc"),
      icon: <HelpCircle className="size-5 text-amber-600" />,
      image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800",
      iconBg: "bg-white",
    },
    {
      title: t("problem_5_desc"),
      icon: <Users className="size-5 text-primary" />,
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
      iconBg: "bg-white",
    },
  ];

  return (
    <section className="py-24 bg-background overflow-hidden font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">
            {t("problems_title")}
          </h2>
          <div className="h-1.5 w-32 bg-secondary mx-auto rounded-full" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 mb-20">
          {problems.map((problem, index) => (
            <Card key={index} className="w-full sm:w-[280px] border-none shadow-xl rounded-4xl bg-white group hover:scale-[1.02] transition-all duration-500">
              {/* Image Container - Removed overflow-hidden to allow icon to float out */}
              <div className="relative h-48 w-full">
                <div className="relative h-full w-full overflow-hidden rounded-t-4xl">
                  <Image 
                    src={problem.image} 
                    alt="problem image" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>
                
                {/* Floating Icon Circle - Positioned absolutely relative to the image container */}
                <div className="absolute -bottom-6 left-8 z-20 size-14 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-white transition-transform duration-300 group-hover:scale-110">
                  <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center">
                    {problem.icon}
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-12 pb-10 px-8">
                <p className="text-lg font-black text-foreground/80 leading-snug">
                  {problem.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <div className="text-2xl md:text-4xl font-black text-foreground tracking-tight py-4 px-10 bg-white border border-border shadow-sm rounded-3xl md:rounded-full">
              {t("gamble_text")}
            </div>
            <div className="h-4 w-4 bg-white border-b border-r border-border rotate-45 -mt-2 shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
