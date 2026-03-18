"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PackageCheck } from "lucide-react";
import Link from "next/link";

interface ActivityActionCardProps {
  isPending: boolean;
  /** Label for the primary CTA button when pending */
  actionLabel: string;
  /** If provided, renders a Link-based CTA */
  actionHref?: string;
  /** If provided, renders an onClick-based CTA */
  onAction?: () => void;
  /** Icon for the CTA button */
  actionIcon?: React.ReactNode;
  /** Description below the CTA title when pending */
  actionDescription?: string;
  /** Label shown when already responded */
  respondedLabel: string;
  /** Description shown when already responded */
  respondedDescription: string;
  /** Back link href after responded */
  backHref: string;
  /** Back link label */
  backLabel: string;
  /** Whether a processing action is in progress */
  isProcessing?: boolean;
  /** Whether the action should be disabled (e.g. business not approved) */
  disabled?: boolean;
  /** Color theme for the responded state */
  variant?: "green" | "gray";
}

export function ActivityActionCard({
  isPending,
  actionLabel,
  actionHref,
  onAction,
  actionIcon,
  actionDescription,
  respondedLabel,
  respondedDescription,
  backHref,
  backLabel,
  isProcessing = false,
  disabled = false,
  variant = "green",
}: ActivityActionCardProps) {
  if (isPending) {
    return (
    <div
      className="rounded-2xl p-5 space-y-4 bg-linear-to-br from-primary to-primary/80"
    >
        <div>
          <h3 className="text-white font-black text-lg">{actionLabel}</h3>
          {actionDescription && (
            <p className="text-white/60 text-xs font-medium mt-1">
              {actionDescription}
            </p>
          )}
        </div>
        {actionHref ? (
          <Button
            asChild={!disabled}
            disabled={disabled}
            className="w-full bg-secondary hover:bg-secondary/90 active:scale-95 text-white font-black text-sm rounded-xl h-11 border-0 shadow-md transition-all disabled:opacity-50"
          >
            {disabled ? (
              <div className="flex items-center justify-center gap-2">
                {actionIcon}
                {actionLabel}
              </div>
            ) : (
              <Link
                href={actionHref}
                className="flex items-center justify-center gap-2"
              >
                {actionIcon}
                {actionLabel}
              </Link>
            )}
          </Button>
        ) : (
          <Button
            onClick={onAction}
            disabled={isProcessing || disabled}
            className="w-full bg-secondary hover:bg-secondary/90 active:scale-95 text-white font-black text-sm rounded-xl h-11 border-0 shadow-md transition-all disabled:opacity-50"
          >
            {actionIcon}
            {isProcessing ? "Processing..." : actionLabel}
          </Button>
        )}
      </div>
    );
  }

  const isGray = variant === "gray";

  return (
    <div className={cn(
      "rounded-2xl p-5 space-y-4",
      isGray ? "bg-gray-100/80 border border-gray-200" : "bg-green-50 border border-green-200"
    )}>
      <div className="flex items-center gap-3">
        <PackageCheck className={cn("h-6 w-6 shrink-0", isGray ? "text-gray-400" : "text-green-600")} />
        <div>
          <h3 className={cn("font-black text-base leading-tight", isGray ? "text-gray-700" : "text-green-800")}>
            {respondedLabel}
          </h3>
          <p className={cn("text-xs font-medium mt-0.5", isGray ? "text-gray-500/70" : "text-green-700/70")}>
            {respondedDescription}
          </p>
        </div>
      </div>
      <Button
        asChild
        variant="outline"
        className="w-full rounded-xl font-black text-xs"
      >
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </div>
  );
}
