"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useBrowseParams } from "@/hooks/useBrowseParams";

interface SuggestedSearchesProps {
  suggestions?: string[];
}

export function SuggestedSearches({ suggestions }: SuggestedSearchesProps) {
  const { updateParams } = useBrowseParams();

  // Default mocks
  const items = suggestions || [
    "Wireless",
    "Bluetooth",
    "Smart Home",
    "Gaming",
    "Office",
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        Suggested:
      </span>
      <div className="flex gap-2">
        {items.map((term) => (
          <Badge
            key={term}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80 font-normal px-3"
            onClick={() => updateParams({ q: term })}
          >
            {term}
          </Badge>
        ))}
      </div>
    </div>
  );
}
