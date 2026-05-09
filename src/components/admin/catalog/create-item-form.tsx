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
import { RoomSearchAutocomplete } from "@/components/autocompletes/room-search-autocomplete";
import { ITEM_TYPE, UNIT_TYPE, UNIT_TYPE_LABELS } from "@/constants/enums";
import { Checkbox } from "@/components/ui/checkbox";
import { UNIT_TYPES, UnitType } from "@/constants/quantities";

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
      type: selectedItem?.type || ITEM_TYPE.PRODUCT,
      HSNCode: selectedItem?.HSNCode || "",
      GSTPercentage: selectedItem?.GSTPercentage || 0,
      categoryId: selectedItem?.categoryId || "",
      brandId: selectedItem?.brandId || "",
      specificationId: selectedItem?.specificationId || "",
      roomId: selectedItem?.roomId || "",
      acceptableUnitTypes: (selectedItem?.acceptableUnitTypes as UnitType[]) || [],
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({ ...value, id: selectedItem.id });
          setEditOpen(false);
          form.reset();
          toast.success("Item updated successfully");
        } else {
          await createMutation.mutateAsync(value);
          setCreateOpen(false);
          form.reset();
          toast.success("Item created successfully");
        }
      } catch (error) {
        const msg =
          error instanceof ApiError
            ? error.message
            : isEditing
              ? "Failed to update item"
              : "Failed to create item";
        toast.error(msg);
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
        roomId: selectedItem.roomId || "",
        acceptableUnitTypes: (selectedItem.acceptableUnitTypes as UnitType[]) || [],
      });
    } else {
      form.reset({
        name: "",
        description: "",
        type: ITEM_TYPE.PRODUCT,
        HSNCode: "",
        GSTPercentage: 0,
        categoryId: "",
        brandId: "",
        specificationId: "",
        roomId: "",
        acceptableUnitTypes: [],
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

          {/* Room */}
          <form.Field name="roomId">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  Room
                </Label>
                <div className="col-span-3">
                  <RoomSearchAutocomplete
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    placeholder="Search room"
                    label="Select room"
                  />
                </div>
              </div>
            )}
          </form.Field>

          {/* Acceptable Unit Types - Only for Products */}
          <form.Subscribe selector={(state) => [state.values.type]}>
            {([type]) =>
              type === ITEM_TYPE.PRODUCT && (
                <form.Field name="acceptableUnitTypes">
                  {(field) => (
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm font-bold">
                        Acceptable Unit Types
                      </Label>
                      <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-muted/30">
                        {UNIT_TYPES.map((unit) => (
                          <div
                            key={unit}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`unit-${unit}`}
                              checked={field.state.value.includes(unit)}
                              onCheckedChange={(checked) => {
                                const current = [...field.state.value];
                                if (checked) {
                                  field.handleChange([...current, unit]);
                                } else {
                                  field.handleChange(
                                    current.filter((u) => u !== unit),
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`unit-${unit}`}
                              className="text-xs font-medium cursor-pointer"
                            >
                              {UNIT_TYPE_LABELS[unit]}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Select which units sellers can use when listing this
                        item.
                      </p>
                    </div>
                  )}
                </form.Field>
              )
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
