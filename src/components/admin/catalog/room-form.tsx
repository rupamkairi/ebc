"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateRoomMutation,
  useUpdateRoomMutation,
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { useRoomStore } from "@/store/roomStore";
import { useEffect } from "react";
import { CreateRoomRequest } from "@/types/catalog";

export function RoomForm() {
  const {
    isCreateOpen,
    setCreateOpen,
    isEditOpen,
    setEditOpen,
    selectedRoom,
  } = useRoomStore();
  const createMutation = useCreateRoomMutation();
  const updateMutation = useUpdateRoomMutation();

  const isOpen = isCreateOpen || isEditOpen;
  const isEditing = isEditOpen && !!selectedRoom;

  const form = useForm({
    defaultValues: {
      name: selectedRoom?.name || "",
      staticId: selectedRoom?.staticId || "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        staticId: value.staticId.toUpperCase(),
      };

      if (isEditing) {
        updateMutation.mutate(
          { ...payload, id: selectedRoom.id },
          {
            onSuccess: () => {
              setEditOpen(false);
              form.reset();
              toast.success("Room updated successfully");
            },
            onError: (error) => {
              const msg =
                error instanceof ApiError
                  ? error.message
                  : "Failed to update room";
              toast.error(msg);
            },
          }
        );
      } else {
        createMutation.mutate(payload as CreateRoomRequest, {
          onSuccess: () => {
            setCreateOpen(false);
            form.reset();
            toast.success("Room created successfully");
          },
          onError: (error) => {
            const msg =
              error instanceof ApiError
                ? error.message
                : "Failed to create room";
            toast.error(msg);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        name: selectedRoom.name,
        staticId: selectedRoom.staticId,
      });
    } else {
      form.reset({
        name: "",
        staticId: "",
      });
    }
  }, [isEditing, selectedRoom, form]);

  const handleOpenChange = (open: boolean) => {
    if (isEditing) {
      setEditOpen(open);
    } else {
      setCreateOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button onClick={() => setCreateOpen(true)}>Add Room</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Room" : "Add Room"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update room information."
              : "Create a new room for grouping categories and items."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-4 py-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value.length < 2
                  ? "Name must be at least 2 characters"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field
            name="staticId"
            validators={{
              onChange: ({ value }) =>
                value.length < 2
                  ? "Static ID must be at least 2 characters"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Static ID
                </Label>
                <div className="col-span-3">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. MATERIAL_DEPOT"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Used for URL filtering. Will be converted to UPPERCASE.
                  </p>
                  {field.state.meta.errors ? (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                      ? "Update Room"
                      : "Create Room"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
