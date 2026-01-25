"use client";

import { ChevronLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/catalog";

interface RateDetailsStepProps {
  selectedItem: Item | null;
  onBack: () => void;
  onNext: () => void;
}

export function RateDetailsStep({
  selectedItem,
  onBack,
  onNext,
}: RateDetailsStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      <div className="bg-muted p-4 rounded-lg border flex items-center gap-4">
        <div className="h-12 w-12 rounded-md bg-background border shadow-sm flex items-center justify-center text-primary">
          <Package size={24} />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Selected Item
          </p>
          <h4 className="text-lg font-bold">{selectedItem?.name}</h4>
          <p className="text-[11px] font-medium text-muted-foreground">
            {selectedItem?.category?.name} • {selectedItem?.brand?.name}
          </p>
        </div>
      </div>

      <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-2 bg-muted/30">
        <h3 className="font-semibold text-lg">Next: Select Region</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Rates and prices are now managed separately after the listing is
          created.
        </p>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          className="font-semibold gap-2"
        >
          <ChevronLeft size={18} /> Back
        </Button>
        <Button onClick={onNext} className="font-semibold gap-2 shadow-sm">
          Next Step
        </Button>
      </div>
    </div>
  );
}
