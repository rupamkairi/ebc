"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoryCardProps {
  item: Category;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryCard({ item, isSelected, onClick }: CategoryCardProps) {
  // Map colors based on category name or ID - simulated from image
  const getColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("cement")) return "bg-secondary";
    if (n.includes("bricks")) return "bg-[#AA764F]";
    if (n.includes("steel")) return "bg-primary";
    if (n.includes("elec")) return "bg-[#2D3663]";
    if (n.includes("floor")) return "bg-[#3AB795]";
    if (n.includes("sand")) return "bg-[#D69F3C]";
    return "bg-primary"; // Default
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[140px] shrink-0 rounded-lg overflow-hidden transition-all duration-300 flex flex-col items-center p-2 group",
        isSelected
          ? "scale-105 shadow-xl ring-2 ring-secondary"
          : "hover:scale-102",
        getColor(item.name),
      )}
    >
      {item.image && (
        <div className="relative h-[80px] w-full flex items-center justify-center">
          {/* Subtle overlay for image consistency */}
          <div className="absolute inset-x-2 inset-y-1 bg-white/20 rounded-md backdrop-blur-[2px]" />
          <Image
            src={item.image}
            alt={item.name}
            width={60}
            height={60}
            className="relative z-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
            unoptimized
          />
        </div>
      )}
      <div className="py-2 text-center w-full">
        <p className="text-[10px] font-black uppercase text-white wrap-normal tracking-widest leading-tight">
          {item.name}
        </p>
      </div>
    </button>
  );
}

interface CategoryCarouselProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
  title?: string;
  isLoading?: boolean;
}

export function CategoryCarousel({
  categories,
  selectedId,
  onSelect,
  title = "Categories",
  isLoading,
}: CategoryCarouselProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[120px] h-[100px] bg-muted rounded-xl animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">
        {title}
      </h3>
      <ScrollArea className="w-full ">
        <div className="flex w-max space-x-3 p-2 pb-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              item={cat}
              isSelected={selectedId === cat.id}
              onClick={() => onSelect(selectedId === cat.id ? null : cat.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
