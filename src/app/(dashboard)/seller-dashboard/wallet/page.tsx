"use client";

import { useState } from "react";
import { 
  History,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet as WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import { RechargeModal } from "@/components/dashboard/seller/recharge-modal";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export default function WalletPage() {
  const { t } = useLanguage();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading } = useWalletDetails(entityId);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4 md:p-8">
        <div className="h-48 w-full bg-muted rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 w-full bg-muted rounded-2xl" />
            <div className="h-32 w-full bg-muted rounded-2xl" />
            <div className="h-32 w-full bg-muted rounded-2xl" />
          </div>
          <div className="h-96 w-full bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const transactions = wallet?.transactions ?? [];

  const REASON_LABELS: Record<string, string> = {
    VISIT_SUBMIT: "SITE VISIT LEADS UNLOCK",
    QUOTATION_SUBMIT: "PRODUCT LEADS UNLOCK",
    CREDIT_RECHARGE: "WALLET TOPUP",
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      <RechargeModal 
        isOpen={isRechargeOpen} 
        onClose={() => setIsRechargeOpen(false)} 
      />

      {/* Header Balance Card - Blue Theme */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 md:p-10 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="bg-white/10 p-4 rounded-xl">
            <WalletIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-100">{t("coin_balance")}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight">{balance.toLocaleString()}</span>
              <span className="text-base font-medium text-blue-100">{t("coins")}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            onClick={() => setIsRechargeOpen(true)}
            className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white border-0 rounded-lg px-6 h-11 font-semibold shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("add_coins")}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Transaction History */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-primary">{t("transaction_history")}</h3>
              </div>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="py-20 text-center opacity-30">
                    <History size={48} className="mx-auto mb-4" />
                    <p className="font-bold">{t("no_transactions_found")}</p>
                  </div>
                ) : (
                  transactions.map((txn) => {
                    const isTopup = txn.type === 'CREDIT';
                    return (
                      <div key={txn.id} className="border border-gray-100 rounded-xl p-4 transition-all duration-300 flex items-center gap-4 hover:border-orange-100">
                        <div className={cn(
                          "size-10 md:size-12 rounded-lg flex items-center justify-center shrink-0",
                          isTopup 
                            ? "bg-orange-50 text-secondary" 
                            : "bg-slate-50 text-primary"
                        )}>
                          {isTopup ? <ArrowUpRight size={18} className="md:size-5" /> : <ArrowDownLeft size={18} className="md:size-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-primary text-sm mb-0.5 truncate">
                            {REASON_LABELS[txn.reason] || txn.reason.replace(/_/g, ' ')}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">ID: {txn.id.slice(0, 8)}...</span>
                            <span>•</span>
                            <span className="font-medium">
                              {format(new Date(txn.createdAt), "dd MMM yyyy")}
                            </span>
                          </div>
                        </div>

                        <div className={cn(
                          "text-lg md:text-xl font-bold shrink-0",
                          isTopup ? "text-secondary" : "text-primary"
                        )}>
                          {isTopup ? '+' : '-'}{txn.amount}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Why EBC Coins Section */}
        <div className="lg:col-span-5">
          <Card className="bg-gradient-to-b from-primary to-primary/60 rounded-2xl p-6 text-white overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <WalletIcon className="h-6 w-6 text-secondary" />
                <h3 className="text-xl font-bold">{t("why_ebc_coins")}</h3>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                {t("secure_coin_system_faster_unlocks")}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  t("unlock_quotations_priority"),
                  t("priority_site_visit_requests"),
                  t("featured_search_visibility"),
                  t("exclusive_seller_deals")
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-secondary shrink-0" />
                    <span className="text-sm font-medium text-blue-50">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
