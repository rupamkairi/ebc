"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrowseParams, SortOption } from "@/hooks/useBrowseParams";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Facet } from "@/queries/browse.queries";
import { useDebounce } from "@uidotdev/usehooks";

interface SearchProps {
  facets?: {
    brands: Facet[];
    specifications: Facet[];
  };
}

export function Search({ facets }: SearchProps) {
  const { params, updateParams } = useBrowseParams();
  const [searchTerm, setSearchTerm] = useState(params.q);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Sync internal state if URL changes externally
  useEffect(() => {
    if (params.q !== searchTerm) {
      setSearchTerm(params.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q]);

  // Update URL when debounce triggers
  useEffect(() => {
    if (debouncedSearchTerm !== params.q) {
      updateParams({ q: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, params.q, updateParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background">
      <div className="relative w-full sm:max-w-md">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-9 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <Sidebar facets={facets} />
            </div>
          </SheetContent>
        </Sheet>

        <Select
          value={params.sort}
          onValueChange={(val) => updateParams({ sort: val as SortOption })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
