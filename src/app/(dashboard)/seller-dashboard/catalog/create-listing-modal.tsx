"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { useCreateItemListingMutation } from "@/queries/catalogQueries";
import { catalogService } from "@/services/catalogService";
import { Item } from "@/types/catalog";
import { PincodeRecord } from "@/types/region";
import { ListingModalHeader } from "@/components/dashboard/seller/catalog/listing-modal-header";
import { ItemSelectionStep } from "@/components/dashboard/seller/catalog/steps/item-selection-step";
import { RateDetailsStep } from "@/components/dashboard/seller/catalog/steps/rate-details-step";
import { RegionSelectionStep } from "@/components/dashboard/seller/catalog/steps/region-selection-step";
import { UnitType, UNIT_TYPES } from "@/constants/quantities";
import { UNIT_TYPE, ITEM_TYPE } from "@/constants/enums";
import { ApiError } from "@/lib/api-client";

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
  const [isLoadingItemDetails, setIsLoadingItemDetails] = useState(false);

  // Rate Details State
  const [unitType, setUnitType] = useState<UnitType>(UNIT_TYPE.Nos);
  const [minQuantity, setMinQuantity] = useState(1);
  const [rate, setRate] = useState(0);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [allowedUnitTypes, setAllowedUnitTypes] = useState<UnitType[] | undefined>(undefined);

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

  /**
   * Resolve allowed unit types from a full item response.
   * Checks item.acceptableUnitTypes first, then item.specification.acceptableUnitTypes.
   */
  const resolveAllowedUnits = (item: Item): UnitType[] | undefined => {
    const units =
      item.acceptableUnitTypes?.length
        ? item.acceptableUnitTypes
        : item.specification?.acceptableUnitTypes?.length
          ? item.specification.acceptableUnitTypes
          : undefined;
    return units ?? undefined;
  };

  /**
   * Parse the backend error message for acceptable unit types.
   * Error format: "Unit type Litre is not acceptable for this item. Acceptable types: Nos"
   */
  const parseAcceptableUnitsFromError = (message: string): UnitType[] | null => {
    const match = message.match(/Acceptable types?:\s*(.+)/i);
    if (!match) return null;
    const rawTypes = match[1]
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const valid = rawTypes.filter((t) =>
      (UNIT_TYPES as readonly string[]).includes(t),
    ) as UnitType[];
    return valid.length > 0 ? valid : null;
  };

  const handleItemSelect = async (item: Item) => {
    setSelectedItem(item);

    // Try to resolve from the list response first (fast path)
    const fromList = resolveAllowedUnits(item);
    if (fromList) {
      setAllowedUnitTypes(fromList);
      setUnitType(fromList[0]);
      setStep(isService ? 3 : 2);
      return;
    }

    // Fallback: fetch the full item detail which includes nested specification data
    if (!isService) {
      setIsLoadingItemDetails(true);
      try {
        const fullItem = await catalogService.getItem(item.id);
        console.log("[CreateListingModal] full item response:", fullItem);
        const fromDetail = resolveAllowedUnits(fullItem);
        setAllowedUnitTypes(fromDetail);
        if (fromDetail && fromDetail.length > 0) {
          setUnitType(fromDetail[0]);
        } else {
          setUnitType(UNIT_TYPE.Nos);
        }
      } catch {
        // If the extra fetch fails, just proceed without restrictions
        setAllowedUnitTypes(undefined);
        setUnitType(UNIT_TYPE.Nos);
      } finally {
        setIsLoadingItemDetails(false);
      }
    }

    setStep(isService ? 3 : 2);
  };

  const getBackStep = () => (isService ? 1 : 2);

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
    } catch (err) {
      // Parse allowed units from backend rejection and auto-correct
      if (err instanceof ApiError && !isService) {
        const parsed = parseAcceptableUnitsFromError(err.message);
        if (parsed) {
          setAllowedUnitTypes(parsed);
          setUnitType(parsed[0]);
          setStep(2);
          toast.error(
            `Unit type not allowed for this item. Allowed: ${parsed.join(", ")}. Please review and resubmit.`,
            { duration: 6000 },
          );
          return;
        }
      }
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
              allowedUnitTypes={allowedUnitTypes}
              isLoadingAllowedTypes={isLoadingItemDetails}
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
