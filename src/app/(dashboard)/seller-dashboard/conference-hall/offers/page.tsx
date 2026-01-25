"use client";

import { OfferList } from "@/components/dashboard/seller/offers/offer-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OffersPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            Manage your offers and promotions in the Conference Hall.
          </p>
        </div>
        <Button
          onClick={() =>
            router.push("/seller-dashboard/conference-hall/offers/create")
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      <OfferList />
    </div>
  );
}
