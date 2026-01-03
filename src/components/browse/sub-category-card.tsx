"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface SubCategory {
  id: string;
  name: string;
  image: string;
}

interface SubCategoryCardProps {
  item: SubCategory;
}

export function SubCategoryCard({ item }: SubCategoryCardProps) {
  return (
    <Card className="w-[140px] shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
      <div className="relative h-[80px] w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <CardContent className="p-3 text-center">
        <p className="text-xs font-medium line-clamp-1">{item.name}</p>
      </CardContent>
    </Card>
  );
}

interface SubCategoryCardContainerProps {
  items?: SubCategory[];
}

export function SubCategoryCardContainer({
  items,
}: SubCategoryCardContainerProps) {
  // Mock items if none provided (for layout demo)
  const displayItems =
    items ||
    Array.from({ length: 10 }).map((_, i) => ({
      id: `sub-${i}`,
      name: `Sub Category ${i + 1}`,
      image: "https://placehold.co/150x100",
    }));

  return (
    <div className="w-full">
      <h3 className="font-semibold mb-4 text-sm">Explore Sub-Categories</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {displayItems.map((item) => (
            <SubCategoryCard key={item.id} item={item} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
