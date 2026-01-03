"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useBrowseParams } from "@/hooks/useBrowseParams";
import { Facet } from "@/queries/browse.queries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  facets?: {
    categories: Facet[];
    brands: Facet[];
  };
  isLoading?: boolean;
}

export function Sidebar({ facets, isLoading }: SidebarProps) {
  const { params, updateParams } = useBrowseParams();

  const handleCategoryChange = (category: string, checked: boolean) => {
    const current = params.category;
    let next: string[];
    if (checked) {
      next = [...current, category];
    } else {
      next = current.filter((c) => c !== category);
    }
    updateParams({ category: next });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const current = params.brand;
    let next: string[];
    if (checked) {
      next = [...current, brand];
    } else {
      next = current.filter((b) => b !== brand);
    }
    updateParams({ brand: next });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-muted rounded-md"></div>
        <div className="h-40 bg-muted rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4 text-sm tracking-wide uppercase text-muted-foreground">
          Categories
        </h3>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {facets?.categories.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${cat.value}`}
                  checked={params.category.includes(cat.value)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(cat.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`cat-${cat.value}`}
                  className="flex-1 cursor-pointer font-normal text-sm flex justify-between"
                >
                  <span>{cat.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {cat.count}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4 text-sm tracking-wide uppercase text-muted-foreground">
          Brands
        </h3>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {facets?.brands.map((brand) => (
              <div key={brand.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.value}`}
                  checked={params.brand.includes(brand.value)}
                  onCheckedChange={(checked) =>
                    handleBrandChange(brand.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`brand-${brand.value}`}
                  className="flex-1 cursor-pointer font-normal text-sm flex justify-between"
                >
                  <span>{brand.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {brand.count}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
