"use client";

import { AutocompleteBase } from "./autocomplete-base";
import { useBrandsQuery } from "@/queries/catalogQueries";
import { BrandListParams, Brand } from "@/types/catalog";

interface BrandSearchAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  additionalParams?: Partial<BrandListParams>;
}

export function BrandSearchAutocomplete(props: BrandSearchAutocompleteProps) {
  return (
    <AutocompleteBase<Brand, BrandListParams>
      useQueryHook={useBrandsQuery}
      mapData={(brands) =>
        brands.map((brand) => ({
          label: brand.name,
          value: brand.id,
        }))
      }
      {...props}
    />
  );
}
