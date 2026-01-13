"use client";

import { useState } from "react";
import { 
  IndianRupee, 
  History,
  Plus,
  TrendingUp,
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

export default function WalletPage() {
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading } = useWalletDetails(entityId);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const transactions = wallet?.transactions ?? [];

  return (
    <div className="flex flex-col gap-8">
      <RechargeModal 
        isOpen={isRechargeOpen} 
        onClose={() => setIsRechargeOpen(false)} 
      />

      {/* Coin Balance Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm text-center md:text-left">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <IndianRupee size={120} className="text-amber-500" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-black uppercase tracking-widest text-foreground/40 italic">
                <TrendingUp size={16} className="text-amber-500" />
                Available Coin Balance
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-5xl md:text-7xl font-black text-foreground tracking-tight">
                <IndianRupee className="md:size-16 size-12 text-amber-500 shadow-amber-200" />
                {balance.toLocaleString()}
              </div>
              <p className="text-xs font-bold text-foreground/40 italic">
                Use coins to unlock enquiries and premium appointments.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => setIsRechargeOpen(true)}
                className="h-16 px-10 bg-amber-600 hover:bg-amber-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-amber-200 flex items-center gap-3 group"
              >
                Add Coins
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100/50 p-2.5 rounded-xl text-amber-700">
                <History size={24} />
              </div>
              <h2 className="text-2xl font-black text-foreground">Transaction History</h2>
            </div>
          </div>

          <div className="grid gap-3">
            {transactions.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-border">
                <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-black text-foreground">No Transactions Yet</h3>
                <p className="text-sm font-bold text-muted-foreground italic">Your coin history will appear here.</p>
              </div>
            ) : (
              transactions.map((txn) => (
                <Card key={txn.id} className="border-none shadow-sm hover:shadow-md transition-all group/card">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        txn.type === 'CREDIT' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {txn.type === 'CREDIT' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground leading-snug group-hover/card:text-amber-600 transition-colors uppercase text-sm tracking-tight">{txn.reason}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{txn.id}</span>
                          <span className="text-[10px] font-bold text-foreground/30 italic">
                            {format(new Date(txn.createdAt), "dd MMM yyyy, hh:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black flex items-center justify-end ${
                        txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {txn.type === 'CREDIT' ? '+' : '-'}
                        {txn.amount}
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-tighter mt-1 outline-none border-none py-0 h-4 ${
                        txn.status === 'SUCCESS' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-amber-100/50 text-amber-700'
                      }`}>
                        {txn.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Why use coins? */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-4xl border border-border space-y-6 sticky top-24">
              <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                <IndianRupee size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-foreground italic">Why EBC Coins?</h3>
                <p className="text-sm font-medium text-foreground/60 leading-relaxed">
                  Our secure coin system ensures faster unlocks and seamless appointment management without needing external payment every time.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlock Quotations Instantly",
                  "Priority Site Visit Requests",
                  "Featured Search Visibility",
                  "Exclusive Seller Rewards"
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-xs font-bold text-foreground/70 italic">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full h-12 border-amber-600/20 text-amber-700 font-black rounded-xl hover:bg-amber-50">
                Learn More
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
