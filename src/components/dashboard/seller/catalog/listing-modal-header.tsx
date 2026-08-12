"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IndianRupee, MapPin, Package } from "lucide-react";

interface ListingModalHeaderProps {
  step: number;
}

export function ListingModalHeader({ step }: ListingModalHeaderProps) {
  const titles = ["Select Item", "Listing Details", "Service Areas"];
  const descriptions = [
    "Pick an item from the master catalog",
    "Define your quantity and unit types",
    "Select where you can deliver or provide service",
  ];

  const Icon = step === 1 ? Package : step === 2 ? IndianRupee : MapPin;

  return (
    <div className="min-w-0 border-b bg-muted/30 p-4 pr-12 sm:p-6 sm:pr-12">
      <DialogHeader>
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <DialogTitle className="break-words text-xl font-bold [overflow-wrap:anywhere]">
              {titles[step - 1]}
            </DialogTitle>
            <DialogDescription className="break-words [overflow-wrap:anywhere]">
              {descriptions[step - 1]}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
}
