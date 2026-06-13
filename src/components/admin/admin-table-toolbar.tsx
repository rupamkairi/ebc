"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AdminTableFilter {
  key: string;
  label: string;
  value: string;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: (value: string) => void;
}

interface AdminTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: AdminTableFilter[];
  onClear?: () => void;
}

export function AdminTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClear,
}: AdminTableToolbarProps) {
  const hasActiveFilters =
    searchValue.trim().length > 0 ||
    filters.some((filter) => filter.value !== "ALL");

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 pl-9"
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="h-10 w-full sm:w-[190px]">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {onClear && (
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={onClear}
            disabled={!hasActiveFilters}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
