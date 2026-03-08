"use client";

import { ActivityUser } from "@/types/activity";
import { User, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BuyerInfoCardProps {
  buyer?: ActivityUser;
  isContactRevealed: boolean;
}

export function BuyerInfoCard({
  buyer,
  isContactRevealed,
}: BuyerInfoCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className="rounded-2xl p-5 space-y-4 bg-gradient-to-br from-secondary to-secondary/80"
    >
      <h3 className="text-white font-black text-base flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        {t("buyer_information")}
      </h3>
      <div className="space-y-2.5">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">
              {buyer?.name?.[0]?.toUpperCase() || "B"}
            </span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">
              {buyer?.name || t("anonymous_buyer")}
            </p>
            <p className="text-white/60 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
              {buyer?.role || "Buyer"}
            </p>
          </div>
        </div>
        {/* Phone */}
        {buyer?.phone && (
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Phone className="h-3 w-3 text-white" />
            </div>
            {isContactRevealed ? buyer.phone : "+91 ••••• •••••"}
          </div>
        )}
        {/* Email */}
        {buyer?.email && (
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Mail className="h-3 w-3 text-white" />
            </div>
            {isContactRevealed ? buyer.email : "••••••••@••••.com"}
          </div>
        )}
      </div>
    </div>
  );
}
