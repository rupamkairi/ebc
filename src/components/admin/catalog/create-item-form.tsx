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
  useCreateItemMutation,
  useUpdateItemMutation,
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { useItemStore } from "@/store/itemStore";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { BrandSearchAutocomplete } from "@/components/autocompletes/brand-search-autocomplete";
import { CategorySearchAutocomplete } from "@/components/autocompletes/category-search-autocomplete";
import { SpecificationSearchAutocomplete } from "@/components/autocompletes/specification-search-autocomplete";

export function ItemForm() {
  const { isCreateOpen, setCreateOpen, isEditOpen, setEditOpen, selectedItem } =
    useItemStore();
  // Create/Update mutations
  const createMutation = useCreateItemMutation();
  const updateMutation = useUpdateItemMutation();

  const isOpen = isCreateOpen || isEditOpen;
  const isEditing = isEditOpen && !!selectedItem;

  const form = useForm({
    defaultValues: {
      name: selectedItem?.name || "",
      description: selectedItem?.description || "",
      type: selectedItem?.type || "PRODUCT",
      HSNCode: selectedItem?.HSNCode || "",
      GSTPercentage: selectedItem?.GSTPercentage || 0,
      categoryId: selectedItem?.categoryId || "",
      brandId: selectedItem?.brandId || "",
      specificationId: selectedItem?.specificationId || "",
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        updateMutation.mutate(
          { ...value, id: selectedItem.id },
          {
            onSuccess: () => {
              setEditOpen(false);
              form.reset();
              toast.success("Item updated successfully");
            },
            onError: (error) => {
              const msg =
                error instanceof ApiError
                  ? error.message
                  : "Failed to update item";
              toast.error(msg);
            },
          }
        );
      } else {
        createMutation.mutate(value, {
          onSuccess: () => {
            setCreateOpen(false);
            form.reset();
            toast.success("Item created successfully");
          },
          onError: (error) => {
            const msg =
              error instanceof ApiError
                ? error.message
                : "Failed to create item";
            toast.error(msg);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        name: selectedItem.name,
        description: selectedItem.description,
        type: selectedItem.type,
        HSNCode: selectedItem.HSNCode,
        GSTPercentage: selectedItem.GSTPercentage,
        categoryId: selectedItem.categoryId,
        brandId: selectedItem.brandId,
        specificationId: selectedItem.specificationId,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        type: "PRODUCT",
        HSNCode: "",
        GSTPercentage: 0,
        categoryId: "",
        brandId: "",
        specificationId: "",
      });
    }
  }, [isEditing, selectedItem, form]);

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
          <Button onClick={() => setCreateOpen(true)}>Add Item</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update item information."
              : "Create a new catalog item."}
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
          {/* Name */}
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

          {/* Description */}
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
                    required
                  />
                </div>
              </div>
            )}
          </form.Field>

          {/* Type */}
          <form.Field name="type">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUCT">Product</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form.Field>

          {/* HSN Code */}
          <form.Field
            name="HSNCode"
            validators={{
              onChange: ({ value }) =>
                !value ? "HSN Code is required" : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  HSN Code
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

          {/* GST Percentage */}
          <form.Field
            name="GSTPercentage"
            validators={{
              onChange: ({ value }) =>
                value < 0 ? "GST cannot be negative" : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  GST %
                </Label>
                <div className="col-span-3">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value))
                    }
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
            )}
          </form.Field>

          {/* Category */}
          <form.Field
            name="categoryId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Category is required" : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <CategorySearchAutocomplete
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    placeholder="Search category"
                    label="Select category"
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

          {/* Brand */}
          <form.Field
            name="brandId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Brand is required" : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Brand
                </Label>
                <div className="col-span-3">
                  <BrandSearchAutocomplete
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    placeholder="Search brand"
                    label="Select brand"
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

          {/* Specification */}
          <form.Field
            name="specificationId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Specification is required" : undefined,
            }}
          >
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Specification
                </Label>
                <div className="col-span-3">
                  <SpecificationSearchAutocomplete
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    placeholder="Search specification"
                    label="Select specification"
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
                    ? "Update Item"
                    : "Create Item"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
