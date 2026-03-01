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
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { useCategoryStore } from "@/store/categoryStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "@/components/shared/upload/media-uploader";
import { CategorySearchAutocomplete } from "@/components/autocompletes/category-search-autocomplete";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CreateCategoryRequest } from "@/types/catalog";
import { Switch } from "@/components/ui/switch";
import { ITEM_TYPE } from "@/constants/enums";

export function CategoryForm() {
  const {
    isCreateOpen,
    setCreateOpen,
    isEditOpen,
    setEditOpen,
    selectedCategory,
  } = useCategoryStore();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isOpen = isCreateOpen || isEditOpen;
  const isEditing = isEditOpen && !!selectedCategory;

  const form = useForm({
    defaultValues: {
      name: selectedCategory?.name || "",
      type: selectedCategory?.type || ITEM_TYPE.PRODUCT,
      isSubCategory: !!selectedCategory?.parentCategoryId,
      parentCategoryId: selectedCategory?.parentCategoryId || "",
      categoryIconId: selectedCategory?.categoryIconId || "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        parentCategoryId: value.isSubCategory ? value.parentCategoryId : null,
      };

      if (isEditing) {
        updateMutation.mutate(
          { ...payload, id: selectedCategory.id },
          {
            onSuccess: () => {
              setEditOpen(false);
              form.reset();
              toast.success("Category updated successfully");
            },
            onError: (error) => {
              const msg =
                error instanceof ApiError
                  ? error.message
                  : "Failed to update category";
              toast.error(msg);
            },
          },
        );
      } else {
        createMutation.mutate(payload as CreateCategoryRequest, {
          onSuccess: () => {
            setCreateOpen(false);
            form.reset();
            toast.success("Category created successfully");
          },
          onError: (error) => {
            const msg =
              error instanceof ApiError
                ? error.message
                : "Failed to create category";
            toast.error(msg);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        name: selectedCategory.name,
        type: selectedCategory.type,
        isSubCategory: !!selectedCategory.parentCategoryId,
        parentCategoryId: selectedCategory.parentCategoryId || "",
        categoryIconId: selectedCategory.categoryIconId || "",
      });
    } else {
      form.reset({
        name: "",
        type: ITEM_TYPE.PRODUCT,
        isSubCategory: false,
        parentCategoryId: "",
        categoryIconId: "",
      });
    }
  }, [isEditing, selectedCategory, form]);

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
          <Button onClick={() => setCreateOpen(true)}>Add Category</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update category information."
              : "Create a new category or sub-category."}
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

          <form.Field name="categoryIconId">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Icon
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  {(previewUrl || selectedCategory?.categoryIcon?.url) && (
                    <div className="relative size-16 overflow-hidden rounded-md border">
                      <Image
                        src={
                          previewUrl ||
                          selectedCategory?.categoryIcon?.url ||
                          ""
                        }
                        alt="Icon Preview"
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
                      label={field.state.value ? "Change Icon" : "Upload Icon"}
                    />
                  </div>
                  {field.state.value && !previewUrl && (
                    <span className="text-sm text-green-600 font-medium">
                      {isEditing ? "Current Icon" : "Icon Uploaded"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="type">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as ITEM_TYPE)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ITEM_TYPE.PRODUCT}>Product</SelectItem>
                      <SelectItem value={ITEM_TYPE.SERVICE}>Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="isSubCategory">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Is Sub-category
                </Label>
                <div className="col-span-3">
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </div>
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.values.isSubCategory]}>
            {([isSubCategory]) =>
              isSubCategory ? (
                <form.Field
                  name="parentCategoryId"
                  validators={{
                    onChange: ({ value }) =>
                      isSubCategory && !value
                        ? "Parent Category is required"
                        : undefined,
                  }}
                >
                  {(field) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={field.name} className="text-right">
                        Parent
                      </Label>
                      <div className="col-span-3">
                        <CategorySearchAutocomplete
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          placeholder="Select parent"
                          label="Parent Category"
                          additionalParams={{ isSubCategory: false }}
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
              ) : null
            }
          </form.Subscribe>

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
                      ? "Update Category"
                      : "Create Category"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
