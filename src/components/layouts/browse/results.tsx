"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrowseParams } from "@/hooks/useBrowseParams";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBrowseStore } from "@/store/browseStore";
import { ItemCardGrid } from "@/components/browse/item-card";
import { SubCategoryCardContainer } from "@/components/browse/sub-category-card";
import { CategoryCarousel } from "@/components/browse/category-carousel";

interface ResultsProps {
  isLoading: boolean;
}

export function Results({ isLoading }: ResultsProps) {
  // URL params for selection state
  const { params, updateParams, setParentCategory, toggleSubCategory } =
    useBrowseParams();

  // Store for API data only
  const { items, categories, subCategories, total, page, totalPages } =
    useBrowseStore();

  // Get selection from URL params
  const { parentCategory, subCategory, type } = params;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Categories Skeleton */}
        <div className="w-full h-[100px] bg-muted/20 rounded-md animate-pulse" />
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pageTitle = type === "SERVICE" ? "Browse Services" : "Browse Products";

  return (
    <div className="space-y-6">
      {/* 1. Parent Categories Carousel */}
      <CategoryCarousel
        categories={categories}
        selectedId={parentCategory}
        onSelect={setParentCategory}
        title={pageTitle}
      />

      {/* 2. Subcategories Carousel (only if category selected) */}
      {parentCategory && subCategories.length > 0 && (
        <SubCategoryCardContainer
          items={subCategories}
          selectedIds={subCategory}
          onToggle={toggleSubCategory}
          title="Sub-Categories"
        />
      )}

      {/* 4. Results Breadcrumb/Line */}
      <div className="border-b border-slate-200 pb-2">
         <p className="text-sm font-bold text-slate-400">
           Result : <span className="text-primary">
             {categories.find(c => c.id === parentCategory)?.name || (parentCategory ? "Loading..." : "All Materials")}
           </span> 
           {subCategory.length > 0 && " > "}
           <span className="text-slate-500">
             {subCategories.find(s => subCategory.includes(s.id))?.name}
           </span>
         </p>
      </div>

      {/* 5. Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p className="font-bold text-slate-500">
          Showing {items.length} of {total}{" "}
          {type === "SERVICE" ? "services" : "products"}
        </p>
      </div>

      {/* 5. Product Grid or Empty State */}
      {items.length > 0 ? (
        <ItemCardGrid items={items} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
          <Button
            variant="link"
            onClick={() =>
              updateParams({
                q: "",
                parentCategory: null,
                subCategory: [],
                brand: [],
                specification: [],
              })
            }
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* 6. Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateParams({ page: Math.max(1, page - 1) })}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              updateParams({ page: Math.min(totalPages, page + 1) })
            }
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
