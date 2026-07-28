"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/containers";
import { OfferTable } from "@/components/admin/conference-hall/offer-table";
import { OfferVerificationModal } from "@/components/admin/conference-hall/offer-verification-modal";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { filterConferenceHallOffers } from "@/components/admin/conference-hall/filter-conference-hall";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useOffersQuery, usePermanentlyDeleteOfferMutation } from "@/queries/conferenceHallQueries";
import { Offer, VERIFICATION_STATUS } from "@/types/conference-hall";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function AdminOfferVerificationPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const role = useAuthStore((state) => state.user?.role);
  const canDelete = role === "ADMIN" || role === "ADMIN_MANAGER";
  const permanentDelete = usePermanentlyDeleteOfferMutation();
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("ALL");
  const [activeState, setActiveState] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const { data: offers = [], isLoading } = useOffersQuery({
    mode: "MANAGEMENT",
    // Add sorting/pagination params if API supports it
  });

  const filteredOffers = useMemo(
    () =>
      filterConferenceHallOffers(offers, debouncedSearch, {
        verificationStatus,
        activeState: activeState as "ALL" | "ACTIVE" | "INACTIVE",
      }),
    [activeState, debouncedSearch, offers, verificationStatus],
  );

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleDelete = async (offer: Offer) => {
    setDeletingId(offer.id);
    try {
      await permanentDelete.mutateAsync(offer.id);
      toast.success("Offer permanently deleted");
    } catch (error) {
      toast.error("Could not delete offer");
      throw error;
    } finally {
      setDeletingId(null);
    }
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

      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPagination();
        }}
        searchPlaceholder="Search offers, sellers, relations, or regions..."
        filters={[
          {
            key: "verificationStatus",
            label: "Status",
            value: verificationStatus,
            placeholder: "Verification status",
            onChange: (value) => {
              setVerificationStatus(value);
              resetPagination();
            },
            options: [
              { label: "All statuses", value: "ALL" },
              { label: "Pending", value: VERIFICATION_STATUS.PENDING },
              { label: "Approved", value: VERIFICATION_STATUS.APPROVED },
              { label: "Rejected", value: VERIFICATION_STATUS.REJECTED },
              { label: "Paused", value: VERIFICATION_STATUS.PAUSED },
              { label: "Revise", value: VERIFICATION_STATUS.REVISE },
              { label: "Misinformation", value: VERIFICATION_STATUS.MISINFORMATION },
              { label: "Inappropriate", value: VERIFICATION_STATUS.INAPPROPRIATE },
              { label: "Other", value: VERIFICATION_STATUS.OTHER },
            ],
          },
          {
            key: "activeState",
            label: "Active",
            value: activeState,
            placeholder: "Active state",
            onChange: (value) => {
              setActiveState(value);
              resetPagination();
            },
            options: [
              { label: "All active states", value: "ALL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setVerificationStatus("ALL");
          setActiveState("ALL");
          resetPagination();
        }}
      />

      <OfferTable
        data={filteredOffers}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        canDelete={canDelete}
        deletingId={deletingId}
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
