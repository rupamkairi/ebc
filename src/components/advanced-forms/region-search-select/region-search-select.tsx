"use client";

import { useState } from "react";
import { StateSearchAutocomplete } from "../../autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "../../autocompletes/district-search-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeRecord } from "@/types/region";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MapPin, Globe, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function RegionSearchSelect() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [pincodeSearch, setPincodeSearch] = useState<string>("");

  const [selectWholeState, setSelectWholeState] = useState(false);
  const [selectWholeDistrict, setSelectWholeDistrict] = useState(false);

  // Selection state
  const [selectedRegions, setSelectedRegions] = useState<PincodeRecord[]>([]);

  // Fetch results based on current filters
  const { data: records, isLoading } = usePincodeRecordsQuery({
    state: selectedState || undefined,
    district: selectedDistrict || undefined,
    pincode: pincodeSearch || undefined,
    perPage: 100, // Large enough for most use cases
  });

  const toggleRegion = (record: PincodeRecord) => {
    setSelectedRegions((prev) => {
      const exists = prev.find((r) => r.id === record.id);
      if (exists) {
        return prev.filter((r) => r.id !== record.id);
      }
      return [...prev, record];
    });
  };

  const isRegionSelected = (id: string) => {
    return selectedRegions.some((r) => r.id === id);
  };

  const removeRegion = (id: string) => {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleWholeStateChange = (checked: boolean) => {
    setSelectWholeState(checked);
    if (checked && records && selectedState) {
      // Add all records from current state to selection
      const stateRecords = records.filter((r) => r.state === selectedState);
      setSelectedRegions((prev) => {
        const newRegions = [...prev];
        stateRecords.forEach((r) => {
          if (!newRegions.find((nr) => nr.id === r.id)) {
            newRegions.push(r);
          }
        });
        return newRegions;
      });
    } else if (!checked && records && selectedState) {
      // Remove all records from current state
      setSelectedRegions((prev) =>
        prev.filter((r) => r.state !== selectedState)
      );
    }
  };

  const handleWholeDistrictChange = (checked: boolean) => {
    setSelectWholeDistrict(checked);
    if (checked && records && selectedDistrict) {
      const districtRecords = records.filter(
        (r) => r.district === selectedDistrict
      );
      setSelectedRegions((prev) => {
        const newRegions = [...prev];
        districtRecords.forEach((r) => {
          if (!newRegions.find((nr) => nr.id === r.id)) {
            newRegions.push(r);
          }
        });
        return newRegions;
      });
    } else if (!checked && records && selectedDistrict) {
      setSelectedRegions((prev) =>
        prev.filter((r) => r.district !== selectedDistrict)
      );
    }
  };

  const handleSubmit = () => {
    if (selectedRegions.length === 0) {
      toast.error("Please select at least one region.");
      return;
    }
    toast.success(`Submitted ${selectedRegions.length} regions.`);
    console.log("Selected Regions:", selectedRegions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          Region Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Filters Section */}
          <div className="space-y-6 ">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5 text-primary" />
                  Filter Regions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>State</Label>
                      <StateSearchAutocomplete
                        value={selectedState}
                        onValueChange={(val) => {
                          setSelectedState(val);
                          setSelectedDistrict("");
                          setSelectWholeState(false);
                          setSelectWholeDistrict(false);
                        }}
                        placeholder="Select State"
                      />
                    </div>
                    {selectedState && (
                      <div className="flex items-center gap-2 px-1">
                        <Checkbox
                          id="whole-state"
                          checked={selectWholeState}
                          onCheckedChange={handleWholeStateChange}
                        />
                        <Label
                          htmlFor="whole-state"
                          className="text-sm cursor-pointer"
                        >
                          Select whole {selectedState}
                        </Label>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>District</Label>
                      <DistrictSearchAutocomplete
                        state={selectedState}
                        value={selectedDistrict}
                        onValueChange={(val) => {
                          setSelectedDistrict(val);
                          setSelectWholeDistrict(false);
                        }}
                        placeholder="Select District"
                        disabled={!selectedState}
                      />
                    </div>
                    {selectedDistrict && (
                      <div className="flex items-center gap-2 px-1">
                        <Checkbox
                          id="whole-district"
                          checked={selectWholeDistrict}
                          onCheckedChange={handleWholeDistrictChange}
                        />
                        <Label
                          htmlFor="whole-district"
                          className="text-sm cursor-pointer"
                        >
                          Select whole {selectedDistrict}
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input
                    value={pincodeSearch}
                    onChange={(e) => setPincodeSearch(e.target.value)}
                    placeholder="Enter Pincode (e.g. 400001)"
                    className="max-w-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results List */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    Available Regions
                    {records && (
                      <span className="text-xs font-normal text-muted-foreground">
                        ({records.length} found)
                      </span>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-muted/20">
                    <Loader2 className="size-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Fetching records...
                    </p>
                  </div>
                ) : records && records.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      {records.map((record) => (
                        <div
                          key={record.id}
                          className={cn(
                            "flex items-center gap-3 p-4 border-b border-r last:border-r-0 hover:bg-muted/30 transition-colors",
                            isRegionSelected(record.id) && "bg-primary/5"
                          )}
                        >
                          <Checkbox
                            checked={isRegionSelected(record.id)}
                            onCheckedChange={() => toggleRegion(record)}
                          />
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-sm tracking-wide">
                              {record.pincode}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {record.district}, {record.state}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-muted/10">
                    <MapPin className="size-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No regions found matching filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 pt-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  Selection Summary
                  <Badge>{selectedRegions.length} Selected</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px] lg:h-[500px]">
                  {selectedRegions.length > 0 ? (
                    <div className="divide-y">
                      {selectedRegions.map((region) => (
                        <div
                          key={region.id}
                          className="flex items-center justify-between p-3 group hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                              {region.pincode}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {region.district}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 opacity-50 hover:opacity-100 hover:text-destructive transition-all"
                            onClick={() => removeRegion(region.id)}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] p-6 text-center">
                      <Globe className="size-10 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No regions selected yet. Use the filters and checkboxes
                        to start.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-6 bg-muted/30 border-t">
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Regions</span>
                    <span className="font-bold">{selectedRegions.length}</span>
                  </div>
                  <Button
                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                    onClick={handleSubmit}
                    disabled={selectedRegions.length === 0}
                  >
                    <CheckCircle2 className="mr-2 size-5" />
                    Confirm Selection
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
