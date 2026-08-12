"use client";

import { useState } from "react";
import { CategorySearchAutocomplete } from "@/components/autocompletes/category-search-autocomplete";
import { BrandSearchAutocomplete } from "@/components/autocompletes/brand-search-autocomplete";
import { SpecificationSearchAutocomplete } from "@/components/autocompletes/specification-search-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useItemsQuery } from "@/queries/catalogQueries";
import { ITEM_TYPE } from "@/constants/enums";
import { ItemListParams, Item } from "@/types/catalog";
import { Loader2, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemSearchProps {
  onItemSelect?: (item: Item) => void;
  className?: string;
  type?: "PRODUCT" | "SERVICE";
  title?: string;
  additionalParams?: Partial<ItemListParams>;
}

export function ItemSearch({
  onItemSelect,
  className,
  type = "PRODUCT",
  title,
  additionalParams,
}: ItemSearchProps) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [specificationId, setSpecificationId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const handleSelectItem = (item: Item) => {
    onItemSelect?.(item);
  };

  const isSearchValid = search.length >= 3;

  const { data: items, isLoading } = useItemsQuery({
    categoryId: categoryId || undefined,
    brandId: brandId || undefined,
    specificationId: specificationId || undefined,
    search: isSearchValid ? search : undefined,
    type: type as ITEM_TYPE,
    ...additionalParams,
  });

  return (
    <div className={cn("min-w-0 max-w-full space-y-6", className)}>
      {/* Choose Items Blue Section */}
      <div className="relative min-w-0 max-w-full overflow-hidden rounded-4xl bg-linear-to-br from-primary to-primary/80 p-6 shadow-2xl sm:p-10">
        {/* Subtle Background Pattern/Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="relative z-10 min-w-0 space-y-8">
          <div className="flex min-w-0 items-center gap-3 border-b border-white/20 pb-4">
            <Search className="size-8 shrink-0 text-white" />
            <h2 className="min-w-0 whitespace-normal break-words text-2xl font-bold tracking-tight text-white [overflow-wrap:anywhere] sm:text-3xl">
              {title ||
                `Choose Items to ${type === "PRODUCT" ? "Enquire" : "Book"}`}
            </h2>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group min-w-0 space-y-2">
              <Label className="text-[10px] font-black tracking-[0.2em] text-white/60  pl-1">
                Sub Category
              </Label>
              <div className="relative min-w-0">
                <CategorySearchAutocomplete
                  value={categoryId}
                  onValueChange={setCategoryId}
                  placeholder="Select Sub Category"
                  additionalParams={{ 
                    isSubCategory: true,
                    ...additionalParams,
                  }}
                  className="bg-white dark:bg-white hover:bg-white dark:hover:bg-white border-none h-14 rounded-xl text-primary font-bold shadow-lg focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="group min-w-0 space-y-2">
              <Label className="text-[10px] font-black tracking-[0.2em] text-white/60  pl-1">
                Brand
              </Label>
              <BrandSearchAutocomplete
                value={brandId}
                onValueChange={setBrandId}
                placeholder="Select Brand"
                className="bg-white dark:bg-white hover:bg-white dark:hover:bg-white border-none h-14 rounded-xl text-primary font-bold shadow-lg focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="group min-w-0 space-y-2">
              <Label className="text-[10px] font-black tracking-[0.2em] text-white/60  pl-1">
                Specification
              </Label>
              <SpecificationSearchAutocomplete
                value={specificationId}
                onValueChange={setSpecificationId}
                placeholder="Select Specification"
                className="bg-white dark:bg-white hover:bg-white dark:hover:bg-white border-none h-14 rounded-xl text-primary font-bold shadow-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            <Label className="text-[10px] font-black tracking-[0.2em] text-white/60  pl-1">
              Item Search
            </Label>
            <div className="group relative min-w-0">
              <Input
                placeholder="Enter Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white border-none h-14 rounded-xl pl-12 text-primary font-bold shadow-lg focus:ring-2 focus:ring-secondary placeholder:text-primary/30"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary/40 group-focus-within:text-secondary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="min-w-0 max-w-full pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-primary/20">
            <Loader2 className="size-10 animate-spin text-primary mb-3" />
            <p className="text-primary font-bold">Searching for items...</p>
          </div>
        ) : items && items.length > 0 ? (
          <div className="max-h-[500px] min-w-0 max-w-full space-y-4 overflow-x-hidden overflow-y-auto rounded-3xl border border-primary/10 bg-white/50 p-4 backdrop-blur-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex w-full max-w-full min-w-0 flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 hover:shadow-xl hover:ring-secondary/50 sm:flex-row sm:items-center"
              >
                <div className="flex w-full min-w-0 flex-1 items-center gap-4">
                  <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0">
                    <Package className="size-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h4 className="whitespace-normal break-words text-lg font-bold leading-tight text-primary [overflow-wrap:anywhere]">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground mt-1">
                      {item.brand && (
                        <span className="flex min-w-0 max-w-full items-center gap-1 break-words rounded-md bg-primary/5 px-2 py-0.5 [overflow-wrap:anywhere]">
                          {item.brand.name}
                        </span>
                      )}
                      {item.category && (
                        <span className="flex min-w-0 max-w-full items-center gap-1 break-words rounded-md bg-primary/5 px-2 py-0.5 [overflow-wrap:anywhere]">
                          {item.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleSelectItem(item)}
                  className="w-full sm:w-auto rounded-xl bg-primary hover:bg-secondary text-white font-bold h-11 px-6 shadow-lg shadow-primary/10 hover:shadow-secondary/20 transition-all duration-300 transform group-hover:scale-105 active:scale-95"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        ) : isSearchValid ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-primary/20">
            <Package className="size-10 text-primary/30 mb-3" />
            <p className="text-primary font-bold opacity-60">
              No items found matching your search.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
