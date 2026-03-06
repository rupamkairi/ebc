"use client";

import { useState } from "react";
import { 
  History,
  Plus,
  ArrowDownLeft,
  ArrowUpRight
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
    CREDIT_RECHARGE: "WALLET_TOPUP",
  };

  return (
    <div className="flex flex-col gap-6 md:gap-10 p-4 md:p-8 max-w-7xl mx-auto">
      <RechargeModal 
        isOpen={isRechargeOpen} 
        onClose={() => setIsRechargeOpen(false)} 
      />

      {/* Header Balance Card */}
      <div className="w-full bg-linear-to-r from-[#F57C00] to-[#FFA000] rounded-3xl p-6 md:p-10 shadow-lg shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative overflow-hidden group">
        {/* Decorative Coin Silhouette */}
        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700 hidden md:block">
           <div className="size-64 rounded-full border-[20px] border-white" />
        </div>
        
        <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left relative z-10">
          <h2 className="text-white/90 text-sm md:text-xl font-bold tracking-tight uppercase md:normal-case">{t("available_coin_balance")}</h2>
          <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
             <div className="size-10 md:size-16 rounded-full border-4 md:border-[6px] border-[#E65100] bg-[#FFB300] flex items-center justify-center shadow-inner">
                <div className="size-6 md:size-10 rounded-full border-2 border-[#E65100]/30" />
             </div>
             <span className="text-4xl md:text-7xl font-black text-white drop-shadow-sm tracking-tight italic">
               {balance.toLocaleString()}
             </span>
          </div>
        </div>

        <Button 
          onClick={() => setIsRechargeOpen(true)}
          className="bg-white hover:bg-white/90 text-[#F57C00] h-12 md:h-16 w-full md:w-auto px-10 rounded-2xl font-black text-base md:text-xl shadow-xl shadow-black/5 flex items-center gap-3 active:scale-95 transition-all relative z-10"
        >
          <Plus size={20} className="md:size-6" strokeWidth={3} />
          {t("add_coins_btn")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left Column: Transaction History */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-xs space-y-6 md:space-y-8">
           <div className="flex items-center gap-3">
              <h3 className="text-lg md:text-xl font-black text-[#1A237E] uppercase tracking-wider">{t("transaction_history_title")}</h3>
           </div>

           <div className="space-y-3">
             {transactions.length === 0 ? (
               <div className="py-20 text-center opacity-30">
                 <History size={48} className="mx-auto mb-4" />
                 <p className="font-bold uppercase tracking-widest text-sm">{t("no_transactions_found")}</p>
               </div>
             ) : (
               transactions.map((txn) => {
                 const isTopup = txn.type === 'CREDIT';
                 return (
                   <div key={txn.id} className="group border-2 border-slate-50 hover:border-slate-100 rounded-2xl p-4 md:p-6 transition-all duration-300 flex items-center gap-4 md:gap-6">
                      <div className={cn(
                        "size-10 md:size-14 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors",
                        isTopup 
                          ? "bg-orange-50/50 border-orange-100 text-[#F57C00]" 
                          : "bg-slate-50 border-slate-100 text-[#1A237E]"
                      )}>
                        {isTopup ? <ArrowUpRight size={20} className="md:size-7" strokeWidth={2.5} /> : <ArrowDownLeft size={20} className="md:size-7" strokeWidth={2.5} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#1A237E] text-xs md:text-base mb-0.5 md:mb-1 tracking-tight truncate leading-tight">
                          {REASON_LABELS[txn.reason] || txn.reason.replace(/_/g, ' ')}
                        </h4>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-[9px] md:text-xs">
                           <span className="font-bold text-slate-300 uppercase truncate">ID: {txn.id.slice(0, 12)}...</span>
                           <span className="hidden md:inline text-slate-200">|</span>
                           <span className="font-bold text-slate-300 italic">
                             {format(new Date(txn.createdAt), "dd MMM yyyy")}
                           </span>
                        </div>
                      </div>

                      <div className={cn(
                        "text-lg md:text-2xl font-black italic shrink-0",
                        isTopup ? "text-[#F57C00]" : "text-[#1A237E]"
                      )}>
                        {isTopup ? '+' : '-'}{txn.amount}
                      </div>
                   </div>
                 );
               })
             )}
           </div>
        </div>

        {/* Right Column: Why EBC Coins Section */}
        <div className="lg:col-span-5">
           <div className="bg-[#1A237E] rounded-[2rem] p-6 md:p-10 space-y-6 md:space-y-8 text-white relative overflow-hidden lg:sticky lg:top-8">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 relative z-10 text-center md:text-left">
                <div className="size-16 md:size-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0 shadow-2xl">
                   <div className="size-10 md:size-12 rounded-full border-4 border-[#FFA000] bg-[#FFB300] shadow-inner" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-4xl font-black text-[#FFD54F] italic leading-tight uppercase md:normal-case">{t("why_ebc_coins")}</h3>
                  <p className="text-[10px] md:text-sm text-white/50 font-bold leading-relaxed italic max-w-xs mx-auto md:mx-0">
                    {t("secure_coin_system_faster_unlocks")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6 relative z-10 max-w-sm mx-auto md:mx-0">
                 {[
                   t("unlock_quotations_priority"),
                   t("priority_site_visit_requests"),
                   t("featured_search_visibility"),
                   t("exclusive_seller_deals")
                 ].map((benefit) => (
                   <div key={benefit} className="flex items-center gap-3 md:gap-4">
                      <div className="size-2 md:size-3 rounded-full bg-[#FFA000] shadow-[0_0_10px_rgba(255,160,0,0.5)] shrink-0" />
                      <span className="text-xs md:text-base font-black italic text-white/90">{benefit}</span>
                   </div>
                 ))}
              </div>

              <Button className="w-full h-14 md:h-16 bg-white hover:bg-slate-50 text-[#1A237E] font-black text-base md:text-xl rounded-2xl shadow-2xl relative z-10 transition-transform active:scale-[0.98] uppercase md:normal-case">
                {t("learn_more_btn")}
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
