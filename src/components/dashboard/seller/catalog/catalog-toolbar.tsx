"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface CatalogToolbarProps {
  activeTab: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isServiceBusiness: boolean;
  isProductBusiness: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function CatalogToolbar({
  activeTab,
  searchQuery,
  onSearchChange,
  isServiceBusiness,
  isProductBusiness,
  viewMode,
  onViewModeChange,
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

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={`h-9 w-9 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-primary"}`}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={`h-9 w-9 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-primary"}`}
          >
            <List size={18} />
          </Button>
        </div>

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
    </div>
  );
}
