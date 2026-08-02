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
import { NumericInput } from "@/components/ui/numeric-input";
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
import { useEffect, useMemo, useState } from "react";
import { BrandSearchAutocomplete } from "@/components/autocompletes/brand-search-autocomplete";
import { CategorySearchAutocomplete } from "@/components/autocompletes/category-search-autocomplete";
import { SpecificationSearchAutocomplete } from "@/components/autocompletes/specification-search-autocomplete";
import { RoomSearchAutocomplete } from "@/components/autocompletes/room-search-autocomplete";
import { ITEM_TYPE, UNIT_TYPE_LABELS } from "@/constants/enums";
import { Checkbox } from "@/components/ui/checkbox";
import {
  filterUnitTypes,
  UNIT_TYPES,
  UnitType,
} from "@/constants/quantities";
import { useLanguage } from "@/hooks/useLanguage";

export function ItemForm() {
  const [unitSearch, setUnitSearch] = useState("");
  const { t } = useLanguage();
  const { isCreateOpen, setCreateOpen, isEditOpen, setEditOpen, selectedItem } =
    useItemStore();
  // Create/Update mutations
  const createMutation = useCreateItemMutation();
  const updateMutation = useUpdateItemMutation();

  const isOpen = isCreateOpen || isEditOpen;
  const isEditing = isEditOpen && !!selectedItem;
  const visibleUnitTypes = useMemo(
    () => filterUnitTypes(UNIT_TYPES, unitSearch),
    [unitSearch],
  );

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
      const normalizedHSNCode = normalizeHsnCode(value.HSNCode);
      const isService = value.type === ITEM_TYPE.SERVICE;
      const payload = {
        ...value,
        HSNCode: normalizedHSNCode.length > 0 ? normalizedHSNCode : null,
        brandId: isService ? (value.brandId || null) : value.brandId,
        roomId: isService ? (value.roomId || null) : value.roomId,
      };

      try {
        if (isEditing) {
          await updateMutation.mutateAsync({ ...payload, id: selectedItem.id });
          setEditOpen(false);
          form.reset();
          setUnitSearch("");
          toast.success("Item updated successfully");
        } else {
          await createMutation.mutateAsync(payload);
          setCreateOpen(false);
          form.reset();
          setUnitSearch("");
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
        HSNCode: selectedItem.HSNCode || "",
        GSTPercentage: selectedItem.GSTPercentage,
        categoryId: selectedItem.categoryId,
        brandId: selectedItem.brandId || "",
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
    if (!open) setUnitSearch("");
    if (isEditing) {
      setEditOpen(open);
    } else {
      setCreateOpen(open);
    }
  };

  const normalizeHsnCode = (value: string) => value.replace(/\D/g, "");

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
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
                  Name <span className="text-red-500">*</span>
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
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
                  Description <span className="text-red-500">*</span>
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
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
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
          <form.Subscribe selector={(state) => [state.values.type]}>
            {([itemType]) => (
              <form.Field
                name="HSNCode"
                validators={{
                  onChange: ({ value }) => {
                    if (itemType === ITEM_TYPE.SERVICE && !value) {
                      return "SAC Code is required for services";
                    }
                    if (!value) return undefined;
                    return /^\d+$/.test(value)
                      ? undefined
                      : `${itemType === ITEM_TYPE.SERVICE ? "SAC Code" : "HSN Code"} must contain numbers only`;
                  },
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                    <Label htmlFor={field.name} className="sm:text-right">
                      {itemType === ITEM_TYPE.SERVICE ? (
                        <>
                          SAC Code <span className="text-red-500">*</span>
                        </>
                      ) : (
                        "HSN Code"
                      )}
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(normalizeHsnCode(e.target.value))
                        }
                        className="col-span-3"
                        required={itemType === ITEM_TYPE.SERVICE}
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
            )}
          </form.Subscribe>

          {/* GST Percentage */}
          <form.Field
            name="GSTPercentage"
            validators={{
              onChange: ({ value }) =>
                value < 0 ? "GST cannot be negative" : undefined,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
                  GST % <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <NumericInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    className="col-span-3"
                    fallbackValue={0}
                    min={0}
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
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
                  Category <span className="text-red-500">*</span>
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
          <form.Subscribe selector={(state) => [state.values.type]}>
            {([itemType]) => (
              <form.Field
                name="brandId"
                validators={{
                  onChange: ({ value }) => {
                    if (itemType === ITEM_TYPE.PRODUCT && !value) {
                      return "Brand is required";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                    <Label htmlFor={field.name} className="sm:text-right">
                      Brand {itemType === ITEM_TYPE.PRODUCT && <span className="text-red-500">*</span>}
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
            )}
          </form.Subscribe>

          {/* Specification */}
          <form.Field
            name="specificationId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Specification is required" : undefined,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
                  Specification <span className="text-red-500">*</span>
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
              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
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
                      <Input
                        value={unitSearch}
                        onChange={(event) => setUnitSearch(event.target.value)}
                        placeholder={t("acceptable_unit_search_placeholder")}
                        aria-label="Search acceptable unit types"
                      />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {t("unit_results_count", {
                            visible: visibleUnitTypes.length,
                            total: UNIT_TYPES.length,
                          })}
                        </span>
                        <span>
                          {t("unit_selected_count", {
                            count: field.state.value.length,
                          })}
                        </span>
                      </div>
                      <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto rounded-lg border bg-muted/30 p-3 pr-2">
                        {visibleUnitTypes.map((unit) => (
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
                        {visibleUnitTypes.length === 0 && (
                          <p className="col-span-2 py-6 text-center text-xs text-muted-foreground">
                            {t("unit_no_matches")}
                          </p>
                        )}
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
