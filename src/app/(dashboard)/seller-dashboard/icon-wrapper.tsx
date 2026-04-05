"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconWrapperProps {
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  size?: number;
  className?: string;
}

export function IconWrapper({
  icon: Icon,
  bgColor = "bg-primary/5",
  iconColor = "text-primary",
  size = 20,
  className = "",
}: IconWrapperProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl p-3 transition-transform group-hover:scale-110 duration-300",
        bgColor,
        className
      )}
    >
      <Icon size={size} className={iconColor} strokeWidth={2.5} />
    </div>
  );
}
