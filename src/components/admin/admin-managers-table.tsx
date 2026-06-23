"use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { useAdminManagersQuery } from "@/queries/adminQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { AdminUser } from "@/types/auth";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { USER_ROLE_LABELS } from "@/constants/roles";
import { useAuthStore } from "@/store/authStore";
import {
  AdminUserRowActions,
  getAdminUserRowActionsPermission,
} from "@/components/admin/admin-user-row-actions";

type User = AdminUser;

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline">
        {USER_ROLE_LABELS[row.original.role as keyof typeof USER_ROLE_LABELS] ||
          row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      if (!row.original.createdAt) return "-";
      return format(new Date(row.original.createdAt), "PPP");
    },
  },
];

export function AdminManagersTable() {
  const { user } = useAuthStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const rowPermissions = getAdminUserRowActionsPermission(
    user?.role,
    "ADMIN_MANAGER",
  );

  const { data, isLoading } = useAdminManagersQuery({
    role: "ADMIN_MANAGER",
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const users = data || [];
  const columnsWithActions = [
    ...columns,
    ...(rowPermissions.canEdit || rowPermissions.canDelete
      ? [
          {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }: { row: { original: User } }) => (
              <AdminUserRowActions
                user={row.original}
                canEdit={rowPermissions.canEdit}
                canDelete={rowPermissions.canDelete}
              />
            ),
          },
        ]
      : []),
  ] as ColumnDef<User>[];

  return (
    <DataTable
      columns={columnsWithActions}
      data={users}
      pageCount={-1}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      loading={isLoading}
    />
  );
}
