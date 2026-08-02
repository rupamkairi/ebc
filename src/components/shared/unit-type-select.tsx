"use client";

import { useMemo, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
  filterUnitTypes,
  UNIT_TYPE_LABELS,
  UNIT_TYPES,
  UnitType,
} from "@/constants/quantities";
import { useLanguage } from "@/hooks/useLanguage";

interface UnitTypeSelectProps {
  value?: UnitType;
  onValueChange: (value: UnitType) => void;
  units?: readonly UnitType[];
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function UnitTypeSelect({
  value,
  onValueChange,
  units = UNIT_TYPES,
  disabled = false,
  label,
  placeholder,
  className,
}: UnitTypeSelectProps) {
  const [search, setSearch] = useState("");
  const { t } = useLanguage();
  const options = useMemo(
    () =>
      filterUnitTypes(units, search).map((unit) => ({
        value: unit,
        label: UNIT_TYPE_LABELS[unit],
      })),
    [search, units],
  );

  return (
    <Combobox
      value={value}
      options={options}
      searchValue={search}
      onSearchValueChange={setSearch}
      onOpenChange={(open) => {
        if (!open) setSearch("");
      }}
      onValueChange={(nextValue) => {
        if (!nextValue) return;
        onValueChange(nextValue as UnitType);
        setSearch("");
      }}
      label={label ?? t("unit_select_label")}
      placeholder={placeholder ?? t("unit_search_placeholder")}
      emptyText={t("unit_no_matches")}
      disabled={disabled}
      className={className}
    />
  );
}
