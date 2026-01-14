"use client";

import { Plus, Loader2 } from "lucide-react";
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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card p-6 md:p-8 rounded-lg border shadow-sm">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Store Catalog</h1>
        <p className="text-muted-foreground">
          {businessName
            ? `Managing ${
                isServiceBusiness ? "service offerings" : "product listings"
              } for ${businessName}`
            : "Showcase your professional catalog to verified buyers."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateClick}
          disabled={isLoading}
          size="lg"
          className="font-semibold shadow-sm flex items-center gap-2 group transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
          )}
          Create {isServiceBusiness ? "Service Offering" : "Product Listing"}
        </Button>
      </div>
    </div>
  );
}
