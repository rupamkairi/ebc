"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { useCreateItemListingMutation } from "@/queries/catalogQueries";
import { Item } from "@/types/catalog";
import { UnitType } from "@/constants/quantities";
import { PincodeRecord } from "@/types/region";
import { ListingModalHeader } from "@/components/dashboard/seller/catalog/listing-modal-header";
import { ItemSelectionStep } from "@/components/dashboard/seller/catalog/steps/item-selection-step";
import { RateDetailsStep } from "@/components/dashboard/seller/catalog/steps/rate-details-step";
import { RegionSelectionStep } from "@/components/dashboard/seller/catalog/steps/region-selection-step";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  type: "PRODUCT" | "SERVICE";
}

export function CreateListingModal({
  isOpen,
  onClose,
  entityId,
  type,
}: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [rate, setRate] = useState({
    unitType: "" as UnitType,
    minQuantity: 1,
    baseRate: 0,
  });

  // Region Selection State
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<PincodeRecord[]>([]);

  const { data: records, isLoading: isLoadingRegions } = usePincodeRecordsQuery(
    {
      state: selectedState,
      district: selectedDistrict,
      pincode: pincodeSearch.length >= 3 ? pincodeSearch : undefined,
    },
  );

  const createListingMutation = useCreateItemListingMutation();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleRegion = (record: PincodeRecord) => {
    setSelectedRegions((prev) =>
      prev.some((r) => r.id === record.id)
        ? prev.filter((r) => r.id !== record.id)
        : [...prev, record],
    );
  };

  const removeRegion = (id: string) => {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreate = async () => {
    if (!selectedItem || selectedRegions.length === 0) return;

    try {
      await createListingMutation.mutateAsync({
        item_listing: {
          itemId: selectedItem.id,
          entityId,
          item_rate: {
            unitType: rate.unitType,
            minQuantity: rate.minQuantity,
            rate: 0,
            isNegotiable: false,
          },
          item_region: selectedRegions.map((r) => ({
            pincodeId: r.id,
            state: r.state,
            district: r.district,
            wholeState: false,
            wholeDistrict: false,
          })),
        },
      });

      toast.success("Listing created successfully!");
      onClose();
    } catch {
      toast.error("Failed to create listing.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border shadow-lg">
        <ListingModalHeader step={step} />

        <div className="p-6">
          {step === 1 && (
            <ItemSelectionStep
              onItemSelect={(item) => {
                setSelectedItem(item);
                if (type === "SERVICE") {
                  setStep(3);
                } else {
                  handleNext();
                }
              }}
            />
          )}

          {step === 2 && (
            <RateDetailsStep
              type={type}
              selectedItem={selectedItem}
              rate={rate}
              setRate={setRate}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {step === 3 && (
            <RegionSelectionStep
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              pincodeSearch={pincodeSearch}
              setPincodeSearch={setPincodeSearch}
              isLoadingRegions={isLoadingRegions}
              records={records}
              selectedRegions={selectedRegions}
              toggleRegion={toggleRegion}
              removeRegion={removeRegion}
              setSelectedRegions={setSelectedRegions}
              onBack={() => (type === "SERVICE" ? setStep(1) : handleBack())}
              onComplete={handleCreate}
              isSubmitting={createListingMutation.isPending}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
