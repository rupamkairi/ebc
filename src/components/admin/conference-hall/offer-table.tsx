"use client";

import {
  ColumnDef,
  PaginationState,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
import { DataTable } from "@/components/datatable/data-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { ConferenceHallRowActions } from "./conference-hall-row-actions";
import { Offer, VERIFICATION_STATUS } from "@/types/conference-hall";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OfferTableProps {
  data: Offer[];
  onViewDetails: (offer: Offer) => void;
  onDelete: (offer: Offer) => Promise<void>;
  canDelete: boolean;
  deletingId?: string | null;
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function OfferTable({
  data,
  onViewDetails,
  onDelete,
  canDelete,
  deletingId,
  isLoading,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: OfferTableProps) {
  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Offer Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      id: "entity",
      header: "Seller / Entity",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.entity?.name || "N/A"}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[220px]">
            {row.original.entity?.contactEmail ||
              row.original.entity?.primaryContactNumber ||
              "No contact details on list row"}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status =
          row.original.verificationStatus || VERIFICATION_STATUS.PENDING;
        return (
          <Badge
            variant={
              status === VERIFICATION_STATUS.APPROVED
                ? "default"
                : status === VERIFICATION_STATUS.REJECTED
                  ? "destructive"
                  : "outline"
            }
            className={cn(
              status === VERIFICATION_STATUS.APPROVED &&
                "bg-emerald-500 hover:bg-emerald-600 border-none",
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "validity",
      header: "Validity",
      cell: ({ row }) => {
        const detail = row.original.offerDetails?.[0];
        if (!detail || !detail.startDate || !detail.endDate)
          return <span className="text-muted-foreground text-xs">N/A</span>;

        return (
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>
              {format(new Date(detail.startDate), "MMM d")} -{" "}
              {format(new Date(detail.endDate), "MMM d, yyyy")}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <ConferenceHallRowActions
            name={row.original.name}
            type="offer"
            onView={() => onViewDetails(row.original)}
            onDelete={() => onDelete(row.original)}
            canDelete={canDelete}
            isDeleting={deletingId === row.original.id}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      sorting={sorting}
      onSortingChange={onSortingChange}
      pageCount={-1}
    />
  );
}
