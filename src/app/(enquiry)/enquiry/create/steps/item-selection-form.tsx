"use client";

import { useState } from "react";
import { useEnquiryStore, EnquiryItem } from "../../store/enquiry-store";
import { ItemSearch } from "@/components/search/item-search/item-search";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { StyledCard } from "@/components/ui/styled-card";
import { PackageSearch, ListChecks } from "lucide-react";

// Type matches what comes from ItemSearch/API roughly
interface SearchItem {
  id: string;
  name: string;
  brand?: { name: string };
  category?: { name: string };
  acceptableUnitTypes?: string[];
}

const UNIT_TYPES = [
  "Pieces",
  "Bags",
  "KG",
  "Tons",
  "Brass",
  "Litre",
  "Meter",
  "Sq. Ft.",
];

export function ItemSelectionForm() {
  const { items, addItem, removeItem, setStep } = useEnquiryStore();
  const [selectedSearchItem, setSelectedSearchItem] =
    useState<SearchItem | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [unit, setUnit] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemSelect = (item: SearchItem) => {
    setSelectedSearchItem(item);
    setQuantity("1");
    setUnit(item.acceptableUnitTypes?.[0] || "");
    setRemarks("");
    setIsDialogOpen(true);
  };

  const handleConfirmAddItem = () => {
    if (!selectedSearchItem) return;
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (!unit) {
      toast.error("Please select a unit");
      return;
    }

    const newItem: EnquiryItem = {
      itemId: selectedSearchItem.id,
      name: selectedSearchItem.name,
      quantity: Number(quantity),
      unit: unit,
      remarks: remarks,
      brandName: selectedSearchItem.brand?.name,
      categoryName: selectedSearchItem.category?.name,
    };

    addItem(newItem);
    setIsDialogOpen(false);
    toast.success("Item added to list");
  };

  const handleNext = () => {
    if (items.length === 0) {
      toast.error("Please select at least one item");
      return;
    }
    setStep(3);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top: Your Cart */}
      <StyledCard
        title="Your Cart"
        description={`${items.length} items added to your enquiry`}
        icon={ListChecks}
        className="border-none shadow-xl overflow-hidden"
        headerClassName="bg-gradient-to-r from-emerald-600 to-emerald-500"
      >
        <div className="min-h-[100px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
              <Plus className="size-12 mb-4 opacity-20 text-emerald-500" />
              <p className="font-bold text-lg">Your cart is empty</p>
              <p className="text-sm opacity-70">
                Use the search below to find and add construction materials.
              </p>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">
                      Item & Item Details
                    </TableHead>
                    <TableHead className="w-[120px] text-right font-bold">
                      Quantity
                    </TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={`${item.itemId}-${index}`}
                      className="group hover:bg-emerald-50/30 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="font-extrabold text-lg text-foreground leading-tight">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {(item.brandName || item.categoryName) && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest border border-emerald-200">
                              {item.brandName} {item.categoryName}
                            </span>
                          )}
                          {item.remarks && (
                            <span className="text-xs italic text-muted-foreground bg-gray-100 px-2 py-0.5 rounded border">
                              &quot;{item.remarks}&quot;
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="font-black text-xl text-emerald-600">
                          {item.quantity}
                          <span className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                            {item.unit}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10 rounded-full transition-all"
                          onClick={() => removeItem(item.itemId)}
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </StyledCard>

      {/* Bottom: Find Items to Add */}
      <StyledCard
        title="Find Items to Add"
        description="Search our extensive catalog for materials."
        icon={PackageSearch}
        className="border-none shadow-xl"
        headerClassName="bg-gradient-to-r from-blue-700 to-blue-600"
      >
        <div className="space-y-6">
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
            <ItemSearch
              onItemSelect={handleItemSelect}
              className="shadow-md border-none ring-2 ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {/* Quick Suggestions or Categories could go here to match wireframe blocks */}
            <div className="p-4 border rounded-xl bg-white/50 text-center space-y-1">
              <div className="font-bold text-sm">Cement</div>
              <div className="text-[10px] text-muted-foreground uppercase font-black">
                Quick Add
              </div>
            </div>
            <div className="p-4 border rounded-xl bg-white/50 text-center space-y-1">
              <div className="font-bold text-sm">Steel TMT</div>
              <div className="text-[10px] text-muted-foreground uppercase font-black">
                Quick Add
              </div>
            </div>
            <div className="p-4 border rounded-xl bg-white/50 text-center space-y-1">
              <div className="font-bold text-sm">Bricks</div>
              <div className="text-[10px] text-muted-foreground uppercase font-black">
                Quick Add
              </div>
            </div>
          </div>
        </div>
      </StyledCard>

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/10">
        <Button
          variant="ghost"
          onClick={() => setStep(1)}
          size="lg"
          className="font-bold hover:bg-muted text-lg px-8 rounded-xl"
        >
          <ArrowLeft className="mr-2 size-5" /> Back
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          disabled={items.length === 0}
          className="bg-primary hover:bg-primary/90 text-white font-black text-lg px-12 py-7 rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          Next: Review Enquiry <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="bg-blue-600 p-6 text-white">
            <DialogTitle className="text-2xl font-black">
              Configure Item
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">
              Specify quantity and units for{" "}
              <span className="font-bold text-white underline decoration-wavy underline-offset-4">
                {selectedSearchItem?.name}
              </span>
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="qty"
                  className="text-sm font-black uppercase tracking-wider text-muted-foreground"
                >
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-14 text-xl font-bold border-2 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="unit"
                  className="text-sm font-black uppercase tracking-wider text-muted-foreground"
                >
                  Unit <span className="text-destructive">*</span>
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger
                    id="unit"
                    className="h-14 text-lg font-bold border-2"
                  >
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedSearchItem?.acceptableUnitTypes?.length || 0) > 0
                      ? selectedSearchItem?.acceptableUnitTypes?.map((u) => (
                          <SelectItem key={u} value={u} className="font-bold">
                            {u}
                          </SelectItem>
                        ))
                      : UNIT_TYPES.map((u) => (
                          <SelectItem key={u} value={u} className="font-bold">
                            {u}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="remarks"
                className="text-sm font-black uppercase tracking-wider text-muted-foreground"
              >
                Remarks (Optional)
              </Label>
              <Textarea
                id="remarks"
                placeholder="E.g. Specific grade, delivery time, etc."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="min-h-[100px] border-2 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/30 border-t flex gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 font-bold h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddItem}
              className="flex-1 font-black h-12 bg-blue-600 hover:bg-blue-700"
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
