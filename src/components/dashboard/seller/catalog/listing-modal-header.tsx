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
    <div className="p-6 border-b bg-muted/30">
      <DialogHeader>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <Icon size={20} />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">
              {titles[step - 1]}
            </DialogTitle>
            <DialogDescription>{descriptions[step - 1]}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
}
