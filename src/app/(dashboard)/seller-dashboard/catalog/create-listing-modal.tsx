"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";
import { Item, ItemRate } from "@/types/catalog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Package, MapPin, IndianRupee, Save, Loader2, Search, Globe, X } from "lucide-react";
import { useCreateItemListingMutation } from "@/queries/catalogQueries";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeRecord } from "@/types/region";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StateSearchAutocomplete } from "@/components/autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "@/components/autocompletes/district-search-autocomplete";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  type: "PRODUCT" | "SERVICE";
}

export function CreateListingModal({ isOpen, onClose, entityId, type }: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const [rate, setRate] = useState<Partial<ItemRate>>({
    minQuantity: 1,
    unitType: type === "PRODUCT" ? "Piece" : "Hour",
  });

  // Region Selection State
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [pincodeSearch, setPincodeSearch] = useState<string>("");
  const [selectedRegions, setSelectedRegions] = useState<PincodeRecord[]>([]);

  const { data: records, isLoading: isLoadingRegions } = usePincodeRecordsQuery({
    state: selectedState || undefined,
    district: selectedDistrict || undefined,
    pincode: pincodeSearch || undefined,
    perPage: 50,
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

  const removeRegion = (id: string) => {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  };


  const createListingMutation = useCreateItemListingMutation();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleCreate = async () => {
    if (!selectedItem || !entityId) return;

    try {
      await createListingMutation.mutateAsync({
        item_listing: {
          itemId: selectedItem.id,
          entityId: entityId,
          item_rate: {
            minQuantity: rate.minQuantity || 1,
            unitType: rate.unitType || "Piece",
            rate: 0,
            isNegotiable: false,
          },
          item_region: selectedRegions.map(r => ({
            pincodeId: r.id,
            state: r.state,
            district: r.district,
            wholeState: false,
            wholeDistrict: false,
          })), 
        }
      });
      toast.success("Listing created successfully!");
      onClose();
    } catch {
      toast.error("Failed to create listing.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
        <div className="bg-primary/5 p-8 border-b border-primary/10">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
               <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                  {step === 1 ? <Package size={24} /> : step === 2 ? <IndianRupee size={24} /> : <MapPin size={24} />}
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black italic">
                    {step === 1 ? "Select Item" : step === 2 ? "Listing Details" : "Service Areas"}
                  </DialogTitle>
                  <DialogDescription className="font-bold text-foreground/40 italic">
                    {step === 1 ? "Pick an item from the master catalog" : step === 2 ? "Define your quantity and unit types" : "Select where you can deliver or provide service"}
                  </DialogDescription>
               </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <ItemSearch 
                type={type} 
                onItemSelect={(item) => {
                  setSelectedItem(item);
                  if (type === "SERVICE") {
                    setStep(3);
                  } else {
                    handleNext();
                  }
                }} 
              />
            </div>
          )}

          {step === 2 && type === "PRODUCT" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="bg-muted/30 p-6 rounded-3xl border border-border flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                  <Package size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Selected Item</p>
                  <h4 className="text-xl font-black italic">{selectedItem?.name}</h4>
                  <p className="text-xs font-bold text-foreground/40">{selectedItem?.category?.name} • {selectedItem?.brand?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-black italic">Unit Type (e.g. Bag, Ton, Hour)</Label>
                  <Input 
                    value={rate.unitType} 
                    onChange={e => setRate(r => ({ ...r, unitType: e.target.value }))}
                    className="h-14 rounded-2xl font-black text-lg"
                  />
                </div>
                {type === "PRODUCT" && (
                  <div className="space-y-2">
                    <Label className="font-black italic">Min Quantity</Label>
                    <Input 
                      type="number" 
                      value={rate.minQuantity} 
                      onChange={e => setRate(r => ({ ...r, minQuantity: Number(e.target.value) }))}
                      className="h-14 rounded-2xl font-black text-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-8">
                <Button variant="outline" onClick={handleBack} className="rounded-2xl h-14 px-8 font-black gap-2">
                  <ChevronLeft size={20} /> Back
                </Button>
                <Button onClick={handleNext} className="rounded-2xl h-14 px-10 bg-primary font-black text-lg shadow-xl shadow-primary/20 gap-2">
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Filters */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-6 rounded-3xl border border-border">
                    <div className="space-y-2">
                      <Label className="font-bold italic">State</Label>
                      <StateSearchAutocomplete 
                        value={selectedState} 
                        onValueChange={(val) => {
                          setSelectedState(val);
                          setSelectedDistrict("");
                        }} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold italic">District</Label>
                      <DistrictSearchAutocomplete 
                        state={selectedState}
                        value={selectedDistrict} 
                        onValueChange={setSelectedDistrict}
                        disabled={!selectedState}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="font-bold italic">Search Pincode</Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                        <Input 
                          placeholder="Type pincode..." 
                          value={pincodeSearch}
                          onChange={(e) => setPincodeSearch(e.target.value)}
                          className="pl-12 h-14 rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border overflow-hidden bg-white">
                    <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center font-black italic">
                      <span>Available Locations</span>
                      {records && <Badge variant="outline">{records.length} Found</Badge>}
                    </div>
                    <ScrollArea className="h-[400px]">
                      {isLoadingRegions ? (
                        <div className="flex items-center justify-center h-40">
                          <Loader2 className="animate-spin text-primary" />
                        </div>
                      ) : records && records.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                          {records.map((r) => {
                            const isSelected = selectedRegions.some(sr => sr.id === r.id);
                            return (
                              <div 
                                key={r.id} 
                                onClick={() => toggleRegion(r)}
                                className={cn(
                                  "p-4 border-b border-r cursor-pointer transition-all hover:bg-primary/5 flex items-center gap-3",
                                  isSelected && "bg-primary/10"
                                )}
                              >
                                <Checkbox checked={isSelected} onCheckedChange={() => toggleRegion(r)} />
                                <div>
                                  <p className="font-black italic text-sm">{r.pincode}</p>
                                  <p className="text-[10px] font-bold text-foreground/40 truncate">{r.district}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-foreground/30">
                          <MapPin size={32} className="mb-2" />
                          <p className="font-bold italic text-sm">No locations found</p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>

                {/* Selection Summary */}
                <div className="space-y-6">
                   <div className="rounded-3xl border border-primary/20 bg-primary/5 overflow-hidden flex flex-col h-full">
                      <div className="p-6 border-b border-primary/10 flex justify-between items-center">
                        <h4 className="font-black italic">Selected ({selectedRegions.length})</h4>
                        {selectedRegions.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRegions([])} className="h-8 text-[10px] font-black italic">Clear All</Button>
                        )}
                      </div>
                      <ScrollArea className="flex-1 h-[400px]">
                        {selectedRegions.length > 0 ? (
                          <div className="divide-y divide-primary/5">
                            {selectedRegions.map(r => (
                              <div key={r.id} className="p-4 flex justify-between items-center group">
                                <div>
                                  <p className="font-black italic text-sm">{r.pincode}</p>
                                  <p className="text-[10px] font-bold text-foreground/40">{r.district}, {r.state}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeRegion(r.id)} className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-12 text-center text-foreground/20">
                            <Globe size={48} className="mb-4" />
                            <p className="font-black italic text-xs uppercase tracking-widest">No regions selected</p>
                          </div>
                        )}
                      </ScrollArea>
                   </div>
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => type === "SERVICE" ? setStep(1) : handleBack()} 
                  className="rounded-2xl h-14 px-8 font-black gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={createListingMutation.isPending || selectedRegions.length === 0} 
                  className="rounded-2xl h-14 px-10 bg-primary font-black text-lg shadow-xl shadow-primary/20 gap-2"
                >
                  {createListingMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Complete Listing
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
