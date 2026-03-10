"use client";

import { OfferForm } from "@/components/dashboard/seller/offers/offer-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useEntitiesQuery } from "@/queries/entityQueries";
import Link from "next/link";

function CreateOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");
  const isEdit = !!offerId;

  const { data: entities, isLoading } = useEntitiesQuery();
  const entity = entities?.[0];

  if (isLoading) {
    return <div className="p-10 text-center">Loading business context...</div>;
  }

  if (!entity || entity.verificationStatus !== "APPROVED") {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {!entity ? "No Business Found" : "Business Not Approved"}
        </h1>
        <p className="text-muted-foreground">
          {!entity
            ? "Please setup your business profile first."
            : `Your business must be APPROVED to ${isEdit ? "edit" : "create"} offers. Current status: ${entity.verificationStatus}`}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.back()}>Go Back</Button>
          <Button variant="outline" asChild>
            <Link href="/seller-dashboard/settings">Settings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Offer" : "Create Offer"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update your existing offer details."
              : "Create a new offer to promote your products."}
          </p>
        </div>
      </div>

      <OfferForm offerId={offerId} />
    </div>
  );
}

export default function CreateOfferPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateOfferContent />
    </Suspense>
  );
}
