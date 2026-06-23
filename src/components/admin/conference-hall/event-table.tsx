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
      id: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
    },
    {
      id: "mode",
      header: "Mode",
      cell: ({ row }) => {
        const isHybrid = row.original.isRemote && row.original.isPhysical;
        const label = isHybrid
          ? "Hybrid"
          : row.original.isRemote
            ? "Remote"
            : row.original.isPhysical
              ? "Physical"
              : "Unspecified";

        return <Badge variant="secondary">{label}</Badge>;
      },
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
      id: "targeting",
      header: "Targeting",
      cell: ({ row }) => {
        const regions = row.original.targetRegions || [];
        if (regions.length === 0) {
          return <span className="text-xs text-muted-foreground">Global / Unspecified</span>;
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-[260px]">
            {regions.slice(0, 2).map((region, index) => (
              <Badge key={region.id || `${region.pincodeId}-${index}`} variant="outline" className="text-[10px]">
                {formatRegion(region)}
              </Badge>
            ))}
            {regions.length > 2 && (
              <Badge variant="secondary" className="text-[10px]">
                +{regions.length - 2} more
              </Badge>
            )}
          </div>
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

function formatRegion(region: {
  scopeType?: string | null;
  pincodeId?: string | null;
  pincode?: {
    pincode?: string | null;
    district?: string | null;
    state?: string | null;
  } | null;
  state?: string | null;
  district?: string | null;
}) {
  const scope = region.scopeType || "PINCODE";
  const parts = [
    region.pincode?.pincode,
    region.pincode?.district,
    region.pincode?.state,
    region.district,
    region.state,
    region.pincodeId,
  ].filter(Boolean);

  return `${scope}: ${parts.join(" • ") || "N/A"}`;
}
