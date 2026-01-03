"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrowseParams } from "@/hooks/useBrowseParams";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBrowseStore } from "@/store/browseStore";
import { ItemCardGrid } from "@/components/browse/item-card";
import { SubCategoryCardContainer } from "@/components/browse/sub-category-card";

interface ResultsProps {
  isLoading: boolean;
}

export function Results({ isLoading }: ResultsProps) {
  const { updateParams } = useBrowseParams();
  const { products, total, page, totalPages } = useBrowseStore();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Subcategories Skeleton */}
        <div className="w-full h-[150px] border rounded-md bg-muted/20 animate-pulse" />

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

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
        <Button
          variant="link"
          onClick={() => updateParams({ q: "", category: [], brand: [] })}
          className="mt-4"
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sub Categories Carousel */}
      <SubCategoryCardContainer />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {products.length} of {total} products
        </p>
      </div>

      <ItemCardGrid products={products} />

      {/* Pagination */}
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
