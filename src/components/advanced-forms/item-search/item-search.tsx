"use client";

import { useState } from "react";
import { CategorySearchAutocomplete } from "@/components/autocompletes/category-search-autocomplete";
import { BrandSearchAutocomplete } from "@/components/autocompletes/brand-search-autocomplete";
import { SpecificationSearchAutocomplete } from "@/components/autocompletes/specification-search-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useItemsQuery } from "@/queries/catalogQueries";
import { Item } from "@/types/catalog";
import { Loader2, Search, Package, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ItemSearchProps {
  onItemSelect?: (item: Item) => void;
  className?: string;
  type?: "PRODUCT" | "SERVICE";
}

export function ItemSearch({
  onItemSelect,
  className,
  type = "PRODUCT",
}: ItemSearchProps) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [specificationId, setSpecificationId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const isSearchValid = search.length >= 3;

  const { data: items, isLoading } = useItemsQuery({
    categoryId: categoryId || undefined,
    brandId: brandId || undefined,
    specificationId: specificationId || undefined,
    search: isSearchValid ? search : undefined,
    type: type,
  });

  const handleSelectItem = (item: Item) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      toast.success(`Selected item: ${item.name}`);
      console.log("Selected Item ID:", item.id);
    }
  };

  const clearFilters = () => {
    setCategoryId("");
    setBrandId("");
    setSpecificationId("");
    setSearch("");
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="size-5" />
            Find Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Sub Category</Label>
              <CategorySearchAutocomplete
                value={categoryId}
                onValueChange={setCategoryId}
                placeholder="All Categories"
                label="Sub Category"
                additionalParams={{ isSubCategory: true }}
              />
            </div>

            <div className="space-y-2">
              <Label>Brand</Label>
              <BrandSearchAutocomplete
                value={brandId}
                onValueChange={setBrandId}
                placeholder="All Brands"
                label="Brand"
              />
            </div>

            <div className="space-y-2">
              <Label>Specification</Label>
              <SpecificationSearchAutocomplete
                value={specificationId}
                onValueChange={setSpecificationId}
                placeholder="All Specifications"
                label="Specification"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-2">Item Search</Label>
            <div className="relative">
              <Input
                placeholder="Min. 3 characters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {isSearchValid ? (
            <>Search results for &quot;{search}&quot;</>
          ) : (
            <>Results will appear after typing at least 3 characters</>
          )}
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
            <Loader2 className="size-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Searching items...</p>
          </div>
        ) : items && items.length > 0 ? (
          <div className="h-[360px] overflow-y-auto rounded-lg border bg-background">
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start justify-between gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Package className="size-4" />
                      </div>
                      <h4 className="font-semibold text-base">{item.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 pl-8">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pl-8 pt-1">
                      {item.brand && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          {item.brand.name}
                        </span>
                      )}
                      {item.category && (
                        <span className="flex items-center gap-1">
                          <Info className="size-3" />
                          {item.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSelectItem(item)}
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : isSearchValid ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
            <Package className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No items found matching your search.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
            <Search className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground font-medium">
              Ready to search
            </p>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Please enter at least 3 characters in the item search field
              <br />
              to initiate the search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
