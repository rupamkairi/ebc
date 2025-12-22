"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface InfoPopoverProps {
  content?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  trigger?: React.ReactNode;
  className?: string;
}

export function InfoPopover({
  content,
  imageUrl,
  imageAlt = "Example usage",
  trigger,
  className,
}: InfoPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span
          className={cn(
            "cursor-pointer inline-flex items-center ml-1 text-muted-foreground hover:text-primary transition-colors",
            className
          )}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {trigger || <Info className="size-4" />}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 overflow-hidden shadow-lg border-primary/20 bg-popover"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        side="right"
        align="start"
      >
        <div className="flex flex-col max-w-xs">
          {imageUrl && (
            <div className="relative w-full aspect-video bg-muted/50">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          )}
          {content && (
            <div className="p-3 text-sm text-foreground">{content}</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
