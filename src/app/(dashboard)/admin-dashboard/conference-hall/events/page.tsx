"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/containers";
import { EventTable } from "@/components/admin/conference-hall/event-table";
import { EventVerificationModal } from "@/components/admin/conference-hall/event-verification-modal";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { filterConferenceHallEvents } from "@/components/admin/conference-hall/filter-conference-hall";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useEventsQuery, usePermanentlyDeleteEventMutation } from "@/queries/conferenceHallQueries";
import {
  ConferenceHallEvent,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function AdminEventVerificationPage() {
  const [selectedEvent, setSelectedEvent] =
    useState<ConferenceHallEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const role = useAuthStore((state) => state.user?.role);
  const canDelete = role === "ADMIN" || role === "ADMIN_MANAGER";
  const permanentDelete = usePermanentlyDeleteEventMutation();
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("ALL");
  const [activeState, setActiveState] = useState("ALL");
  const [visibilityState, setVisibilityState] = useState("ALL");
  const [eventType, setEventType] = useState("ALL");
  const [eventMode, setEventMode] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const { data: events = [], isLoading } = useEventsQuery({
    // Add sorting/pagination params if API supports it
  });

  const filteredEvents = useMemo(
    () =>
      filterConferenceHallEvents(events, debouncedSearch, {
        verificationStatus,
        activeState: activeState as "ALL" | "ACTIVE" | "INACTIVE",
        visibilityState: visibilityState as "ALL" | "PUBLIC" | "PRIVATE",
        eventType: eventType as "ALL" | ConferenceHallEvent["type"],
        eventMode: eventMode as "ALL" | "REMOTE" | "PHYSICAL" | "HYBRID",
      }),
    [
      activeState,
      debouncedSearch,
      eventMode,
      eventType,
      events,
      verificationStatus,
      visibilityState,
    ],
  );

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleViewDetails = (event: ConferenceHallEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event: ConferenceHallEvent) => {
    setDeletingId(event.id);
    try {
      await permanentDelete.mutateAsync(event.id);
      toast.success("Event permanently deleted");
    } catch (error) {
      toast.error("Could not delete event");
      throw error;
    } finally {
      setDeletingId(null);
    }
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

      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPagination();
        }}
        searchPlaceholder="Search events, sellers, locations, or links..."
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
          {
            key: "eventType",
            label: "Type",
            value: eventType,
            placeholder: "Event type",
            onChange: (value) => {
              setEventType(value);
              resetPagination();
            },
            options: [
              { label: "All event types", value: "ALL" },
              { label: "Live", value: "LIVE" },
              { label: "Recorded", value: "RECORDED" },
            ],
          },
          {
            key: "eventMode",
            label: "Mode",
            value: eventMode,
            placeholder: "Event mode",
            onChange: (value) => {
              setEventMode(value);
              resetPagination();
            },
            options: [
              { label: "All modes", value: "ALL" },
              { label: "Remote only", value: "REMOTE" },
              { label: "Physical only", value: "PHYSICAL" },
              { label: "Hybrid", value: "HYBRID" },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setVerificationStatus("ALL");
          setActiveState("ALL");
          setVisibilityState("ALL");
          setEventType("ALL");
          setEventMode("ALL");
          resetPagination();
        }}
      />

      <EventTable
        data={filteredEvents}
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

      <EventVerificationModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Container>
  );
}
