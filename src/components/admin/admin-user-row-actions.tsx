"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { AdminUser } from "@/types/auth";
import { useDeleteUserMutation } from "@/queries/adminQueries";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

type AdminTableRole = "ADMIN_MANAGER" | "ADMIN_ACCOUNTANT" | "ADMIN_EXECUTIVE";

interface AdminUserRowActionsProps {
  user: AdminUser;
  canEdit: boolean;
  canDelete: boolean;
}

export function AdminUserRowActions({
  user,
  canEdit,
  canDelete,
}: AdminUserRowActionsProps) {
  const router = useRouter();
  const deleteMutation = useDeleteUserMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success("Admin account deleted successfully.");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete admin account.",
      );
    }
  };

  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="size-4" />
              <span className="sr-only">Open actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {canEdit && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/admin-dashboard/users/${user.id}/edit`)}
              >
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete admin account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will anonymize {user.name || "this account"} and revoke the
              user&apos;s access. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function getAdminUserRowActionsPermission(
  currentRole: string | undefined,
  targetRole: AdminTableRole,
) {
  const role = currentRole?.toUpperCase();

  if (targetRole === "ADMIN_EXECUTIVE") {
    return {
      canEdit: role === "ADMIN" || role === "ADMIN_MANAGER",
      canDelete: role === "ADMIN",
    };
  }

  return {
    canEdit: role === "ADMIN",
    canDelete: role === "ADMIN",
  };
}
