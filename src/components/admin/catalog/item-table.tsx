"use client";

import {
  useBrandsQuery,
  useCategoriesQuery,
  useDeleteItemMutation,
  useItemsQuery,
  useSpecificationsQuery,
} from "@/queries/catalogQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Item } from "@/types/catalog";
import { ITEM_TYPE } from "@/constants/enums";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { ActionColumn } from "./action-column";
import { useItemStore } from "@/store/itemStore";
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

export function ItemTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [specificationFilter, setSpecificationFilter] = useState("ALL");
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const { setEditOpen } = useItemStore();

  const { data: categories = [] } = useCategoriesQuery({ perPage: 1000 });
  const { data: brands = [] } = useBrandsQuery({ perPage: 1000 });
  const { data: specifications = [] } = useSpecificationsQuery({
    perPage: 1000,
  });
  const deleteMutation = useDeleteItemMutation();

  const { data, isLoading } = useItemsQuery({
    search: debouncedSearch.trim() || undefined,
    type: typeFilter === "ALL" ? undefined : (typeFilter as ITEM_TYPE),
    categoryId: categoryFilter === "ALL" ? undefined : categoryFilter,
    brandId: brandFilter === "ALL" ? undefined : brandFilter,
    specificationId:
      specificationFilter === "ALL" ? undefined : specificationFilter,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const items = data || [];

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    } finally {
      setItemToDelete(null);
    }
  };

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
      id: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) return "-";
        const isSubCategory = category.parentCategoryId || category.parentCategory;
        if (isSubCategory) {
          if (category.parentCategory?.name) return category.parentCategory.name;
          if (category.parentCategoryId) {
            const parent = categories.find((c) => c.id === category.parentCategoryId);
            return parent?.name || "-";
          }
          return "-";
        }
        return category.name;
      },
    },
    {
      accessorKey: "category.name",
      header: "Sub Category",
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) return "-";
        const isSubCategory = category.parentCategoryId || category.parentCategory;
        if (isSubCategory) {
          return category.name;
        }
        return "-";
      },
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
          onDelete={() => setItemToDelete(row.original)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <AdminTableToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            resetPagination();
          }}
          searchPlaceholder="Search items..."
          filters={[
            {
              key: "type",
              label: "Type",
              value: typeFilter,
              placeholder: "Item type",
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
            {
              key: "category",
              label: "Category",
              value: categoryFilter,
              placeholder: "Category",
              onChange: (value) => {
                setCategoryFilter(value);
                resetPagination();
              },
              options: [
                { label: "All categories", value: "ALL" },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                })),
              ],
            },
            {
              key: "brand",
              label: "Brand",
              value: brandFilter,
              placeholder: "Brand",
              onChange: (value) => {
                setBrandFilter(value);
                resetPagination();
              },
              options: [
                { label: "All brands", value: "ALL" },
                ...brands.map((brand) => ({
                  label: brand.name,
                  value: brand.id,
                })),
              ],
            },
            {
              key: "specification",
              label: "Specification",
              value: specificationFilter,
              placeholder: "Specification",
              onChange: (value) => {
                setSpecificationFilter(value);
                resetPagination();
              },
              options: [
                { label: "All specifications", value: "ALL" },
                ...specifications.map((specification) => ({
                  label: specification.name,
                  value: specification.id,
                })),
              ],
            },
          ]}
          onClear={() => {
            setSearch("");
            setTypeFilter("ALL");
            setCategoryFilter("ALL");
            setBrandFilter("ALL");
            setSpecificationFilter("ALL");
            resetPagination();
          }}
        />
      </div>
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

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item &quot;{itemToDelete?.name}&quot; and remove its data from our
              servers.
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
    </>
  );
}
