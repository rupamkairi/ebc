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
  useCreateSpecificationMutation,
  useUpdateSpecificationMutation,
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { useSpecificationStore } from "@/store/specificationStore";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export function SpecificationForm() {
  const {
    isCreateOpen,
    setCreateOpen,
    isEditOpen,
    setEditOpen,
    selectedSpecification,
  } = useSpecificationStore();
  const createMutation = useCreateSpecificationMutation();
  const updateMutation = useUpdateSpecificationMutation();

  const isOpen = isCreateOpen || isEditOpen;
  const isEditing = isEditOpen && !!selectedSpecification;

  const form = useForm({
    defaultValues: {
      name: selectedSpecification?.name || "",
      description: selectedSpecification?.description || "",
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        updateMutation.mutate(
          { ...value, id: selectedSpecification.id },
          {
            onSuccess: () => {
              setEditOpen(false);
              form.reset();
              toast.success("Specification updated successfully");
            },
            onError: (error) => {
              const msg =
                error instanceof ApiError
                  ? error.message
                  : "Failed to update specification";
              toast.error(msg);
            },
          }
        );
      } else {
        createMutation.mutate(value, {
          onSuccess: () => {
            setCreateOpen(false);
            form.reset();
            toast.success("Specification created successfully");
          },
          onError: (error) => {
            const msg =
              error instanceof ApiError
                ? error.message
                : "Failed to create specification";
            toast.error(msg);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        name: selectedSpecification.name,
        description: selectedSpecification.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [isEditing, selectedSpecification, form]);

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
          <Button onClick={() => setCreateOpen(true)}>Add Specification</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Specification" : "Add Specification"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update specification information."
              : "Create a new specification."}
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
                    className="col-span-3"
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

          <form.Field name="description">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="col-span-3"
                  />
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
                    ? "Update Specification"
                    : "Create Specification"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
