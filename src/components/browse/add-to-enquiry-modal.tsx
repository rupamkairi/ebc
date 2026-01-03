"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnquiryStore, UNIT_TYPE } from "@/store/enquiryStore";
import { Product } from "@/queries/browse.queries";
import { toast } from "sonner";

interface AddToEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function AddToEnquiryModal({
  isOpen,
  onClose,
  product,
}: AddToEnquiryModalProps) {
  const [quantity, setQuantity] = useState("1");
  const [remarks, setRemarks] = useState("");
  const [unit, setUnit] = useState<UNIT_TYPE>(UNIT_TYPE.Piece);
  const addItem = useEnquiryStore((state) => state.addItem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }

    addItem({
      itemId: product.id,
      title: product.title,
      type: product.type,
      quantity: qty,
      remarks: remarks,
      unit: unit,
      price: product.price,
    });

    toast.success("Added to enquiry");
    onClose();
    // Reset form
    setQuantity("1");
    setRemarks("");
    setUnit(UNIT_TYPE.Piece);
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
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1"
              />
              <Select
                value={unit}
                onValueChange={(val) => setUnit(val as UNIT_TYPE)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UNIT_TYPE).map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
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
