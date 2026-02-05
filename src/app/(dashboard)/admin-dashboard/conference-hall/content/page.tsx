"use client";

import { useState } from "react";
import Container from "@/components/containers/containers";
import { ContentTable } from "@/components/admin/conference-hall/content-table";
import { ContentVerificationModal } from "@/components/admin/conference-hall/content-verification-modal";
import { useContentsQuery } from "@/queries/conferenceHallQueries";
import { Content } from "@/types/conference-hall";
import { PaginationState, SortingState } from "@tanstack/react-table";

export default function AdminContentVerificationPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]); // Sort by verificationStatus asc by default if needed

  const { data: contents = [], isLoading } = useContentsQuery({
    // We might want to filter by entity or status later, for now fetch all
    // Add sorting/pagination params if API supports it
  });

  const handleViewDetails = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
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

      <ContentTable
        data={contents}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
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
