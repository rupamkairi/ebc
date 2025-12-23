"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface IconWrapperProps {
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  size?: number;
  className?: string;
}

export function IconWrapper({
  icon: Icon,
  bgColor = "bg-white",
  iconColor = "text-primary",
  size = 20,
  className = "",
}: IconWrapperProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full p-2 ${bgColor} ${className}`}
    >
      <Icon size={size} className={iconColor} />
    </div>
  );
}
