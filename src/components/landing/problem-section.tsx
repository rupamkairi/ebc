"use client";

import Container from "@/components/containers/containers";
import { DisplayCard } from "@/components/shared/cards/display-cards";
import Break from "@/components/spacing/break";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { useLanguage } from "@/hooks/useLanguage";

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
      image: "/images/problems/vague-quotes.png",
      icon: "👷",
    },
    {
      title: t("problem_5_desc"),
      image: "/images/problems/family-help.jpg",
      icon: "👨‍👩‍👧‍👦",
    },
  ];

  return (
    <section className="py-responsive bg-white-background relative overflow-hidden">
      {/* Soft gradient background overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-50/30 to-transparent -z-10" />

      <Container size="lg">
        <div className="text-center">
          <TypographyH2>{t("problems_title")}</TypographyH2>
          <Break className="h-4 sm:h-6" />
        </div>

        {/* Main Grid for first 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {problems.slice(0, 4).map((problem, index) => (
            <DisplayCard
              key={index}
              title={problem.title}
              imageClassName="object-contain"
              image={problem.image}
              floatingIcon={problem.icon}
              aspectRatio="square"
              footerClassName="pt-8 pb-6 px-6"
            />
          ))}
        </div>
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-6 mb-6">
          <div className="col-span-3"></div>
          {problems.slice(4).map((problem, index) => (
            <DisplayCard
              className="col-span-2"
              key={index}
              title={problem.title}
              imageClassName="object-contain scale-115 group-hover:scale-120"
              image={problem.image}
              floatingIcon={problem.icon}
              aspectRatio="square"
              footerClassName="pt-8 pb-6 px-6 z-[5]"
            />
          ))}
          <div className="col-span-3"></div>
        </div>

        <Break />

        <div className="text-center">
          <TypographyH1 className="leading-tight">
            {t("gamble_text")}
          </TypographyH1>
        </div>
      </Container>
    </section>
  );
}
