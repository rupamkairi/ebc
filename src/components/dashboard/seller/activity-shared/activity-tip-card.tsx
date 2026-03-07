"use client";

import { AlertCircle } from "lucide-react";

interface ActivityTipCardProps {
  tipText: string;
}

export function ActivityTipCard({ tipText }: ActivityTipCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{
        background: "linear-gradient(145deg, #3D52A0 0%, #2a3a7c 100%)",
      }}
    >
      <AlertCircle className="h-4 w-4 text-[#FFA500] shrink-0 mt-0.5" />
      <p className="text-xs text-white/80 leading-relaxed">
        <span className="text-white font-black">Tip : </span>
        {tipText}
      </p>
    </div>
  );
}
