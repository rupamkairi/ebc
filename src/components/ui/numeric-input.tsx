"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type NumericInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> & {
  value?: number | null;
  onValueChange: (value: number) => void;
  integer?: boolean;
  fallbackValue?: number;
};

export function NumericInput({
  value,
  onValueChange,
  integer = false,
  fallbackValue,
  onBlur,
  onFocus,
  ...props
}: NumericInputProps) {
  const [rawValue, setRawValue] = React.useState(
    value === null || value === undefined ? "" : String(value),
  );
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setRawValue(value === null || value === undefined ? "" : String(value));
    }
  }, [isFocused, value]);

  const pattern = integer ? /^-?\d*$/ : /^-?\d*(\.\d*)?$/;

  return (
    <Input
      {...props}
      type="number"
      value={rawValue}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (!pattern.test(nextValue)) return;

        setRawValue(nextValue);
        if (!nextValue || nextValue === "-" || nextValue === ".") return;

        const parsed = integer ? parseInt(nextValue, 10) : Number(nextValue);
        if (Number.isFinite(parsed)) onValueChange(parsed);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        if (!rawValue || rawValue === "-" || rawValue === ".") {
          const fallback =
            fallbackValue ??
            (typeof props.min === "number" ? props.min : Number(props.min) || 0);
          onValueChange(fallback);
          setRawValue(String(fallback));
        }
        onBlur?.(event);
      }}
    />
  );
}
