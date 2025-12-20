"use client";

import { useItemsQuery } from "@/queries/catalogQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Item } from "@/types/catalog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { ActionColumn } from "./action-column";
import { useItemStore } from "@/store/itemStore";

export function ItemTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { setEditOpen } = useItemStore();

  const { data, isLoading } = useItemsQuery({
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const items = data || [];

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => row.original.category?.name || "-",
    },
    {
      accessorKey: "brand.name",
      header: "Brand",
      cell: ({ row }) => row.original.brand?.name || "-",
    },
    {
      accessorKey: "specification.name",
      header: "Specification",
      cell: ({ row }) => row.original.specification?.name || "-",
    },
    {
      accessorKey: "HSNCode",
      header: "HSN",
    },
    {
      accessorKey: "GSTPercentage",
      header: "GST %",
      cell: ({ row }) => `${row.original.GSTPercentage}%`,
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
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionColumn
          onEdit={() => setEditOpen(true, row.original)}
          onDelete={() => {
            // TODO: Implement delete
          }}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      pageCount={-1}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      loading={isLoading}
    />
  );
}
