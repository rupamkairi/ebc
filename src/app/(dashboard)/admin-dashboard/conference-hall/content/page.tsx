"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/containers";
import { ContentTable } from "@/components/admin/conference-hall/content-table";
import { ContentVerificationModal } from "@/components/admin/conference-hall/content-verification-modal";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { filterConferenceHallContents } from "@/components/admin/conference-hall/filter-conference-hall";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useContentsQuery, usePermanentlyDeleteContentMutation } from "@/queries/conferenceHallQueries";
import { Content, VERIFICATION_STATUS } from "@/types/conference-hall";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function AdminContentVerificationPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]); // Sort by verificationStatus asc by default if needed
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const role = useAuthStore((state) => state.user?.role);
  const canDelete = role === "ADMIN" || role === "ADMIN_MANAGER";
  const permanentDelete = usePermanentlyDeleteContentMutation();
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("ALL");
  const [activeState, setActiveState] = useState("ALL");
  const [visibilityState, setVisibilityState] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const { data: contents = [], isLoading } = useContentsQuery({
    // We might want to filter by entity or status later, for now fetch all
    // Add sorting/pagination params if API supports it
  });

  const filteredContents = useMemo(
    () =>
      filterConferenceHallContents(contents, debouncedSearch, {
        verificationStatus,
        activeState: activeState as "ALL" | "ACTIVE" | "INACTIVE",
        visibilityState: visibilityState as "ALL" | "PUBLIC" | "PRIVATE",
      }),
    [
      activeState,
      contents,
      debouncedSearch,
      verificationStatus,
      visibilityState,
    ],
  );

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleViewDetails = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleDelete = async (content: Content) => {
    setDeletingId(content.id);
    try {
      await permanentDelete.mutateAsync(content.id);
      toast.success("Content permanently deleted");
    } catch (error) {
      toast.error("Could not delete content");
      throw error;
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Content Verification
        </h1>
        <p className="text-muted-foreground">
          Review and verify content submissions from sellers.
        </p>
      </div>

      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPagination();
        }}
        searchPlaceholder="Search content, descriptions, attachments, or regions..."
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
          {
            key: "visibilityState",
            label: "Visibility",
            value: visibilityState,
            placeholder: "Visibility",
            onChange: (value) => {
              setVisibilityState(value);
              resetPagination();
            },
            options: [
              { label: "All visibility", value: "ALL" },
              { label: "Public", value: "PUBLIC" },
              { label: "Private", value: "PRIVATE" },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setVerificationStatus("ALL");
          setActiveState("ALL");
          setVisibilityState("ALL");
          resetPagination();
        }}
      />

      <ContentTable
        data={filteredContents}
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

      <ContentVerificationModal
        content={selectedContent}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Container>
  );
}
