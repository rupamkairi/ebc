"use client";

import * as React from "react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { UseQueryResult } from "@tanstack/react-query";

interface AutocompleteBaseProps<T, P> {
  useQueryHook: (params: P) => UseQueryResult<T[], Error>;
  mapData: (data: T[]) => ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  additionalParams?: Partial<P>;
  searchField?: string;
}

export function AutocompleteBase<T, P>({
  useQueryHook,
  mapData,
  value,
  onValueChange,
  placeholder,
  emptyText,
  label,
  className,
  disabled,
  additionalParams = {},
  searchField = "search",
}: AutocompleteBaseProps<T, P>) {
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading } = useQueryHook({
    ...additionalParams,
    [searchField]: debouncedSearchValue,
  } as P);

  const options = React.useMemo(() => {
    return data ? mapData(data) : [];
  }, [data, mapData]);

  // Handle setting initial label if value exists but options are empty
  // In a real app, you might want to fetch the single entity by ID if it's not in the list
  // For now, we'll rely on the options list or a provided label prop (if we added it)

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={onValueChange}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      loading={isLoading}
      placeholder={placeholder}
      emptyText={emptyText}
      label={label}
      className={className}
      disabled={disabled}
    />
  );
}
