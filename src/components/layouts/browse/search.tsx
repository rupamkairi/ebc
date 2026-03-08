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
import {
  ClipboardList,
  SearchIcon,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { InquiryPanel } from "./inquiry-panel";
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

  useEffect(() => {
    if (params.q !== searchTerm) {
      setSearchTerm(params.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q]);

  useEffect(() => {
    if (debouncedSearchTerm !== params.q) {
      updateParams({ q: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, params.q, updateParams]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Row 1: Title + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          <span className="text-primary">Construction</span>{" "}
          <span className="text-secondary">Materials</span>
        </h1>

        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full h-11 pl-5 pr-14 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all text-slate-700 font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center bg-secondary hover:bg-secondary/90 rounded-r-full text-white transition-all active:scale-95">
            <SearchIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Section label + Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-black text-primary">Categories</h2>

        {/* Unified toolbar */}
        <div className="flex items-stretch h-10 rounded-xl overflow-hidden shadow-md border border-white/10 bg-[#1e274f]">

          {/* Sort By — SelectTrigger IS the button */}
          <Select
            value={params.sort}
            onValueChange={(val) => updateParams({ sort: val as SortOption })}
          >
            <SelectTrigger className="h-full px-4 bg-transparent border-none rounded-none text-white font-semibold text-sm focus:ring-0 shadow-none gap-2.5 hover:bg-white/10 transition-colors [&>span]:flex [&>span]:items-center [&>span]:gap-2">
              <ArrowUpDown className="size-3.5 text-secondary shrink-0" />
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold hidden xs:inline">Sort</span>
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="w-px bg-white/10 self-stretch my-2" />

          {/* Inquiry counter */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2.5 px-4 h-full text-white hover:bg-white/10 transition-colors">
                <ClipboardList className="size-4 text-secondary shrink-0" />
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold hidden xs:inline">Enquiry</span>
                <span className="min-w-[20px] h-5 px-1.5 bg-secondary text-white text-xs font-black rounded-full flex items-center justify-center tabular-nums leading-none">
                  {inquiryCount}
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-none bg-transparent">
              <SheetHeader className="sr-only">
                <SheetTitle>Your Inquiry List</SheetTitle>
              </SheetHeader>
              <div className="h-full p-4 pt-12">
                <InquiryPanel isMobile />
              </div>
            </SheetContent>
          </Sheet>

          {/* Divider */}
          <div className="w-px bg-white/10 self-stretch my-2 lg:hidden" />

          {/* Mobile filters button */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-4 h-full text-white hover:bg-white/10 transition-colors lg:hidden">
                <SlidersHorizontal className="size-4 text-secondary" />
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold hidden xs:inline">Filter</span>
              </button>
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

