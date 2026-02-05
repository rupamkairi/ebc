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
import {
  ConferenceHallEvent,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventTableProps {
  data: ConferenceHallEvent[];
  onViewDetails: (event: ConferenceHallEvent) => void;
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function EventTable({
  data,
  onViewDetails,
  isLoading,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: EventTableProps) {
  const columns: ColumnDef<ConferenceHallEvent>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      id: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
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
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ row }) => {
        if (!row.original.startDate)
          return <span className="text-muted-foreground text-sm">N/A</span>;
        return (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.startDate), "MMM d, yyyy p")}
          </span>
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
