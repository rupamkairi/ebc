"use client";

import { useCategoriesQuery } from "@/queries/catalogQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Category } from "@/types/catalog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { ActionColumn } from "./action-column";
import { useCategoryStore } from "@/store/categoryStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategoryTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [levelFilter, setLevelFilter] = useState<"ALL" | "TOP" | "SUB">("ALL");
  const { setEditOpen } = useCategoryStore();

  const isSubCategoryParam =
    levelFilter === "TOP" ? false : levelFilter === "SUB" ? true : undefined;

  const { data, isLoading } = useCategoriesQuery({
    isSubCategory: isSubCategoryParam,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const categories = data || [];

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "parentCategory.name",
      header: "Parent Category",
      cell: ({ row }) => row.original.parentCategory?.name || "-",
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Showing: </span>
          <Select
            value={levelFilter}
            onValueChange={(value: "ALL" | "TOP" | "SUB") =>
              setLevelFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="TOP">Categories Only</SelectItem>
              <SelectItem value="SUB">Sub Categories Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        pageCount={-1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={isLoading}
      />
    </div>
  );
}
