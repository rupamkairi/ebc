"use client";

import { Search } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CatalogToolbarProps {
  activeTab: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isServiceBusiness: boolean;
  isProductBusiness: boolean;
}

export function CatalogToolbar({
  activeTab,
  searchQuery,
  onSearchChange,
  isServiceBusiness,
  isProductBusiness,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      {/* 
        Hide the tabs list entirely if the business is restricted to one type 
      */}
      {isServiceBusiness && isProductBusiness && (
        <TabsList className="bg-muted p-1 rounded-md h-auto">
          <TabsTrigger
            value="products"
            className="rounded-sm px-8 py-2 font-semibold text-xs transition-all uppercase tracking-widest"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="rounded-sm px-8 py-2 font-semibold text-xs transition-all uppercase tracking-widest"
          >
            Services
          </TabsTrigger>
        </TabsList>
      )}

      <div className="relative w-full md:w-80 group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search in ${
            activeTab === "products" ? "Products" : "Services"
          }...`}
          className="w-full bg-background border rounded-md py-2 pl-10 pr-4 text-sm font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-sm focus:border-primary/20"
        />
      </div>
    </div>
  );
}
