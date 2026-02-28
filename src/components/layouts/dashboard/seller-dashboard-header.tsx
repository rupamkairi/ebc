"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinBalance } from "@/components/dashboard/seller/coin-balance";
import { UnifiedHeader } from "@/components/shared/unified-header";

export function SellerDashboardHeader() {
  const centerContent = (
    <nav className="hidden lg:flex items-center gap-6">
      <Link
        href="/seller-dashboard"
        className="text-sm font-medium transition-colors hover:text-[#445EB4]"
      >
        Home
      </Link>
      <Link
        href="/seller-dashboard/catalog"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4]"
      >
        My Catalog
      </Link>
      <Link
        href="/seller-dashboard/enquiries"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4]"
      >
        Enquiries
      </Link>
      <Link
        href="/seller-dashboard/support"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4]"
      >
        Support
      </Link>
    </nav>
  );

  const rightContent = (
    <div className="flex items-center gap-4">
      <CoinBalance className="hidden md:flex" />
      <Button
        variant="default"
        size="sm"
        className="hidden sm:flex items-center gap-2 rounded-full"
      >
        <PhoneCall size={16} />
        <span>Support</span>
      </Button>
    </div>
  );

  return (
    <UnifiedHeader
      variant="seller"
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
