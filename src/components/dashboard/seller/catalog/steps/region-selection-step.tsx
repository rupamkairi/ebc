"use client";

import {
  ChevronLeft,
  Globe,
  Loader2,
  Search,
  Save,
  X,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StateSearchAutocomplete } from "@/components/autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "@/components/autocompletes/district-search-autocomplete";
import { PincodeRecord } from "@/types/region";
import { cn } from "@/lib/utils";

interface RegionSelectionStepProps {
  selectedState: string;
  setSelectedState: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  pincodeSearch: string;
  setPincodeSearch: (val: string) => void;
  isLoadingRegions: boolean;
  records: PincodeRecord[] | undefined;
  selectedRegions: PincodeRecord[];
  toggleRegion: (record: PincodeRecord) => void;
  removeRegion: (id: string) => void;
  setSelectedRegions: (val: PincodeRecord[]) => void;
  onBack: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
  hideButtons?: boolean;
}

export function RegionSelectionStep({
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  pincodeSearch,
  setPincodeSearch,
  isLoadingRegions,
  records,
  selectedRegions,
  toggleRegion,
  removeRegion,
  setSelectedRegions,
  onBack,
  onComplete,
  isSubmitting,
  hideButtons = false,
}: RegionSelectionStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border">
            <div className="space-y-1">
              <Label className="text-sm font-semibold">State</Label>
              <StateSearchAutocomplete
                value={selectedState}
                onValueChange={(val) => {
                  setSelectedState(val);
                  setSelectedDistrict("");
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold">District</Label>
              <DistrictSearchAutocomplete
                state={selectedState}
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
                disabled={!selectedState}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-sm font-semibold">Search Pincode</Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  size={16}
                />
                <Input
                  placeholder="Type pincode..."
                  value={pincodeSearch}
                  onChange={(e) => setPincodeSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden bg-background shadow-sm">
            <div className="bg-muted/50 p-3 border-b flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Available Locations</span>
              {records && (
                <Badge variant="outline" className="text-[10px]">
                  {records.length} Found
                </Badge>
              )}
            </div>
            <div className="h-[400px] overflow-y-auto">
              {isLoadingRegions ? (
                <div className="p-20 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/20" />
                </div>
              ) : records && records.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3">
                  {records.map((r) => {
                    const isSelected = selectedRegions.some(
                      (sr) => sr.id === r.id,
                    );
                    return (
                      <div
                        key={r.id}
                        onClick={() => toggleRegion(r)}
                        className={cn(
                          "p-3 border-b border-r cursor-pointer transition-all hover:bg-muted/50 flex items-center gap-3",
                          isSelected && "bg-primary/5",
                        )}
                      >
                        <div
                          className={cn(
                            "size-4 shrink-0 rounded-[4px] border border-input shadow-xs flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background",
                          )}
                        >
                          {isSelected && <Check className="size-3" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{r.pincode}</p>
                          <p className="text-[10px] font-medium text-muted-foreground truncate">
                            {r.district}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-20 text-center text-muted-foreground">
                  <p className="text-sm italic">Search to find pincodes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-muted/5 overflow-hidden flex flex-col h-full shadow-sm">
            <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
              <h4 className="text-sm font-bold">
                Selected ({selectedRegions.length})
              </h4>
              {selectedRegions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRegions([])}
                  className="h-7 text-[10px] font-semibold"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="h-[400px] overflow-y-auto">
              {selectedRegions.length > 0 ? (
                <div className="divide-y">
                  {selectedRegions.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 flex justify-between items-center group hover:bg-muted/30"
                    >
                      <div>
                        <p className="font-bold text-sm">{r.pincode}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">
                          {r.district}, {r.state}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRegion(r.id)}
                        className="h-7 w-7 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground/30">
                  <Globe size={40} className="mb-3" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    No regions selected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!hideButtons && (
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={onBack}
            className="font-semibold gap-2"
          >
            <ChevronLeft size={18} /> Back
          </Button>
          <Button
            onClick={onComplete}
            disabled={isSubmitting || selectedRegions.length === 0}
            className="font-semibold gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Complete Listing
          </Button>
        </div>
      )}
    </div>
  );
}
