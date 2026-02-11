"use client";

import { useState } from "react";
import { X, Globe, MapPin, Loader2, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StateSearchAutocomplete } from "@/components/autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "@/components/autocompletes/district-search-autocomplete";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeRecord, TargetRegion } from "@/types/region";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { locationService } from "@/services/locationService";

interface UnifiedRegionSelectorProps {
  selectedRegions: TargetRegion[];
  onUpdate: (regions: TargetRegion[]) => void;
  disabled?: boolean;
}

export function UnifiedRegionSelector({
  selectedRegions,
  onUpdate,
  disabled = false,
}: UnifiedRegionSelectorProps) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [isAddingSpecial, setIsAddingSpecial] = useState(false);

  const { data: records, isLoading } = usePincodeRecordsQuery({
    state: selectedState,
    district: selectedDistrict,
    pincode: pincodeSearch.length >= 3 ? pincodeSearch : undefined,
  });

  const addRegion = (pincodeRecord: PincodeRecord) => {
    if (selectedRegions.some((r) => r.pincodeId === pincodeRecord.id)) return;
    
    onUpdate([
      ...selectedRegions,
      {
        id: "", // Placeholder, backend will generate
        pincodeId: pincodeRecord.id,
        pincode: pincodeRecord,
      },
    ]);
  };

  const toggleRegion = (pincodeRecord: PincodeRecord) => {
    const isSelected = selectedRegions.some((r) => r.pincodeId === pincodeRecord.id);
    if (isSelected) {
      removeRegion(pincodeRecord.id);
    } else {
      addRegion(pincodeRecord);
    }
  };

  const addSpecialRegion = async (type: "STATE" | "DISTRICT") => {
    if (type === "STATE" && !selectedState) return;
    if (type === "DISTRICT" && (!selectedState || !selectedDistrict)) return;

    setIsAddingSpecial(true);
    try {
      const results = await locationService.getPincodeRecords({
        state: selectedState,
        district: type === "DISTRICT" ? selectedDistrict : undefined,
        isSpecial: true,
      });

      // Find the specific one: 
      // For STATE: district and pincode are null
      // For DISTRICT: district is set, pincode is null
      const match = results.find((r) => {
        if (type === "STATE") {
          return !r.district && !r.pincode;
        } else {
          return r.district && !r.pincode;
        }
      });

      if (match) {
        addRegion(match);
      } else {
        toast.error(`Could not find a special entry for this ${type.toLowerCase()}.`);
      }
    } catch {
      toast.error("Failed to fetch regional data");
    } finally {
      setIsAddingSpecial(false);
    }
  };

  const removeRegion = (pincodeId: string) => {
    onUpdate(selectedRegions.filter((r) => r.pincodeId !== pincodeId));
  };

  return (
    <div className={cn("space-y-6", disabled && "opacity-60 pointer-events-none")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Step 1: Select State
          </Label>
          <div className="flex gap-2">
            <StateSearchAutocomplete
              value={selectedState}
              onValueChange={(val) => {
                setSelectedState(val);
                setSelectedDistrict("");
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!selectedState || isAddingSpecial}
              onClick={() => addSpecialRegion("STATE")}
              className="shrink-0"
              title="Target Whole State"
            >
              {isAddingSpecial ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Step 2: Select District (Optional)
          </Label>
          <div className="flex gap-2">
            <DistrictSearchAutocomplete
              state={selectedState}
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
              disabled={!selectedState}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!selectedDistrict || isAddingSpecial}
              onClick={() => addSpecialRegion("DISTRICT")}
              className="shrink-0"
              title="Target Whole District"
            >
              {isAddingSpecial ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Step 3: Search Pincode (Optional)
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search by pincode (min 3 digits)..."
              value={pincodeSearch}
              onChange={(e) => setPincodeSearch(e.target.value)}
              disabled={!selectedState}
              className="pl-9"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {records && records.length > 0 && selectedState && (
        <div className="border rounded-md max-h-48 overflow-y-auto bg-background shadow-sm">
          <div className="grid grid-cols-1 divide-y">
            {records
              .filter(r => r.pincode) // Only show regular pincodes in this list
              .map((r) => {
              const isSelected = selectedRegions.some((reg) => reg.pincodeId === r.id);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2.5 px-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => toggleRegion(r)}
                >
                  <div className="flex items-center gap-3 text-sm">
                    {/* Wrap checkbox to stop bubble and prevent double toggle with div onClick */}
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => toggleRegion(r)}
                      />
                    </div>
                    <div>
                      <span className="font-bold tabular-nums">{r.pincode}</span>
                      <span className="ml-3 text-muted-foreground text-xs">
                        {r.district}, {r.state}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Regions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Selected Targets</h4>
            <Badge variant="secondary" className="rounded-full px-2 py-0">
              {selectedRegions.length}
            </Badge>
          </div>
          {selectedRegions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate([])}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border rounded-lg bg-muted/10">
          {selectedRegions.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs italic">
              No specific targets selected.
            </div>
          ) : (
            selectedRegions.map((region) => {
              const r = region.pincode;
              const isWholeState = r && !r.district && !r.pincode;
              const isWholeDistrict = r && r.district && !r.pincode;

              return (
                <Badge
                  key={region.pincodeId}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 gap-1 flex items-center"
                >
                  <span className="text-xs">
                    {isWholeState ? (
                      `Whole ${r.state}`
                    ) : isWholeDistrict ? (
                      `${r.district} (District)`
                    ) : (
                      `${r?.pincode} - ${r?.district}`
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRegion(region.pincodeId)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
