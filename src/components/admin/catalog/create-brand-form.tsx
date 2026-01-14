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
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { useBrandStore } from "@/store/brandStore";
import { MediaUploader } from "@/components/upload/media-uploader";
import { useEffect, useState } from "react";
import Image from "next/image";

export function BrandForm() {
  const {
    isCreateOpen,
    setCreateOpen,
    isEditOpen,
    setEditOpen,
    selectedBrand,
  } = useBrandStore();
  const createMutation = useCreateBrandMutation();
  const updateMutation = useUpdateBrandMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isOpen = isCreateOpen || isEditOpen;
  const isEditing = isEditOpen && !!selectedBrand;

  const form = useForm({
    defaultValues: {
      name: selectedBrand?.name || "",
      brandLogoId: selectedBrand?.brandLogoId || "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({ ...value, id: selectedBrand.id });
          setEditOpen(false);
          form.reset();
          toast.success("Brand updated successfully");
        } else {
          await createMutation.mutateAsync(value);
          setCreateOpen(false);
          form.reset();
          toast.success("Brand created successfully");
        }
      } catch (error) {
        const msg =
          error instanceof ApiError
            ? error.message
            : isEditing
            ? "Failed to update brand"
            : "Failed to create brand";
        toast.error(msg);
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        name: selectedBrand.name,
        brandLogoId: selectedBrand.brandLogoId || "",
      });
    } else {
      form.reset({
        name: "",
        brandLogoId: "",
      });
    }
  }, [isEditing, selectedBrand, form]);

  const handleOpenChange = (open: boolean) => {
    if (isEditing) {
      setEditOpen(open);
    } else {
      setCreateOpen(open);
    }
    if (!open) setPreviewUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button onClick={() => setCreateOpen(true)}>Add Brand</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Brand" : "Add Brand"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update brand information." : "Create a new brand."}
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

          <form.Field name="brandLogoId">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Logo
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  {(previewUrl || selectedBrand?.brandLogo?.url) && (
                    <div className="relative size-16 overflow-hidden rounded-md border">
                      <Image
                        src={previewUrl || selectedBrand?.brandLogo?.url || ""}
                        alt="Logo Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <MediaUploader
                      onUploadSuccess={(uploadedFiles) => {
                        if (uploadedFiles.length > 0) {
                          field.handleChange(uploadedFiles[0].id);
                          setPreviewUrl(uploadedFiles[0].url);
                        }
                      }}
                      variant="single"
                      crop={true}
                      label={field.state.value ? "Change Logo" : "Upload Logo"}
                    />
                  </div>
                  {field.state.value && !previewUrl && (
                    <span className="text-sm text-green-600 font-medium">
                      {isEditing ? "Current Logo" : "Logo Uploaded"}
                    </span>
                  )}
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
                    ? "Update Brand"
                    : "Create Brand"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
