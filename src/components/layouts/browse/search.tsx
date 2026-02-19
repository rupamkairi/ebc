"use client";

import React, { useEffect, useState } from "react";
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
import { useEnquiryStore } from "@/store/enquiryStore";

interface SearchProps {
  categories?: { id: string; name: string }[];
  facets?: {
    brands: Facet[];
    specifications: Facet[];
  };
}

export function Search({ categories, facets }: SearchProps) {
  const { params, updateParams } = useBrowseParams();
  const [searchTerm, setSearchTerm] = useState(params.q);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inquiryCount = useEnquiryStore((state) => state.items.length);

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
    <div className="flex flex-col gap-6 w-full">
      {/* Top Row: Title & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          <span className="text-[#445EB4]">Construction</span>{" "}
          <span className="text-[#FFA500]">Materials</span>
        </h1>

        <div className="relative w-full md:max-w-md group">
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full h-10 pl-4 pr-12 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500]/40 transition-all text-slate-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-0 top-0 h-10 w-11 flex items-center justify-center bg-[#FFA500] hover:bg-[#E69500] rounded-r-full text-white transition-all shadow-md active:scale-95">
            <SearchIcon className="size-5" />
          </button>
        </div>
      </div>

      {/* Second Row: Sort & Total Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-[#445EB4]">Categories</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#2D3663] text-white px-4 py-1.5 rounded text-sm font-bold">
            <span className="opacity-70 text-[10px] uppercase font-bold tracking-wider">Sort By:</span>
            <Select
              value={params.sort}
              onValueChange={(val) => updateParams({ sort: val as SortOption })}
            >
              <SelectTrigger className="border-none bg-transparent h-auto p-0 focus:ring-0 text-white font-bold text-sm w-auto gap-1">
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

          <div className="bg-[#2D3663] text-white px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2">
            <span className="opacity-70 text-[10px] uppercase font-bold tracking-wider">Total inquiry:</span>
             <span>{inquiryCount}</span>
             <SlidersHorizontal className="size-3 text-[#FFA500]" />
          </div>

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
                <Sidebar categories={categories} facets={facets} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
