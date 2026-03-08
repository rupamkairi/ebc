"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CatalogHeaderProps {
  isLoading: boolean;
  isServiceBusiness: boolean;
  businessName?: string;
  onCreateClick: () => void;
}

export function CatalogHeader({
  isLoading,
  isServiceBusiness,
  businessName,
  onCreateClick,
}: CatalogHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          {isServiceBusiness ? "Service Catalog" : "Product Catalog"}
        </h1>
        {businessName && (
          <p className="text-primary/60 font-medium italic">
            Managing {isServiceBusiness ? "service offerings" : "products"} for{" "}
            {businessName}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateClick}
          disabled={isLoading}
          className="bg-secondary hover:bg-secondary/90 text-white font-black px-6 h-12 rounded-xl shadow-lg shadow-amber-200/50 transition-all active:scale-95 flex items-center gap-2 border-none"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="text-lg font-bold">+</span>
          )}
          Create {isServiceBusiness ? "Service" : "Product"} Listing
        </Button>
      </div>
    </div>
  );
}
