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
  image: string;
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
    <Card
      onClick={onClick}
      className={cn(
        "w-[140px] shrink-0 overflow-hidden cursor-pointer transition-all duration-200",
        isSelected ? "ring-2 ring-primary shadow-md" : "hover:opacity-90",
      )}
    >
      <div className="relative h-[80px] w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      <CardContent className="p-3 text-center">
        <p
          className={cn(
            "text-xs font-medium line-clamp-1",
            isSelected && "text-primary",
          )}
        >
          {item.name}
        </p>
      </CardContent>
    </Card>
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
