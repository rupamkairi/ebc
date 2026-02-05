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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Offer, VERIFICATION_STATUS } from "@/types/conference-hall";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OfferTableProps {
  data: Offer[];
  onViewDetails: (offer: Offer) => void;
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function OfferTable({
  data,
  onViewDetails,
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(row.original)}
          >
            <Eye className="size-4 mr-2" />
            Verify
          </Button>
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
