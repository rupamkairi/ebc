"use client";

import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBrowseStore } from "@/store/browseStore";
import { useBrowseParams } from "@/hooks/useBrowseParams";

export function SelectedFiltersChips() {
  // URL params for selection state
  const { params, toggleSubCategory, updateParams } = useBrowseParams();

  // Store for API data (subcategory details like names)
  const { subCategories } = useBrowseStore();

  // Get names for selected IDs from URL params
  const selectedItems = subCategories.filter((sc) =>
    params.subCategory.includes(sc.id),
  );

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">
        Filters:
      </span>
      {selectedItems.map((item) => (
        <Badge
          key={item.id}
          variant="secondary"
          className="pl-2 pr-1 py-1 gap-1 cursor-pointer hover:bg-destructive/10 transition-colors"
          onClick={() => toggleSubCategory(item.id)}
        >
          <span className="text-xs">{item.name}</span>
          <X className="h-3 w-3" />
        </Badge>
      ))}
      {selectedItems.length > 1 && (
        <button
          onClick={() => updateParams({ subCategory: [] })}
          className="text-xs text-muted-foreground hover:text-destructive underline ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
