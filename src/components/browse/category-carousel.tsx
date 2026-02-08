"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryCardProps {
  item: Category;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryCard({ item, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[120px] shrink-0 rounded-xl overflow-hidden transition-all duration-200 border-2 bg-card",
        isSelected
          ? "border-primary shadow-lg scale-105"
          : "border-transparent hover:border-muted-foreground/30",
      )}
    >
      <div className="relative h-[70px] w-full bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-2 text-center">
        <p
          className={cn(
            "text-xs font-medium line-clamp-1",
            isSelected && "text-primary",
          )}
        >
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
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-3 pb-2">
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
