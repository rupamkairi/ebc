"use client";

import { OfferForm } from "@/components/dashboard/seller/offers/offer-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreateOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");
  const isEdit = !!offerId;

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
