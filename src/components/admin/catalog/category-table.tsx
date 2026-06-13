"use client";

import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/queries/catalogQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Category } from "@/types/catalog";
import { ITEM_TYPE } from "@/constants/enums";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { ActionColumn } from "./action-column";
import { useCategoryStore } from "@/store/categoryStore";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function CategoryTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [levelFilter, setLevelFilter] = useState<"ALL" | "TOP" | "SUB">("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const debouncedSearch = useDebouncedValue(search);
  const { setEditOpen } = useCategoryStore();

  const deleteMutation = useDeleteCategoryMutation();

  const isSubCategoryParam =
    levelFilter === "TOP" ? false : levelFilter === "SUB" ? true : undefined;

  const { data, isLoading } = useCategoriesQuery({
    isSubCategory: isSubCategoryParam,
    type: typeFilter === "ALL" ? undefined : (typeFilter as ITEM_TYPE),
    search: debouncedSearch.trim() || undefined,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const categories = data || [];

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteMutation.mutateAsync(categoryToDelete.id);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setCategoryToDelete(null);
    }
  };

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
          onDelete={() => setCategoryToDelete(row.original)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPagination();
        }}
        searchPlaceholder="Search categories..."
        filters={[
          {
            key: "level",
            label: "Level",
            value: levelFilter,
            placeholder: "Category level",
            onChange: (value) => {
              setLevelFilter(value as "ALL" | "TOP" | "SUB");
              resetPagination();
            },
            options: [
              { label: "All levels", value: "ALL" },
              { label: "Categories only", value: "TOP" },
              { label: "Sub categories only", value: "SUB" },
            ],
          },
          {
            key: "type",
            label: "Type",
            value: typeFilter,
            placeholder: "Category type",
            onChange: (value) => {
              setTypeFilter(value);
              resetPagination();
            },
            options: [
              { label: "All types", value: "ALL" },
              { label: "Products", value: ITEM_TYPE.PRODUCT },
              { label: "Services", value: ITEM_TYPE.SERVICE },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setLevelFilter("ALL");
          setTypeFilter("ALL");
          resetPagination();
        }}
      />
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

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category &quot;{categoryToDelete?.name}&quot; and remove its data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
