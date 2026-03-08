"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { useCreateItemListingMutation } from "@/queries/catalogQueries";
import { Item } from "@/types/catalog";
import { PincodeRecord } from "@/types/region";
import { ListingModalHeader } from "@/components/dashboard/seller/catalog/listing-modal-header";
import { ItemSelectionStep } from "@/components/dashboard/seller/catalog/steps/item-selection-step";
import { RateDetailsStep } from "@/components/dashboard/seller/catalog/steps/rate-details-step";
import { RegionSelectionStep } from "@/components/dashboard/seller/catalog/steps/region-selection-step";
import { UnitType } from "@/constants/quantities";
import { UNIT_TYPE, ITEM_TYPE } from "@/constants/enums";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  itemType: ITEM_TYPE;
}

export function CreateListingModal({
  isOpen,
  onClose,
  entityId,
  itemType,
}: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Rate Details State
  const [unitType, setUnitType] = useState<UnitType>(UNIT_TYPE.Nos);
  const [minQuantity, setMinQuantity] = useState(1);
  const [rate, setRate] = useState(0);
  const [isNegotiable, setIsNegotiable] = useState(false);

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

  const isService = itemType === ITEM_TYPE.SERVICE;

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    if (isService) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const getBackStep = () => {
    if (isService) {
      return 1;
    }
    return 2;
  };

  const handleCreate = async () => {
    if (!selectedItem || selectedRegions.length === 0) return;

    try {
      const payload: Parameters<typeof createListingMutation.mutateAsync>[0] = {
        item_listing: {
          itemId: selectedItem.id,
          entityId,
          item_region: selectedRegions.map((r) => ({
            pincodeId: r.id,
            state: r.state,
            district: r.district,
            wholeState: false,
            wholeDistrict: false,
          })),
        },
      };

      if (!isService) {
        payload.item_listing.item_rate = {
          unitType,
          minQuantity,
          rate,
          isNegotiable,
        };
      }

      await createListingMutation.mutateAsync(payload);

      toast.success("Listing created successfully!");
      onClose();
    } catch {
      toast.error("Failed to create listing.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border shadow-lg">
        <ListingModalHeader step={step} />

        <div className="p-6">
          {step === 1 && (
            <ItemSelectionStep
              onItemSelect={handleItemSelect}
              itemType={itemType}
            />
          )}

          {step === 2 && (
            <RateDetailsStep
              selectedItem={selectedItem}
              unitType={unitType}
              setUnitType={setUnitType}
              minQuantity={minQuantity}
              setMinQuantity={setMinQuantity}
              rate={rate}
              setRate={setRate}
              isNegotiable={isNegotiable}
              setIsNegotiable={setIsNegotiable}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
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
              onBack={() => setStep(getBackStep())}
              onComplete={handleCreate}
              isSubmitting={createListingMutation.isPending}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
