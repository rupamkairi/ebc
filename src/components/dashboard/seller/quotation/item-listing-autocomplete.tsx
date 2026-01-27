"use client";

import { useItemListingsQuery } from "@/queries/catalogQueries";
import { Combobox } from "@/components/ui/combobox";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlusCircle, SearchX } from "lucide-react";
import Link from "next/link";

interface ItemListingAutocompleteProps {
  entityId: string;
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
  flexibleWithBrands?: boolean;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ItemListingAutocomplete({
  entityId,
  categoryId,
  brandId,
  specificationId,
  flexibleWithBrands,
  value,
  onValueChange,
  disabled,
  placeholder = "Select your listing...",
}: ItemListingAutocompleteProps) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { data: listings, isLoading } = useItemListingsQuery({
    entityId,
    search: search || undefined,
  });

  const filteredOptions = useMemo(() => {
    if (!listings) return [];

    const filtered = listings
      .filter((listing) => {
        if (showAll) return true;

        const item = listing.item;
        if (!item) return false;

        // Apply filters based on requirement
        // 1. Category must match if provided
        if (categoryId && item.categoryId !== categoryId) return false;

        // 2. Specification must match if BOTH have it. 
        if (specificationId && item.specificationId && item.specificationId !== specificationId)
          return false;

        // 3. Brand must match unless flexible
        if (!flexibleWithBrands && brandId && item.brandId !== brandId)
          return false;

        return true;
      });

    return filtered.map((listing) => {
      const item = listing.item;
      const brandName = item?.brand?.name || "No Brand";
      const specName = item?.specification?.name || "No Spec";
      
      return {
        label: `${item?.name || "Unknown Item"} - ${brandName} (${specName})`,
        value: listing.id,
      };
    });
  }, [listings, categoryId, brandId, specificationId, flexibleWithBrands, showAll]);

  const hasListings = listings && listings.length > 0;

  return (
    <div className="space-y-3">
      <Combobox
        options={filteredOptions}
        value={value}
        onValueChange={onValueChange}
        onSearchValueChange={setSearch}
        searchValue={search}
        loading={isLoading}
        placeholder={placeholder}
        emptyText={
          <div className="p-4 flex flex-col items-center justify-center text-center gap-3">
            <SearchX className="h-8 w-8 text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {search 
                  ? `No matches for "${search}"` 
                  : hasListings 
                    ? "No recommended products found" 
                    : "Your catalog is empty"}
              </p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                {hasListings 
                  ? "We couldn't find products matching this enquiry's category/brand." 
                  : "You haven't added any products to your business catalog yet."}
              </p>
            </div>
            
            {hasListings && !showAll && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full text-xs font-bold"
                onClick={() => setShowAll(true)}
              >
                View Full Catalog ({listings.length})
              </Button>
            )}

            {!hasListings && (
              <Button asChild variant="outline" size="sm" className="w-full text-xs gap-2">
                <Link href="/seller-dashboard/catalog">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Products to Catalog
                </Link>
              </Button>
            )}
          </div>
        }
        label={placeholder}
        disabled={disabled}
      />
      
      {hasListings && (
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className={`text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              showAll ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {showAll ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Showing All Listings
              </>
            ) : (
              "Filter by Recommendations"
            )}
          </button>

          <Link 
            href="/seller-dashboard/catalog" 
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            Manage Catalog
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
