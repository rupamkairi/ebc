"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { IconWrapper } from "./icon-wrapper";
import { cn } from "@/lib/utils";

interface StyledCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function StyledCard({
  title,
  description,
  icon,
  children,
  footer,
  className,
  headerClassName,
}: StyledCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 bg-linear-to-r from-primary to-primary/90 px-5 py-4 text-primary-foreground",
          headerClassName
        )}
      >
        {icon && (
          <IconWrapper
            icon={icon}
            size={20}
            bgColor="bg-white/20"
            iconColor="text-white"
            className="p-2 shadow-sm"
          />
        )}
        <div>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          {description && (
            <p className="text-xs text-primary-foreground/80 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 p-5">{children}</div>
      {footer && (
        <div className="border-t border-border bg-muted/30 p-4">{footer}</div>
      )}
    </div>
  );
}
