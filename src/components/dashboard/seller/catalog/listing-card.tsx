"use client";

import Link from "next/link";
import { Clock, MapPin, MoreVertical, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ItemListing } from "@/types/catalog";
import { UNIT_TYPE_LABELS } from "@/constants/quantities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: ItemListing;
  type: "PRODUCT" | "SERVICE";
}

export function ListingCard({ listing, type }: ListingCardProps) {
  const isProduct = type === "PRODUCT";

  return (
    <Card className="group relative border shadow-none hover:border-primary/50 transition-all overflow-hidden bg-card">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Image/Icon Placeholder */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-muted flex items-center justify-center text-muted-foreground/40 shrink-0 self-center ml-4 rounded-md">
            {isProduct ? <Package size={24} /> : <Clock size={24} />}
          </div>

          <div className="flex-1 p-4 flex items-center justify-between">
            <Link
              href={`/seller-dashboard/catalog/${listing.id}`}
              className="flex-1 space-y-1 min-w-0 pr-4"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold truncate">
                  {listing.item?.name}
                </h3>
                <Badge
                  variant={listing.isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-[10px] uppercase h-5",
                    listing.isActive &&
                      "bg-green-500/10 text-green-600 border-green-500/20",
                  )}
                >
                  {listing.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isProduct ? (
                  <>
                    <span>{listing.item?.category?.name}</span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>{listing.item?.brand?.name}</span>
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {listing.itemRegions?.[0]?.state || "Global"}
                  </div>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {isProduct && (
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">
                    Min Order
                  </p>
                  <p className="text-sm font-bold">
                    {listing.itemRates?.[0]?.minQuantity}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {listing.itemRates?.[0]?.unitType &&
                        UNIT_TYPE_LABELS[listing.itemRates[0].unitType]}
                    </span>
                  </p>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/seller-dashboard/catalog/${listing.id}`}>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
