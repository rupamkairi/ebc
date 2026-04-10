"use client";

import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeRecord } from "@/types/region";
import { PincodeDirectory } from "@/types/auth";

type InitialRecord = PincodeRecord | PincodeDirectory | string;

interface PincodeSearchAutocompleteProps {
  value?: string; // This will be the pincode directory ID
  initialRecord?: InitialRecord;
  onRecordSelect?: (record: PincodeRecord) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function PincodeSearchAutocomplete({
  value,
  initialRecord,
  onRecordSelect,
  onValueChange,
  placeholder = "Search pincode...",
  label = "Select Pincode",
  className,
  disabled,
}: PincodeSearchAutocompleteProps) {
  const [searchValue, setSearchValue] = React.useState(
    typeof initialRecord === "string" ? initialRecord : "",
  );
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState(
    typeof initialRecord === "string" ? initialRecord : "",
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading } = usePincodeRecordsQuery({
    pincode: debouncedSearchValue,
  });

  const options = React.useMemo(() => {
    const baseOptions = (data || [])
      .filter(
        (record: PincodeRecord) =>
          record.pincode && record.pincode.trim() !== "",
      )
      .map((record: PincodeRecord) => ({
        label: `${record.pincode} - ${record.district}, ${record.state}`,
        value: record.id,
      }));

    if (initialRecord && typeof initialRecord !== "string") {
      const exists = baseOptions.some((opt) => opt.value === initialRecord.id);
      if (!exists) {
        const pincode =
          (initialRecord as PincodeRecord).pincode ??
          (initialRecord as PincodeDirectory).pincode ??
          "";
        const district =
          (initialRecord as PincodeRecord).district ??
          (initialRecord as PincodeDirectory).district ??
          "";
        const state =
          (initialRecord as PincodeRecord).state ??
          (initialRecord as PincodeDirectory).state ??
          "";
        baseOptions.unshift({
          label: `${pincode} - ${district}, ${state}`,
          value: initialRecord.id,
        });
      }
    }

    return baseOptions;
  }, [data, initialRecord]);

  const handleValueChange = (val: string) => {
    const selectedRecord = data?.find((r) => r.id === val);
    if (selectedRecord && onRecordSelect) {
      onRecordSelect(selectedRecord);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={handleValueChange}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      loading={isLoading}
      placeholder={placeholder}
      emptyText="No pincode found."
      label={label}
      className={className}
      disabled={disabled}
    />
  );
}
