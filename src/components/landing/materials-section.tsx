"use client";

import Container from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MaterialCardProps {
  title: string;
  category: string;
  image: string;
  href?: string;
}

function MaterialCard({ title, category, image, href }: MaterialCardProps) {
  const content = (
    <>
      <div className="bg-white rounded-lg p-1.5 aspect-4/3 flex items-center justify-center relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="py-2 px-2 text-center">
        <h3 className="text-white font-black text-[13px] md:text-sm leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-white/80 text-[10px] font-bold leading-tight mt-0.5 lowercase">
          {category}
        </p>
      </div>
    </>
  );

  const className =
    "bg-secondary p-1 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 block";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

import { useLanguage } from "@/hooks/useLanguage";

export function MaterialsSection() {
  const { t } = useLanguage();

  const materials = [
    {
      title: t("mat_brick_title"),
      image: "/images/materials/bricks.png",
      href: "/browse?q=Brick",
    },
    {
      title: t("mat_sand_title"),
      image: "/images/materials/river_sand.png",
      href: "/browse?q=Sand",
    },
    {
      title: t("mat_stone_title"),
      image: "/images/materials/store_chips.png",
      href: "/browse?type=PRODUCT&q=Stone+chips&page=1",
    },
    {
      title: t("mat_cement_title"),
      image: "/images/materials/cement.png",
      href: "/browse?q=cement",
    },
    {
      title: t("mat_tmt_title"),
      image: "/images/materials/tmt_bar.png",
      href: "/browse?q=TMT",
    },
    {
      title: t("mat_paint_title"),
      image: "/images/materials/paint.png",
      href: "/browse?q=Paint",
    },
    {
      title: t("mat_marble_title"),
      image: "/images/materials/marble_tiles.png",
      href: "/browse?type=PRODUCT&parentCategory=52975122-fa62-4646-be95-e09bf732054a&page=1",
    },
    {
      title: t("mat_paver_title"),
      image: "/images/materials/paver.png",
      href: "/browse?q=Paver",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container size="lg">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-primary text-3xl md:text-4xl lg:text-5xl font-black tracking-tight ">
            {t("materials_section_title")}
          </h2>
        </div>

        {/* 4x2 Grid on Desktop, 2x4 on Tablet, 1x8 on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {materials.map((material, index) => (
            <MaterialCard
              key={index}
              title={material.title}
              category={""}
              image={material.image}
              href={material.href}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-20">
          <Button variant="glow" size="action" className="group" asChild>
            <Link href="/browse?type=PRODUCT">
              {t("materials_section_cta")}
              <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
