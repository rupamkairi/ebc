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
import { AdminUser } from "@/types/auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: AdminUser[];
  onViewDetails: (user: AdminUser) => void;
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function UserTable({
  users,
  onViewDetails,
  isLoading,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: UserTableProps) {
  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm">{row.original.phone || "No phone"}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.email || "No email"}
          </span>
        </div>
      ),
    },
    {
      id: "entity",
      header: "Business/Entity",
      cell: ({ row }) => {
        const entity =
          row.original.createdEntities?.[0] || row.original.staffAt;
        return entity ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{entity.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic text-sm">N/A</span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const entity =
          row.original.createdEntities?.[0] || row.original.staffAt;
        if (!entity) return <Badge variant="secondary">USER</Badge>;

        return (
          <Badge
            variant={
              entity.verificationStatus === "APPROVED"
                ? "default"
                : entity.verificationStatus === "REJECTED"
                ? "destructive"
                : "outline"
            }
            className={cn(
              entity.verificationStatus === "APPROVED" &&
                "bg-emerald-500 hover:bg-emerald-600 border-none"
            )}
          >
            {entity.verificationStatus}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registered" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
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
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      sorting={sorting}
      onSortingChange={onSortingChange}
      pageCount={-1}
    />
  );
}
