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
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  FileText as FileTextIcon,
  Download,
} from "lucide-react";
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
            <Button disabled={listing.entity?.verificationStatus !== "APPROVED"}>
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

          {listing.attachments && listing.attachments.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">
                {t("attached_media_documents", "Attached Media & Documents")}
              </h3>
              <div className="flex flex-wrap gap-4">
                {listing.attachments.map((att: import("@/types/catalog").Attachment) => {
                  if (att.media) {
                    return (
                      <a key={att.id} href={att.media.url} target="_blank" rel="noreferrer" className="group relative h-24 w-24 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-muted/30">
                        <img src={att.media.url} alt="Attachment" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-white" />
                        </div>
                      </a>
                    );
                  }
                  if (att.document) {
                    return (
                      <a key={att.id} href={att.document.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-[250px] p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileTextIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="truncate flex-1">
                          <p className="text-sm font-bold text-primary truncate" title={att.document.name || "Document"}>{att.document.name || "Document"}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{att.document.fileType || "PDF"}</p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
