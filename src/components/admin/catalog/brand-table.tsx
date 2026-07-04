"use client";

import {
  useBrandsQuery,
  useDeleteBrandMutation,
} from "@/queries/catalogQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Brand } from "@/types/catalog";
import { format } from "date-fns";
import Image from "next/image";

import { ActionColumn } from "./action-column";
import { useBrandStore } from "@/store/brandStore";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function BrandTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const { setEditOpen } = useBrandStore();

  const deleteMutation = useDeleteBrandMutation();

  const { data, isLoading } = useBrandsQuery({
    search: debouncedSearch.trim() || undefined,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const brands = data || [];

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;

    try {
      await deleteMutation.mutateAsync(brandToDelete.id);
      toast.success("Brand deleted successfully");
    } catch (error) {
      toast.error("Failed to delete brand");
      console.error(error);
    } finally {
      setBrandToDelete(null);
    }
  };

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      id: "logo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Logo" />
      ),
      cell: ({ row }) => {
        const logoUrl = row.original.brandLogo?.url;

        if (!logoUrl) return "-";

        return (
          <Dialog
            open={previewLogoUrl === logoUrl}
            onOpenChange={(open) => setPreviewLogoUrl(open ? logoUrl : null)}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setPreviewLogoUrl(logoUrl)}
                className="inline-flex size-10 items-center justify-center overflow-hidden rounded-md border bg-muted/20"
              >
                <Image
                  src={logoUrl}
                  alt={row.original.name}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="w-auto max-w-none gap-0 border-0 bg-transparent p-0 shadow-none data-[state=open]:zoom-in-95"
            >
              <Image
                src={logoUrl}
                alt={row.original.name}
                width={720}
                height={720}
                className="max-h-[90vh] w-auto max-w-[90vw] rounded-none object-contain"
              />
            </DialogContent>
          </Dialog>
        );
      },
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
          onDelete={() => setBrandToDelete(row.original)}
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
          searchPlaceholder="Search brands..."
          onClear={() => {
            setSearch("");
            resetPagination();
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={brands}
        pageCount={-1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={isLoading}
      />

      <AlertDialog
        open={!!brandToDelete}
        onOpenChange={(open) => !open && setBrandToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              brand &quot;{brandToDelete?.name}&quot; and remove its data from
              our servers.
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
