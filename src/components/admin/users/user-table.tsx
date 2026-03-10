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
import { Eye, MoreVertical, CheckCircle, XCircle, PauseCircle } from "lucide-react";
import { AdminUser } from "@/types/auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                "bg-emerald-500 hover:bg-emerald-600 border-none",
              entity.verificationStatus === "PAUSED" && 
                "border-amber-500 text-amber-600 hover:bg-amber-50"
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
      cell: ({ row }) => {
        const user = row.original;
        const entity = user.createdEntities?.[0] || user.staffAt;
        const status = entity?.verificationStatus;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onViewDetails(user)}
                  className="cursor-pointer"
                >
                  <Eye className="size-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {entity && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground/60 px-2 py-1.5">
                      Status Management
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        /* Handle direct approval if needed, or rely on modal */
                        onViewDetails(user);
                      }}
                      disabled={status === "APPROVED"}
                      className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                    >
                      <CheckCircle className="size-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        /* Handle direct rejection if needed, or rely on modal */
                        onViewDetails(user);
                      }}
                      disabled={status === "REJECTED"}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <XCircle className="size-4 mr-2" />
                      Disapprove
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        /* Handle direct pause if needed, or rely on modal */
                        onViewDetails(user);
                      }}
                      disabled={status === "PAUSED"}
                      className="cursor-pointer text-amber-600 focus:text-amber-600"
                    >
                      <PauseCircle className="size-4 mr-2" />
                      Pause Activity
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
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
