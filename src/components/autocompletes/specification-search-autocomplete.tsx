"use client";

import { AutocompleteBase } from "./autocomplete-base";
import { useSpecificationsQuery } from "@/queries/catalogQueries";
import { SpecificationListParams, Specification } from "@/types/catalog";

interface SpecificationSearchAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  additionalParams?: Partial<SpecificationListParams>;
}

export function SpecificationSearchAutocomplete(
  props: SpecificationSearchAutocompleteProps
) {
  return (
    <AutocompleteBase<Specification, SpecificationListParams>
      useQueryHook={useSpecificationsQuery}
      mapData={(specifications) =>
        specifications.map((spec) => ({
          label: spec.name,
          value: spec.id,
        }))
      }
      {...props}
    />
  );
}
