"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/containers";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypographyH1 } from "@/components/ui/typography";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";
import { CheckCircle2, MapPin, Play } from "lucide-react";
import Image from "next/image";

interface ModalPoint {
  title: string;
  description: string;
}

interface SolutionCardProps {
  title: string;
  icon: string;
  points: string[];
  modalHeading: string;
  modalPoints: ModalPoint[];
}

function SolutionCard({
  title,
  icon,
  points,
  modalHeading,
  modalPoints,
}: SolutionCardProps) {
  const { t } = useLanguage();
  const mounted = useMounted();

  const triggerButton = (
    <button className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-full group transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer w-full border-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
      {/* Upper White Section */}
      <div className="p-4 flex items-center gap-4 bg-white border-b border-slate-100 min-h-[80px] w-full">
        <div className="relative size-12 shrink-0 p-1 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-contain p-1"
            sizes="48px"
            unoptimized
          />
        </div>
        <h3 className="text-primary font-black text-xl tracking-tight leading-tight">
          {title}
        </h3>
      </div>

      {/* Bottom Blue Section */}
      <div className="bg-primary p-5 grow flex flex-col justify-center w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <Play className="size-16 fill-white text-white" />
        </div>
        <ul className="space-y-3 relative z-10">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3 text-white">
              <Play className="size-3 fill-secondary text-secondary mt-1 shrink-0" />
              <span className="text-sm font-medium leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );

  if (!mounted) {
    return triggerButton;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>

      <DialogContent className="max-w-2xl p-0 border-none bg-white rounded-2xl shadow-2xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} Details</DialogTitle>
        </DialogHeader>

        {/* Flex column wrapper with explicit max height — reliable on mobile */}
        <div className="flex flex-col" style={{ maxHeight: "85dvh" }}>
          {/* Scrollable body */}
          <div className="overflow-y-auto min-h-0 flex-1">
            <div className="p-6 md:p-10 space-y-8">
              {/* Modal header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Image
                      src={icon}
                      alt={title}
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-bold   text-primary/60">
                    {t("solution_detail_label")}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                  {modalHeading}
                </h2>
              </div>

              {/* Points list */}
              <div className="space-y-0">
                {modalPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex gap-4 group/point items-start"
                  >
                    <div className="flex flex-col items-center">
                      <div className="size-9 rounded-full bg-[#E31E24]/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/point:bg-[#E31E24] group-hover/point:text-white border border-[#E31E24]/20 text-[#E31E24] mt-1">
                        <MapPin className="size-4" />
                      </div>
                      {index !== modalPoints.length - 1 && (
                        <div className="w-px grow bg-slate-200 my-2" />
                      )}
                    </div>
                    <div className="space-y-1 pb-6 pt-1">
                      <h4 className="font-black text-slate-800 text-base md:text-lg group-hover/point:text-[#E31E24] transition-colors leading-snug">
                        {point.title}
                      </h4>
                      <p className="text-slate-500 leading-relaxed text-sm md:text-[15px]">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky footer — always visible */}
          <div className="p-4 border-t border-slate-100 bg-white flex justify-center shrink-0">
            <DialogClose asChild>
              <Button className="cursor-pointer bg-secondary hover:bg-secondary/90 text-white font-black px-10 h-12 text-base rounded-xl transition-all duration-200 shadow-md active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2">
                <CheckCircle2 className="size-5" />
                {t("solution_got_it")}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SolutionSection() {
  const { t } = useLanguage();

  const solutions = [
    {
      title: t("solution_item_1_title"),
      icon: "/images/solutions/raw-material.svg",
      points: [
        t("solution_item_1_p1"),
        t("solution_item_1_p2"),
        t("solution_item_1_p3"),
      ],
      modalHeading: t("solution_item_1_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_1_modal_p1_title"),
          description: t("solution_item_1_modal_p1_desc"),
        },
        {
          title: t("solution_item_1_modal_p2_title"),
          description: t("solution_item_1_modal_p2_desc"),
        },
        {
          title: t("solution_item_1_modal_p3_title"),
          description: t("solution_item_1_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_2_title"),
      icon: "/images/solutions/technical-support.svg",
      points: [
        t("solution_item_2_p1"),
        t("solution_item_2_p2"),
        t("solution_item_2_p3"),
      ],
      modalHeading: t("solution_item_2_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_2_modal_p1_title"),
          description: t("solution_item_2_modal_p1_desc"),
        },
        {
          title: t("solution_item_2_modal_p2_title"),
          description: t("solution_item_2_modal_p2_desc"),
        },
        {
          title: t("solution_item_2_modal_p3_title"),
          description: t("solution_item_2_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_3_title"),
      icon: "/images/solutions/workers.svg",
      points: [
        t("solution_item_3_p1"),
        t("solution_item_3_p2"),
        t("solution_item_3_p3"),
      ],
      modalHeading: t("solution_item_3_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_3_modal_p1_title"),
          description: t("solution_item_3_modal_p1_desc"),
        },
        {
          title: t("solution_item_3_modal_p2_title"),
          description: t("solution_item_3_modal_p2_desc"),
        },
        {
          title: t("solution_item_3_modal_p3_title"),
          description: t("solution_item_3_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_4_title"),
      icon: "/images/solutions/forklift.svg",
      points: [
        t("solution_item_4_p1"),
        t("solution_item_4_p2"),
        t("solution_item_4_p3"),
      ],
      modalHeading: t("solution_item_4_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_4_modal_p1_title"),
          description: t("solution_item_4_modal_p1_desc"),
        },
        {
          title: t("solution_item_4_modal_p2_title"),
          description: t("solution_item_4_modal_p2_desc"),
        },
        {
          title: t("solution_item_4_modal_p3_title"),
          description: t("solution_item_4_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_5_title"),
      icon: "/images/solutions/recruiter.svg",
      points: [
        t("solution_item_5_p1"),
        t("solution_item_5_p2"),
        t("solution_item_5_p3"),
      ],
      modalHeading: t("solution_item_5_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_5_modal_p1_title"),
          description: t("solution_item_5_modal_p1_desc"),
        },
        {
          title: t("solution_item_5_modal_p2_title"),
          description: t("solution_item_5_modal_p2_desc"),
        },
        {
          title: t("solution_item_5_modal_p3_title"),
          description: t("solution_item_5_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_6_title"),
      icon: "/images/solutions/contractor.svg",
      points: [
        t("solution_item_6_p1"),
        t("solution_item_6_p2"),
        t("solution_item_6_p3"),
      ],
      modalHeading: t("solution_item_6_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_6_modal_p1_title"),
          description: t("solution_item_6_modal_p1_desc"),
        },
        {
          title: t("solution_item_6_modal_p2_title"),
          description: t("solution_item_6_modal_p2_desc"),
        },
        {
          title: t("solution_item_6_modal_p3_title"),
          description: t("solution_item_6_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_7_title"),
      icon: "/images/solutions/best-price.svg",
      points: [
        t("solution_item_7_p1"),
        t("solution_item_7_p2"),
        t("solution_item_7_p3"),
      ],
      modalHeading: t("solution_item_7_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_7_modal_p1_title"),
          description: t("solution_item_7_modal_p1_desc"),
        },
        {
          title: t("solution_item_7_modal_p2_title"),
          description: t("solution_item_7_modal_p2_desc"),
        },
        {
          title: t("solution_item_7_modal_p3_title"),
          description: t("solution_item_7_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_8_title"),
      icon: "/images/solutions/budget.svg",
      points: [
        t("solution_item_8_p1"),
        t("solution_item_8_p2"),
        t("solution_item_8_p3"),
      ],
      modalHeading: t("solution_item_8_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_8_modal_p1_title"),
          description: t("solution_item_8_modal_p1_desc"),
        },
        {
          title: t("solution_item_8_modal_p2_title"),
          description: t("solution_item_8_modal_p2_desc"),
        },
        {
          title: t("solution_item_8_modal_p3_title"),
          description: t("solution_item_8_modal_p3_desc"),
        },
      ],
    },
    {
      title: t("solution_item_9_title"),
      icon: "/images/solutions/technical-support.svg",
      points: [
        t("solution_item_9_p1"),
        t("solution_item_9_p2"),
        t("solution_item_9_p3"),
      ],
      modalHeading: t("solution_item_9_modal_heading"),
      modalPoints: [
        {
          title: t("solution_item_9_modal_p1_title"),
          description: t("solution_item_9_modal_p1_desc"),
        },
        {
          title: t("solution_item_9_modal_p2_title"),
          description: t("solution_item_9_modal_p2_desc"),
        },
        {
          title: t("solution_item_9_modal_p3_title"),
          description: t("solution_item_9_modal_p3_desc"),
        },
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
          sizes="100vw"
          priority
        />
        {/* Warm Orange/Yellow Overlay - Lighter for more fade */}
        <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white/60" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <TypographyH1 className="text-primary font-black text-3xl md:text-5xl drop-shadow-sm">
            {t("solution_section_title").split("'s")[0]}&apos;s{" "}
            <span className="text-secondary">Solution</span>
          </TypographyH1>
          <p className="text-primary font-bold text-lg md:text-xl mt-4 opacity-80">
            {t("solution_section_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {solutions.map((item, index) => (
            <SolutionCard
              key={index}
              title={item.title}
              icon={item.icon}
              points={item.points}
              modalHeading={item.modalHeading}
              modalPoints={item.modalPoints}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
