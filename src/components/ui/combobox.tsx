"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  options?: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
  emptyText?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options = [],
  value,
  onValueChange,
  searchValue,
  onSearchValueChange,
  loading = false,
  placeholder = "Search...",
  emptyText = "No results found.",
  label = "Select item...",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [value, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={onSearchValueChange}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6 text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              options.length === 0 && <CommandEmpty>{emptyText}</CommandEmpty>
            )}

            {!loading && (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(
                        currentValue === value ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
