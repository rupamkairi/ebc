"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Product } from "@/queries/browse.queries";
import { toast } from "sonner";

interface AddToAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess?: () => void;
}

export function AddToAppointmentModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: AddToAppointmentModalProps) {
  const setAppointmentItem = useAppointmentStore(
    (state) => state.setAppointmentItem,
  );

  const handleConfirm = () => {
    setAppointmentItem({
      itemId: product.id,
      title: product.title,
      type: product.type.toLowerCase() as "service",
      price: product.price,
      description: product.description,
      image: product.image,
    });

    toast.success("Item set for appointment");
    onClose();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            You are creating an appointment for:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <h3 className="font-semibold text-lg">{product.title}</h3>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
