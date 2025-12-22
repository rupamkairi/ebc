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
  bgColor = "bg-primary/10",
  iconColor = "text-primary",
  size = 20,
  className = "",
}: IconWrapperProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full p-2 transition-transform hover:scale-105",
        bgColor,
        className
      )}
    >
      <Icon size={size} className={iconColor} />
    </div>
  );
}
