"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SubCategory {
  id: string;
  name: string;
  image?: string;
}

interface SubCategoryCardProps {
  item: SubCategory;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SubCategoryCard({
  item,
  isSelected,
  onClick,
}: SubCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-8 py-2.5 rounded-md text-sm font-black transition-all duration-200 border-2",
        isSelected
          ? "bg-secondary border-secondary text-white shadow-md"
          : "bg-white border-slate-300 text-slate-800 hover:border-secondary/50 hover:bg-slate-50",
      )}
    >
      {item.name}
    </button>
  );
}

interface SubCategoryCardContainerProps {
  items?: SubCategory[];
  selectedIds?: string[];
  onToggle?: (id: string) => void;
  title?: string;
  isLoading?: boolean;
}

export function SubCategoryCardContainer({
  items,
  selectedIds = [],
  onToggle,
  title = "Sub-Categories",
  isLoading,
}: SubCategoryCardContainerProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-[140px] h-[110px] bg-muted rounded-xl animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">
        {title}
      </h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {items.map((item) => (
            <SubCategoryCard
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id)}
              onClick={() => onToggle?.(item.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
