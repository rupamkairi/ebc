"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnquiryStore } from "@/store/enquiryStore";
import { Product } from "@/queries/browse.queries";
import { useItemQuery } from "@/queries/catalogQueries";
import { toast } from "sonner";
import {
  UNIT_TYPE,
  UNIT_TYPE_LABELS,
  UNIT_TYPES,
  UnitType,
} from "@/constants/quantities";

interface AddToEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess?: () => void;
}

export function AddToEnquiryModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: AddToEnquiryModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [unitType, setUnitType] = useState<UnitType>(UNIT_TYPE.Nos);
  const addItem = useEnquiryStore((state) => state.addItem);
  const {
    data: latestItem,
    isFetching: isFetchingLatestItem,
    refetch: refetchLatestItem,
  } = useItemQuery(product.id, { enabled: isOpen });
  React.useEffect(() => {
    if (isOpen) {
      void refetchLatestItem();
    }
  }, [isOpen, product.id, refetchLatestItem]);

  const fetchedUnitTypes = latestItem?.acceptableUnitTypes;
  const rawAllowedUnits =
    fetchedUnitTypes !== undefined
      ? fetchedUnitTypes
      : product.acceptableUnitTypes;
  const allowedUnits = useMemo(
    () =>
      (rawAllowedUnits ?? []).filter(
        (unit): unit is UnitType => Boolean(unit),
      ),
    [rawAllowedUnits],
  );
  const isWaitingForLatestUnits = isOpen && !latestItem && isFetchingLatestItem;
  const hasUnitRestriction = allowedUnits.length > 0;
  const visibleUnits = useMemo(
    () =>
      isWaitingForLatestUnits
        ? []
        : hasUnitRestriction
          ? UNIT_TYPES.filter((unit) => allowedUnits.includes(unit))
          : UNIT_TYPES,
    [allowedUnits, hasUnitRestriction, isWaitingForLatestUnits],
  );
  const selectableUnits = useMemo(
    () =>
      hasUnitRestriction
        ? UNIT_TYPES.filter((unit) => allowedUnits.includes(unit))
        : UNIT_TYPES,
    [allowedUnits, hasUnitRestriction],
  );
  const effectiveUnitType =
    !selectableUnits.includes(unitType) && selectableUnits.length > 0
      ? selectableUnits[0]
      : unitType;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(quantity) || quantity < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (
      isWaitingForLatestUnits ||
      !selectableUnits.includes(effectiveUnitType)
    ) {
      toast.error("Please select an allowed unit for this item");
      return;
    }

    addItem({
      itemId: product.id,
      title: product.title,
      type: product.type,
      quantity,
      remarks: remarks,
      unitType: effectiveUnitType,
      price: product.price,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      categoryName: product.categoryName,
      subCategoryName: product.subCategoryName,
    });

    toast.success("Added to enquiry");
    onClose();
    setQuantity(1);
    setRemarks("");
    setUnitType(selectableUnits[0] ?? UNIT_TYPE.Nos);
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Enquiry</DialogTitle>
          <DialogDescription>
            Add {product.title} to your enquiry list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <div className="col-span-3 flex gap-2">
              <NumericInput
                id="quantity"
                min="1"
                value={quantity}
                onValueChange={setQuantity}
                integer
                fallbackValue={1}
                className="flex-1"
              />
              <Select
                value={effectiveUnitType}
                onValueChange={(val) => setUnitType(val as UnitType)}
                disabled={isWaitingForLatestUnits}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue
                    placeholder={isWaitingForLatestUnits ? "Loading..." : "Unit"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {visibleUnits.map((u) => (
                    <SelectItem key={u} value={u}>
                      {UNIT_TYPE_LABELS[u]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remarks" className="text-right">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="col-span-3"
              placeholder="Any specific requirements?"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add to Enquiry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
