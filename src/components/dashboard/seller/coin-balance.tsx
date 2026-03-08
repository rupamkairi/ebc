"use client";

import { Wallet, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CoinBalanceProps {
  className?: string;
  showAddButton?: boolean;
}

export function CoinBalance({
  className,
  showAddButton = true,
}: CoinBalanceProps) {
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading } = useWalletDetails(entityId);

  if (isLoading) {
    return <Skeleton className="h-9 w-24 rounded-full" />;
  }

  const balance = wallet?.balance ?? 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link href="/seller-dashboard/wallet">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2 h-9 px-4"
        >
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{balance.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground font-normal">
            Coins
          </span>
        </Button>
      </Link>

      {showAddButton && (
        <Link href="/seller-dashboard/wallet">
          <Button
            size="icon"
            variant="outline"
className="h-9 w-9 rounded-full bg-green-500 border-green-500 text-white"
            title="Add Coins"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
