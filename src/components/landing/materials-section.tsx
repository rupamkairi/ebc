"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MaterialCardProps {
  title: string;
  category: string;
  image: string;
}

function MaterialCard({ title, category, image }: MaterialCardProps) {
  return (
    <div className="bg-[#ec8305] p-1 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
      {/* Top White Area for Image - Tightened padding */}
      <div className="bg-white rounded-lg p-1.5 aspect-square flex items-center justify-center relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-3"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized 
        />
      </div>
      
      {/* Bottom Text Area - Tightened padding */}
      <div className="py-2 px-2 text-center">
        <h3 className="text-white font-black text-[13px] md:text-sm leading-tight uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-white/80 text-[10px] font-bold leading-tight mt-0.5 lowercase">
          {category}
        </p>
      </div>
    </div>
  );
}

export function MaterialsSection() {
  const materials = [
    {
      title: "Ultratech Cement",
      category: "cements",
      image: "/images/materials/cement.png",
    },
    {
      title: "Long Planks",
      category: "Lumber",
      image: "/images/materials/lumber.png",
    },
    {
      title: "TMT bar",
      category: "Steel",
      image: "/images/materials/tmt.png",
    },
    {
      title: "Red Clay Bricks",
      category: "Bricks and slabs",
      image: "/images/materials/bricks.png",
    },
    {
      title: "Marble Slabs",
      category: "Bricks and slabs",
      image: "/images/materials/marble.png",
    },
    {
      title: "Aggregate",
      category: "Powders",
      image: "/images/materials/aggregate.png",
    },
    {
      title: "Fly Ash",
      category: "Powders",
      image: "/images/materials/flyash.png",
    },
    {
      title: "Gypsum Powder",
      category: "Bricks and slabs",
      image: "/images/materials/gypsum.png",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container size="lg">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-[#2b429d] text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase">
            Major Construction Materials
          </h2>
        </div>

        {/* 4x2 Grid on Desktop, 2x4 on Tablet, 1x8 on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {materials.map((material, index) => (
            <MaterialCard
              key={index}
              title={material.title}
              category={material.category}
              image={material.image}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-20">
          <Button variant="glow" size="action" className="group" asChild>
            <Link href="/browse">
              Select your Products
              <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
