"use client";

import { useItemListingsQuery } from "@/queries/catalogQueries";
import { Combobox } from "@/components/ui/combobox";
import { useState, useMemo } from "react";

interface ItemListingAutocompleteProps {
  entityId: string;
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
  flexibleWithBrands?: boolean;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ItemListingAutocomplete({
  entityId,
  categoryId,
  brandId,
  specificationId,
  flexibleWithBrands,
  value,
  onValueChange,
  disabled,
  placeholder = "Select your listing...",
}: ItemListingAutocompleteProps) {
  const [search, setSearch] = useState("");

  const { data: listings, isLoading } = useItemListingsQuery({
    entityId,
  });

  const filteredOptions = useMemo(() => {
    if (!listings) return [];

    return listings
      .filter((listing) => {
        const item = listing.item;
        if (!item) return false;

        // Apply filters based on requirement
        if (categoryId && item.categoryId !== categoryId) return false;
        if (specificationId && item.specificationId !== specificationId)
          return false;
        if (!flexibleWithBrands && brandId && item.brandId !== brandId)
          return false;

        return true;
      })
      .map((listing) => ({
        label: `${listing.item?.name} - ${
          listing.item?.brand?.name || "No Brand"
        } (${listing.item?.specification?.name || "No Spec"})`,
        value: listing.id,
      }));
  }, [listings, categoryId, brandId, specificationId, flexibleWithBrands]);

  return (
    <Combobox
      options={filteredOptions}
      value={value}
      onValueChange={onValueChange}
      onSearchValueChange={setSearch}
      searchValue={search}
      loading={isLoading}
      placeholder={placeholder}
      label={placeholder}
      disabled={disabled}
    />
  );
}
