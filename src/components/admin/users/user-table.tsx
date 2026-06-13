"use client";

import { useState } from "react";
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
import {
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  PauseCircle,
  Edit,
  Building2,
  Trash2,
} from "lucide-react";
import { AdminUser } from "@/types/auth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDeleteUserMutation } from "@/queries/adminQueries";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const router = useRouter();
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const deleteMutation = useDeleteUserMutation();

  const handleDeleteAccount = () => {
    if (!userToDelete) return;

    deleteMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success("Account anonymized and access revoked.");
        setUserToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete account.");
      },
    });
  };

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
                "border-amber-500 text-amber-600 hover:bg-amber-50",
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/admin-dashboard/users/${user.id}/edit`)
                  }
                  className="cursor-pointer"
                >
                  <Edit className="size-4 mr-2" />
                  Edit User Profile
                </DropdownMenuItem>
                {entity && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/admin-dashboard/entities/${entity.id}/edit`,
                        )
                      }
                      className="cursor-pointer"
                    >
                      <Building2 className="size-4 mr-2" />
                      Edit Business Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-bold  text-muted-foreground/60 px-2 py-1.5">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setUserToDelete(user)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
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

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setUserToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will anonymize {userToDelete?.name || "this user"}, remove
              their login credentials, revoke active sessions, and keep existing
              history for audit. Seller or provider entities will be paused and
              excluded from future assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                handleDeleteAccount();
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
