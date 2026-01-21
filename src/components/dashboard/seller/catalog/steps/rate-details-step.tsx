"use client";

import { ChevronLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UNIT_TYPES, UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { Item } from "@/types/catalog";

interface RateDetailsStepProps {
  type: "PRODUCT" | "SERVICE";
  selectedItem: Item | null;
  rate: {
    unitType: UnitType;
    minQuantity: number;
    baseRate: number;
  };
  setRate: React.Dispatch<
    React.SetStateAction<{
      unitType: UnitType;
      minQuantity: number;
      baseRate: number;
    }>
  >;
  onBack: () => void;
  onNext: () => void;
}

export function RateDetailsStep({
  type,
  selectedItem,
  rate,
  setRate,
  onBack,
  onNext,
}: RateDetailsStepProps) {
  const isProduct = type === "PRODUCT";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      {isProduct && (
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-semibold">Unit Type</Label>
          <Select
            value={rate.unitType}
            onValueChange={(value) =>
              setRate((r) => ({ ...r, unitType: value as UnitType }))
            }
          >
            <SelectTrigger className="font-medium w-full">
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_TYPES.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {UNIT_TYPE_LABELS[unit]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isProduct && (
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Min Quantity</Label>
            <Input
              type="number"
              value={rate.minQuantity}
              onChange={(e) =>
                setRate((r) => ({ ...r, minQuantity: Number(e.target.value) }))
              }
              className="font-medium"
            />
          </div>
        )}
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
