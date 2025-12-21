"use client";

import { CheckCircle2, MapPin } from "lucide-react";

export function UserInfo() {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Namaste, Rajesh Kumar Ji <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-lg text-foreground/70 italic mt-1">
            "Aapka Business Ab Online — Aapke Sheher Mein!"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white font-semibold shadow-sm">
            <CheckCircle2 size={18} />
            <span>Verified Seller</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-foreground font-semibold shadow-sm">
            <MapPin size={18} className="text-primary" />
            <span>Service Area: 201301</span>
          </div>
        </div>
      </div>
    </div>
  );
}
