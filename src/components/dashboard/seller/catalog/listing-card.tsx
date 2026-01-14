"use client";

import { Clock, MapPin, MoreVertical, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ItemListing } from "@/types/catalog";

interface ListingCardProps {
  listing: ItemListing;
  type: "PRODUCT" | "SERVICE";
}

export function ListingCard({ listing, type }: ListingCardProps) {
  const isProduct = type === "PRODUCT";

  return (
    <Card className="border shadow-none hover:shadow-md transition-all group overflow-hidden bg-card rounded-lg">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-muted flex items-center justify-center text-muted-foreground/30 shrink-0 group-hover:bg-primary/5 transition-colors">
            {isProduct ? <Package size={32} /> : <Clock size={32} />}
          </div>
          <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">
                  {listing.item?.name}
                </h3>
                <Badge
                  variant={listing.isActive ? "default" : "secondary"}
                  className="text-[9px] px-2 py-0"
                >
                  {listing.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              {isProduct ? (
                <div className="flex items-center gap-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>{listing.item?.category?.name}</span>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-primary">
                    {listing.item?.brand?.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest bg-muted w-fit px-2 py-1 rounded-md border">
                  <MapPin size={12} className="text-primary" />
                  {listing.item_region?.[0]?.state || "Global"}{" "}
                  {listing.item_region && listing.item_region.length > 1
                    ? `+${listing.item_region.length - 1} more`
                    : ""}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              {isProduct && (
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Min. Order
                  </p>
                  <div className="flex items-center justify-end font-bold text-primary text-2xl tracking-tighter">
                    {listing.item_rate?.minQuantity}
                    <span className="text-xs text-muted-foreground font-medium ml-1">
                      {listing.item_rate?.unitType}
                    </span>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground/50 hover:text-primary transition-all"
              >
                <MoreVertical size={20} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
