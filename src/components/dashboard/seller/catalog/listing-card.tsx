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
import { useDeleteItemListingMutation } from "@/queries/catalogQueries";
import { toast } from "sonner";

interface ListingCardProps {
  listing: ItemListing;
  type: "PRODUCT" | "SERVICE";
}

export function ListingCard({ listing, type }: ListingCardProps) {
  const isProduct = type === "PRODUCT";
  const status = listing.entity?.verificationStatus;
  const isApproved = status === "APPROVED";
  const deleteMutation = useDeleteItemListingMutation();

  const handleDelete = () => {
    if (!isApproved) {
      toast.error("Business must be APPROVED to delete listings.");
      return;
    }
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteMutation.mutate(listing.id, {
        onSuccess: () => {
          toast.success("Listing deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete listing");
        },
      });
    }
  };

  return (
    <Card className="group relative border shadow-none hover:border-primary/50 transition-all overflow-hidden bg-card rounded-2xl">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-muted flex items-center justify-center text-muted-foreground/40 shrink-0 self-center ml-4 rounded-xl">
            {isProduct ? <Package size={24} /> : <Clock size={24} />}
          </div>

          <div className="flex-1 p-4 flex items-center justify-between">
            <div
              className="flex-1 space-y-1 min-w-0 pr-4"
            >
              <div className="flex items-center gap-2">
                {isApproved ? (
                  <Link href={`/seller-dashboard/catalog/${listing.id}`}>
                    <h3 className="text-base font-semibold truncate text-primary hover:underline">
                      {listing.item?.name}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-base font-semibold truncate text-primary">
                    {listing.item?.name}
                  </h3>
                )}
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
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {isProduct && (
                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] text-primary/40 uppercase font-black tracking-widest leading-none">
                    Min Order
                  </p>
                  <p className="text-sm font-black text-secondary">
                    {listing.itemRates?.[0]?.minQuantity}{" "}
                    <span className="text-[10px] font-bold text-primary/30 italic opacity-60">
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
                  {isApproved ? (
                    <DropdownMenuItem asChild>
                      <Link href={`/seller-dashboard/catalog/${listing.id}`} className="font-bold cursor-pointer">
                        View Details
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem disabled className="font-bold opacity-50">
                      View Details (Restricted)
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-red-600 font-bold cursor-pointer"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending || !isApproved}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
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
