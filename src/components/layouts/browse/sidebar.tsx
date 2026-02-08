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
    brands: Facet[];
    specifications: Facet[];
  };
  isLoading?: boolean;
}

export function Sidebar({ facets, isLoading }: SidebarProps) {
  const { params, updateParams } = useBrowseParams();

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

  const handleSpecChange = (spec: string, checked: boolean) => {
    const current = params.specification || [];
    let next: string[];
    if (checked) {
      next = [...current, spec];
    } else {
      next = current.filter((s) => s !== spec);
    }
    updateParams({ specification: next });
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
      {/* Brands Section */}
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
            {(!facets?.brands || facets.brands.length === 0) && (
              <p className="text-xs text-muted-foreground">
                No brands available
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Specifications Section */}
      <div>
        <h3 className="font-semibold mb-4 text-sm tracking-wide uppercase text-muted-foreground">
          Specifications
        </h3>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {facets?.specifications.map((spec) => (
              <div key={spec.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`spec-${spec.value}`}
                  checked={(params.specification || []).includes(spec.value)}
                  onCheckedChange={(checked) =>
                    handleSpecChange(spec.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`spec-${spec.value}`}
                  className="flex-1 cursor-pointer font-normal text-sm flex justify-between"
                >
                  <span>{spec.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {spec.count}
                  </span>
                </Label>
              </div>
            ))}
            {(!facets?.specifications ||
              facets.specifications.length === 0) && (
              <p className="text-xs text-muted-foreground">
                No specifications available
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
