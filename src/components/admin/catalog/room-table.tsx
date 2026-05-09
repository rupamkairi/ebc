"use client";

import {
  useRoomsQuery,
  useDeleteRoomMutation,
} from "@/queries/catalogQueries";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Room } from "@/types/catalog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { ActionColumn } from "./action-column";
import { useRoomStore } from "@/store/roomStore";
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

export function RoomTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const { setEditOpen } = useRoomStore();

  const deleteMutation = useDeleteRoomMutation();

  const { data, isLoading } = useRoomsQuery();

  const rooms = data || [];

  const handleDelete = async () => {
    if (!roomToDelete) return;

    try {
      await deleteMutation.mutateAsync(roomToDelete.id);
      toast.success("Room deleted successfully");
    } catch (error) {
      toast.error("Failed to delete room");
      console.error(error);
    } finally {
      setRoomToDelete(null);
    }
  };

  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "staticId",
      header: "Static ID",
      cell: ({ row }) => <Badge variant="secondary">{row.original.staticId}</Badge>,
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
          onDelete={() => setRoomToDelete(row.original)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={rooms}
        pageCount={-1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={isLoading}
      />

      <AlertDialog
        open={!!roomToDelete}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              room &quot;{roomToDelete?.name}&quot; and remove its data
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
