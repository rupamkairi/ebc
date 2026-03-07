"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageBackButtonProps {
  href: string;
  /** If provided, renders as a text link. Otherwise renders as an icon button. */
  label?: string;
  /** "icon" (orange circle) or "link" (inline text link). Default: "icon" */
  variant?: "icon" | "link";
}

export function PageBackButton({
  href,
  label,
  variant = "icon",
}: PageBackButtonProps) {
  if (variant === "link" || label) {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-black tracking-widest uppercase text-[#3D52A0] hover:text-[#1e2b6b] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <Button
      asChild
      size="icon"
      className="h-10 w-10 rounded-xl bg-[#FFA500] hover:bg-[#e69500] text-white border-0 shadow-md shrink-0"
    >
      <Link href={href}>
        <ArrowLeft className="h-5 w-5" />
      </Link>
    </Button>
  );
}
