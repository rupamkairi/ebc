"use client";

import { useState } from "react";
import Container from "@/components/ui/containers";
import { OfferTable } from "@/components/admin/conference-hall/offer-table";
import { OfferVerificationModal } from "@/components/admin/conference-hall/offer-verification-modal";
import { useOffersQuery } from "@/queries/conferenceHallQueries";
import { Offer } from "@/types/conference-hall";
import { PaginationState, SortingState } from "@tanstack/react-table";

export default function AdminOfferVerificationPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: offers = [], isLoading } = useOffersQuery({
    // Add sorting/pagination params if API supports it
  });

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Offer Verification
        </h1>
        <p className="text-muted-foreground">
          Review and verify offers created by sellers.
        </p>
      </div>

      <OfferTable
        data={offers}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      <OfferVerificationModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Container>
  );
}
