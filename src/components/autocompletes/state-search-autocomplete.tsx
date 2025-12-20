"use client";

import { AutocompleteBase } from "./autocomplete-base";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeListParams, PincodeRecord } from "@/types/region";

interface StateSearchAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function StateSearchAutocomplete(props: StateSearchAutocompleteProps) {
  return (
    <AutocompleteBase<PincodeRecord, PincodeListParams>
      useQueryHook={usePincodeRecordsQuery}
      searchField="state"
      mapData={(records) => {
        const uniqueStates = Array.from(
          new Set(
            records
              .map((r) => r.state)
              .filter(
                (state): state is string => !!state && typeof state === "string"
              )
          )
        );
        return uniqueStates.map((state) => ({
          label: state,
          value: state,
        }));
      }}
      {...props}
    />
  );
}
