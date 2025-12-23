"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { IconWrapper } from "./icon-wrapper";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DashboardCard({
  title,
  icon,
  children,
  footer,
  className = "",
  headerClassName = "",
}: DashboardCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm ${className}`}
    >
      <div
        className={`flex items-center gap-3 bg-primary px-4 py-3 text-white ${headerClassName}`}
      >
        <IconWrapper
          icon={icon}
          size={18}
          bgColor="bg-white/10"
          iconColor="text-white"
          className="p-1.5"
        />
        <h3 className="text-lg font-bold leading-none">{title}</h3>
      </div>
      <div className="flex-1 p-4">{children}</div>
      {footer && (
        <div className="border-t border-border bg-muted/30 p-4">{footer}</div>
      )}
    </div>
  );
}
