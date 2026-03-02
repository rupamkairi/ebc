"use client";

import { ITEM_TYPE } from "@/constants/enums";
import { Item } from "@/types/catalog";

interface ItemSelectionStepProps {
  onItemSelect: (item: Item) => void;
  itemType: ITEM_TYPE;
}

import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";

export function ItemSelectionStep({ onItemSelect, itemType }: ItemSelectionStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-2">
      <ItemSearch onItemSelect={onItemSelect} type={itemType as "PRODUCT" | "SERVICE"} />
    </div>
  );
}
