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
import { useAppTheme } from "@/components/providers/app-theme-provider";

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
  emptyText?: React.ReactNode;
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
  const { variant } = useAppTheme();
  const isAppVariant = variant === "app";

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [value, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isAppVariant ? "ghost" : "outline"}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            isAppVariant && "combobox-trigger-app",
            !isAppVariant && "border-input bg-background",
            className,
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : label}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-full p-0 overflow-hidden",
          isAppVariant && "combobox-content-app",
        )}
        align="start"
      >
        <Command shouldFilter={false} className="border-none">
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={onSearchValueChange}
            className={cn(isAppVariant && "combobox-input-app")}
          />
          <CommandList className="max-h-[300px] overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              options.length === 0 && (
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </CommandEmpty>
              )
            )}

            {!loading && (
              <CommandGroup className="p-1">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(
                        currentValue === value ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer",
                      isAppVariant && "combobox-item-app",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="flex-1 truncate">{option.label}</span>
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
