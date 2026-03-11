"use client";

import { ChevronLeft, Package, IndianRupee, Scale, AlertCircle, CheckCircle2 } from "lucide-react";
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
  /** If provided, only these unit types will appear in the dropdown */
  allowedUnitTypes?: UnitType[];
  /** True while the full item detail is being fetched to resolve allowed types */
  isLoadingAllowedTypes?: boolean;
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
  allowedUnitTypes,
  isLoadingAllowedTypes = false,
}: RateDetailsStepProps) {
  const visibleUnits =
    allowedUnitTypes && allowedUnitTypes.length > 0
      ? UNIT_TYPES.filter((u) => allowedUnitTypes.includes(u))
      : UNIT_TYPES;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      {/* Selected item card */}
      <div className="bg-muted p-4 rounded-lg border flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-md bg-background border shadow-sm flex items-center justify-center text-primary">
          <Package size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Selected Item
          </p>
          <h4 className="text-lg font-bold truncate">{selectedItem?.name}</h4>
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            {selectedItem?.category?.name}
            {selectedItem?.brand?.name ? ` • ${selectedItem.brand.name}` : ""}
          </p>
        </div>
      </div>

      {/* Unit-type guidance notice */}
      {allowedUnitTypes && allowedUnitTypes.length > 0 ? (
        /* Specific restriction — shown after a backend rejection */
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={15} className="text-primary shrink-0" />
            <p className="text-sm font-semibold text-primary">
              Unit type restriction applied
            </p>
          </div>
          <p className="text-xs text-muted-foreground pl-[23px]">
            This item can only be listed in{" "}
            <span className="font-semibold text-foreground">
              {allowedUnitTypes.map((u) => UNIT_TYPE_LABELS[u]).join(", ")}
            </span>
            . The dropdown has been filtered accordingly.
          </p>
        </div>
      ) : (
        /* Advisory — always shown before first submission */
        <div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Unit type is item-specific
            </p>
          </div>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 pl-[23px]">
            Each item in the catalog is configured to accept only certain unit
            types. If your selection is invalid, you&apos;ll be automatically
            brought back here with the correct options pre-selected.
          </p>
        </div>
      )}

      {/* Rate fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold flex items-center gap-1.5">
            <Scale size={13} className="text-primary" />
            Unit Type
          </Label>
          {isLoadingAllowedTypes ? (
            <div className="h-10 w-full rounded-md border bg-muted animate-pulse" />
          ) : (
            <Select
              value={unitType}
              onValueChange={(v) => setUnitType(v as UnitType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {visibleUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {UNIT_TYPE_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold flex items-center gap-1.5">
            <Package size={13} className="text-primary" />
            Min Order Quantity
          </Label>
          <Input
            type="number"
            value={minQuantity}
            onChange={(e) => setMinQuantity(Number(e.target.value))}
            min={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold flex items-center gap-1.5">
            <IndianRupee size={13} className="text-primary" />
            Base Rate{" "}
            <span className="font-normal text-muted-foreground">
              (per {UNIT_TYPE_LABELS[unitType]})
            </span>
          </Label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min={0}
            step="0.01"
          />
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
          <div className="space-y-0.5 pr-4">
            <Label className="text-sm font-semibold leading-none">
              Negotiable Price
            </Label>
            <p className="text-xs text-muted-foreground">
              Allow buyers to negotiate the rate
            </p>
          </div>
          <Switch checked={isNegotiable} onCheckedChange={setIsNegotiable} />
        </div>
      </div>

      {/* Navigation */}
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
