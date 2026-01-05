"use client";

import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { PincodeRecord } from "@/types/region";

interface PincodeSearchAutocompleteProps {
  value?: string; // This will be the pincode directory ID
  onRecordSelect?: (record: PincodeRecord) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function PincodeSearchAutocomplete({
  value,
  onRecordSelect,
  placeholder = "Search pincode...",
  label = "Select Pincode",
  className,
  disabled,
}: PincodeSearchAutocompleteProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState("");

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
    return (data || [])
      .filter((record) => record.pincode && record.pincode.trim() !== "")
      .map((record) => ({
        label: `${record.pincode} - ${record.district}, ${record.state}`,
        value: record.id,
      }));
  }, [data]);

  const handleValueChange = (val: string) => {
    const selectedRecord = data?.find((r) => r.id === val);
    if (selectedRecord && onRecordSelect) {
      onRecordSelect(selectedRecord);
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
