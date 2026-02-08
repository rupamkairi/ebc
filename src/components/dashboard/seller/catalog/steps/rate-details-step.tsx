"use client";

import { ChevronLeft, Package, DollarSign, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/catalog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UNIT_TYPES, UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";

interface RateDetailsStepProps {
  selectedItem: Item | null;
  unitType: UnitType;
  setUnitType: (val: UnitType) => void;
  minQuantity: number;
  setMinQuantity: (val: number) => void;
  rate: number;
  setRate: (val: number) => void;
  isNegotiable: boolean;
  setIsNegotiable: (val: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

export function RateDetailsStep({
  selectedItem,
  unitType,
  setUnitType,
  minQuantity,
  setMinQuantity,
  rate,
  setRate,
  isNegotiable,
  setIsNegotiable,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold flex items-center gap-2">
            <Scale size={14} className="text-primary" /> Unit Type
          </Label>
          <Select
            value={unitType}
            onValueChange={(v) => setUnitType(v as UnitType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
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

        <div className="space-y-2">
          <Label className="text-sm font-bold flex items-center gap-2">
            <Package size={14} className="text-primary" /> Min Order Quantity
          </Label>
          <Input
            type="number"
            value={minQuantity}
            onChange={(e) => setMinQuantity(Number(e.target.value))}
            min={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold flex items-center gap-2">
            <DollarSign size={14} className="text-primary" /> Base Rate (per{" "}
            {UNIT_TYPE_LABELS[unitType]})
          </Label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min={0}
            step="0.01"
          />
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card mt-2">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Negotiable</Label>
            <p className="text-xs text-muted-foreground">
              Can the price be negotiated?
            </p>
          </div>
          <Switch checked={isNegotiable} onCheckedChange={setIsNegotiable} />
        </div>
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
          Next: Service Area
        </Button>
      </div>
    </div>
  );
}
