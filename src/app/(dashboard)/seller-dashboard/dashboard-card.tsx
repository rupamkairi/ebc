"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { IconWrapper } from "./icon-wrapper";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex flex-col overflow-hidden rounded-[20px] border border-primary/5 bg-white shadow-xs hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 bg-primary px-5 py-4 text-white",
          headerClassName
        )}
      >
        <IconWrapper
          icon={icon}
          size={16}
          bgColor="bg-white/10"
          iconColor="text-white"
          className="p-2 rounded-xl"
        />
        <h3 className="text-[13px] font-black leading-none uppercase tracking-widest">
          {title}
        </h3>
      </div>
      <div className="flex-1 p-5 md:p-6">{children}</div>
      {footer && (
        <div className="border-t border-primary/5 bg-primary/5 p-4 sm:p-5">
          {footer}
        </div>
      )}
    </div>
  );
}
