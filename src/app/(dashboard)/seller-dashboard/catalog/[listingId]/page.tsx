"use client";

import { useParams, useRouter } from "next/navigation";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import { Loader2 } from "lucide-react";
import { OfferForm } from "@/components/shared/forms/offer-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";
import { ListingEditForm } from "@/components/shared/forms/listing-edit-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function ListingDetailsPage() {
  const params = useParams();
  const listingId = params.listingId as string;
  // Assuming user has entityId, otherwise we might valid to fetch it or use a store selector
  // For now, fetching all listings for the user's entity (if identifiable) or just all and filtering
  // Ideally backend filters by user's entity context.

  const { data: listings, isLoading } = useItemListingsQuery({});

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const listing = listings?.find((l) => l.id === listingId);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listing Details</h1>
          <p className="text-muted-foreground">
            Manage your listing and create offers.
          </p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Listing
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update listing status, price, and other details.
            </DialogDescription>
          </DialogHeader>
          {listing && <ListingEditForm listing={listing} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>{listing.item?.name || "Item Name"}</CardTitle>
          <CardDescription>{listing.item?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Listing ID:</span> {listing.id}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {listing.isActive ? "Active" : "Inactive"}
            </div>
            {listing.item_rate && (
              <div>
                <span className="font-semibold">Rate:</span>{" "}
                {listing.item_rate.rate} / {listing.item_rate.unitType}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="border-t my-6" />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Create Offer</h2>
        <Card>
          <CardContent className="pt-6">
            <OfferForm listingId={listing.id} entityId={listing.entityId} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Existing Offers</h2>
        <p className="text-muted-foreground">
          List of existing offers calls (TODO)
        </p>
        {/* Listing offers would go here */}
      </div>
    </div>
  );
}
