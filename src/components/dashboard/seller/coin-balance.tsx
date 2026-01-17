"use client";

import { IndianRupee, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CoinBalanceProps {
  className?: string;
  showAddButton?: boolean;
}

export function CoinBalance({ className, showAddButton = true }: CoinBalanceProps) {
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading } = useWalletDetails(entityId);

  if (isLoading) {
    return <Skeleton className="h-10 w-24 rounded-full" />;
  }

  const balance = wallet?.balance ?? 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link 
        href="/seller-dashboard/wallet"
        className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full hover:bg-amber-100 transition-colors group"
      >
        <IndianRupee size={18} className="text-amber-600 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-black text-amber-900 leading-none">
          {balance.toLocaleString()}
        </span>
        <span className="text-[10px] font-black text-amber-700/60 uppercase tracking-tighter leading-none pt-0.5">
          Coins
        </span>
      </Link>
      
      {showAddButton && (
        <Link
          href="/seller-dashboard/wallet"
          className="h-8 w-8 flex items-center justify-center bg-amber-600 text-white rounded-full hover:bg-amber-700 shadow-sm shadow-amber-200 transition-all hover:scale-105"
          title="Add Coins"
        >
          <Plus size={16} />
        </Link>
      )}
    </div>
  );
}
