"use client";

import { useState } from "react";
import Container from "@/components/ui/containers";
import { EventTable } from "@/components/admin/conference-hall/event-table";
import { EventVerificationModal } from "@/components/admin/conference-hall/event-verification-modal";
import { useEventsQuery } from "@/queries/conferenceHallQueries";
import { ConferenceHallEvent } from "@/types/conference-hall";
import { PaginationState, SortingState } from "@tanstack/react-table";

export default function AdminEventVerificationPage() {
  const [selectedEvent, setSelectedEvent] =
    useState<ConferenceHallEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: events = [], isLoading } = useEventsQuery({
    // Add sorting/pagination params if API supports it
  });

  const handleViewDetails = (event: ConferenceHallEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Event Verification
        </h1>
        <p className="text-muted-foreground">
          Review and verify events scheduled by sellers.
        </p>
      </div>

      <EventTable
        data={events}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      <EventVerificationModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Container>
  );
}
