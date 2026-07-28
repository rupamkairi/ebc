"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConferenceHallSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function ConferenceHallSearch({
  value,
  onChange,
  placeholder,
}: ConferenceHallSearchProps) {
  return (
    <div className="relative w-full md:w-96">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl border border-primary/15 bg-muted/40 pl-10 shadow-inner transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
      />
    </div>
  );
}
