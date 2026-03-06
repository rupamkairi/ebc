"use client";

import { useItemListingQuery } from "@/queries/catalogQueries";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ListingEditForm } from "@/components/dashboard/seller/catalog/steps/listing-edit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export interface OfferListParams {
  itemListingId?: string;
  entityId?: string;

  search?: string;
  isActive?: boolean;
}

export default function ListingDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const listingId = params.listingId as string;
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: listing, isLoading } = useItemListingQuery(listingId);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return <div>{t("listing_details")} {t("not_specified")}</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("listing_details")}
            </h1>
            <p className="text-muted-foreground">
              {t("manage_listing_create_offers")}
            </p>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {t("edit_listing")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("edit_listing")}</DialogTitle>
              <DialogDescription>
                {t("update_listing_status_price")}
              </DialogDescription>
            </DialogHeader>
            {listing && (
              <ListingEditForm
                listing={listing}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{listing.item?.name || "Item Name"}</CardTitle>
          <CardDescription>{listing.item?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                {t("listing_id")}
              </p>
              <p className="text-sm font-medium">{listing.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                {t("status")}
              </p>
              <Badge variant={listing.isActive ? "default" : "secondary"}>
                {listing.isActive ? t("active") : t("inactive")}
              </Badge>
            </div>
            {listing.itemRates?.[0] && (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    {t("price")}
                  </p>
                  <p className="text-sm font-medium">
                    {listing.itemRates[0].rate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    {t("category")}
                  </p>
                  <p className="text-sm font-medium">
                    {listing.itemRates[0].unitType}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
