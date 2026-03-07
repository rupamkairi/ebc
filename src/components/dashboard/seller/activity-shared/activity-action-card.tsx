"use client";

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
}: ActivityActionCardProps) {
  if (isPending) {
    return (
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "linear-gradient(145deg, #3D52A0 0%, #2a3a7c 100%)",
        }}
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
            asChild
            className="w-full bg-[#FFA500] hover:bg-[#e69500] active:scale-95 text-white font-black text-sm rounded-xl h-11 border-0 shadow-md transition-all"
          >
            <Link
              href={actionHref}
              className="flex items-center justify-center gap-2"
            >
              {actionIcon}
              {actionLabel}
            </Link>
          </Button>
        ) : (
          <Button
            onClick={onAction}
            disabled={isProcessing}
            className="w-full bg-[#FFA500] hover:bg-[#e69500] active:scale-95 text-white font-black text-sm rounded-xl h-11 border-0 shadow-md transition-all"
          >
            {actionIcon}
            {isProcessing ? "Processing..." : actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 space-y-4 bg-green-50 border border-green-200">
      <div className="flex items-center gap-3">
        <PackageCheck className="h-6 w-6 text-green-600 shrink-0" />
        <div>
          <h3 className="text-green-800 font-black text-base leading-tight">
            {respondedLabel}
          </h3>
          <p className="text-green-700/70 text-xs font-medium mt-0.5">
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
