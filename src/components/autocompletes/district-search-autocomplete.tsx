"use client";

import { AutocompleteBase } from "./autocomplete-base";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeListParams, PincodeRecord } from "@/types/region";

interface DistrictSearchAutocompleteProps {
  state?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function DistrictSearchAutocomplete({
  state,
  ...props
}: DistrictSearchAutocompleteProps) {
  return (
    <AutocompleteBase<PincodeRecord, PincodeListParams>
      useQueryHook={usePincodeRecordsQuery}
      searchField="district"
      additionalParams={{ state }}
      mapData={(records) => {
        const uniqueDistricts = Array.from(
          new Set(
            records
              .map((r) => r.district)
              .filter(
                (district): district is string =>
                  !!district && typeof district === "string"
              )
          )
        );
        return uniqueDistricts.map((district) => ({
          label: district,
          value: district,
        }));
      }}
      disabled={!state || props.disabled}
      {...props}
    />
  );
}
