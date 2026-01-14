"use client";

import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";
import { Item } from "@/types/catalog";

interface ItemSelectionStepProps {
  onItemSelect: (item: Item) => void;
}

export function ItemSelectionStep({ onItemSelect }: ItemSelectionStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-2">
      <ItemSearch onItemSelect={onItemSelect} />
    </div>
  );
}
