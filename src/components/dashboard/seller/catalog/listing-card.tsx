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
  view?: "grid" | "list";
}

export function ListingCard({ listing, type, view = "list" }: ListingCardProps) {
  const isProduct = type === "PRODUCT";

  if (view === "grid") {
    return (
      <Card className="bg-[#001D8D] border-none shadow-xl rounded-[32px] overflow-hidden flex flex-col h-full group">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Top Placeholder Box */}
          <div className="aspect-square w-full bg-white flex items-center justify-center p-12">
            <div className="w-full h-full bg-slate-100/50 rounded-2xl flex items-center justify-center text-slate-300">
              {isProduct ? <Package size={64} strokeWidth={1} /> : <Clock size={64} strokeWidth={1} />}
            </div>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col">
            {/* Product Heading */}
            <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
              {listing.item?.name}
            </h3>

            {/* Badges Section */}
            <div className="flex gap-2">
              <Badge className="bg-[#FFA000] text-white hover:bg-[#FF8F00] uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-lg border-none">
                ID: {listing.item?.id.substring(0, 6).toUpperCase() || "N/A"}
              </Badge>
              <Badge className="bg-white text-emerald-600 hover:bg-white uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-lg border-none shadow-sm">
                {listing.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Stats View */}
            <div className="bg-white rounded-xl p-4 shadow-inner space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1A237E]/40">
                  MIN ORDER QUANTITY :
                </p>
                <p className="text-[11px] font-black text-[#1A237E]">
                  {listing.itemRates?.[0]?.minQuantity || 0} {listing.itemRates?.[0]?.unitType && UNIT_TYPE_LABELS[listing.itemRates[0].unitType]}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 mt-auto">
              <Button className="bg-[#FFA000] hover:bg-[#FF8F00] text-white font-black rounded-xl h-12 text-sm transition-all shadow-lg active:scale-95">
                Edit {isProduct ? "Product" : "Service"}
              </Button>
              <Button className="bg-white hover:bg-slate-50 text-red-600 font-bold rounded-xl h-12 text-sm transition-all shadow-md active:scale-95 border-none">
                Delete {isProduct ? "Product" : "Service"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular List View (previous style)
  return (
    <Card className="group relative border shadow-none hover:border-primary/50 transition-all overflow-hidden bg-card rounded-2xl">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-muted flex items-center justify-center text-muted-foreground/40 shrink-0 self-center ml-4 rounded-xl">
            {isProduct ? <Package size={24} /> : <Clock size={24} />}
          </div>

          <div className="flex-1 p-4 flex items-center justify-between">
            <Link
              href={`/seller-dashboard/catalog/${listing.id}`}
              className="flex-1 space-y-1 min-w-0 pr-4"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold truncate text-[#1A237E]">
                  {listing.item?.name}
                </h3>
                <Badge
                  variant={listing.isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-[10px] uppercase h-5 font-bold",
                    listing.isActive &&
                      "bg-emerald-500/10 text-emerald-600 border-none",
                  )}
                >
                  {listing.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium italic">
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

            <div className="flex items-center gap-4 shrink-0">
              {isProduct && (
                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] text-[#1A237E]/40 uppercase font-black tracking-widest leading-none">
                    Min Order
                  </p>
                  <p className="text-sm font-black text-[#FFA000]">
                    {listing.itemRates?.[0]?.minQuantity}{" "}
                    <span className="text-[10px] font-bold text-[#1A237E]/30 italic opacity-60">
                      {listing.itemRates?.[0]?.unitType &&
                        UNIT_TYPE_LABELS[listing.itemRates[0].unitType]}
                    </span>
                  </p>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/40 hover:text-primary">
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link href={`/seller-dashboard/catalog/${listing.id}`} className="font-bold cursor-pointer">
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 font-bold cursor-pointer">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
