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
      <Card className="bg-white border border-[#3D52A0]/10 hover:border-[#3D52A0]/20 shadow-xs hover:shadow-md rounded-[24px] overflow-hidden flex flex-col h-full group transition-all duration-500">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="p-5 md:p-6 flex flex-col h-full space-y-5">
            {/* Header: ID and Status */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-[#3D52A0]/30 uppercase tracking-[0.2em] bg-[#3D52A0]/5 px-2.5 py-1 rounded-full">
                ID: {listing.item?.id.substring(0, 6).toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    listing.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300",
                  )}
                />
                <span className="text-[9px] font-black text-[#3D52A0]/40 uppercase tracking-widest">
                  {listing.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Title Section */}
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-[#F8FAFF] rounded-xl flex items-center justify-center text-[#3D52A0]/40 shrink-0 group-hover:bg-[#0F28A9]/5 group-hover:text-[#0F28A9] transition-all duration-300">
                {isProduct ? (
                  <Package size={24} strokeWidth={1.5} />
                ) : (
                  <Clock size={24} strokeWidth={1.5} />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-black text-[#3D52A0] tracking-tight leading-tight line-clamp-2 min-h-10">
                  {listing.item?.name}
                </h3>
                <p className="text-[10px] font-bold text-[#3D52A0]/30 uppercase tracking-wider truncate">
                  {isProduct
                    ? listing.item?.brand?.name
                    : listing.itemRegions?.[0]?.state || "Global"}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-[#F8FAFF] rounded-2xl p-4 border border-[#3D52A0]/5 space-y-1 mt-auto">
              <p className="text-[9px] font-black text-[#3D52A0]/30 uppercase tracking-widest leading-none">
                Min Order Required
              </p>
              <p className="text-sm font-black text-[#3D52A0]">
                {listing.itemRates?.[0]?.minQuantity || 0}{" "}
                <span className="text-[10px] font-bold text-[#FFA500] ml-0.5 uppercase">
                  {listing.itemRates?.[0]?.unitType &&
                    UNIT_TYPE_LABELS[listing.itemRates[0].unitType]}
                </span>
              </p>
            </div>

            {/* Action Row */}
            <div className="flex gap-2 pt-2">
              <Button
                asChild
                className="flex-1 bg-[#0F28A9] hover:bg-[#1A237E] text-white font-black rounded-xl h-10 text-[10px] tracking-widest uppercase transition-all shadow-sm active:scale-95 border-none"
              >
                <Link href={`/seller-dashboard/catalog/${listing.id}`}>
                  Edit Details
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-[#3D52A0]/10 text-[#3D52A0]/40 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl border-[#3D52A0]/10 shadow-xl"
                >
                  <DropdownMenuItem className="text-red-600 font-bold cursor-pointer text-[10px] uppercase tracking-widest py-2.5">
                    Delete Listing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
