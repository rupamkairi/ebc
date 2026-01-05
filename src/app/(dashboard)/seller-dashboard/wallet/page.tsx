"use client";

import { 
  Wallet, 
  CircleDollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Plus,
  ChevronRight,
  TrendingUp,
  FileSearch,
  CalendarDays
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const transactions = [
  {
    id: "TXN-101",
    description: "Quotation Unlocked - Amit Sharma",
    amount: "5 coins",
    type: "Debit",
    date: "24 Dec 2025, 10:30 AM",
    status: "Success",
    icon: FileSearch
  },
  {
    id: "TXN-102",
    description: "Added Coins - UPI",
    amount: "500 coins",
    type: "Credit",
    date: "22 Dec 2025, 04:15 PM",
    status: "Success",
    icon: Plus
  },
  {
    id: "TXN-103",
    description: "Appointment Fee - Site Visit #992",
    amount: "10 coins",
    type: "Debit",
    date: "20 Dec 2025, 11:00 AM",
    status: "Success",
    icon: CalendarDays
  },
  {
    id: "TXN-104",
    description: "Quotation Unlock - Metro Projects",
    amount: "5 coins",
    type: "Debit",
    date: "15 Dec 2025, 02:30 PM",
    status: "Success",
    icon: FileSearch
  },
];

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Coin Balance Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm text-center md:text-left">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CircleDollarSign size={120} className="text-amber-500" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-black uppercase tracking-widest text-foreground/40 italic">
                    <TrendingUp size={16} className="text-amber-500" />
                    Available Coin Balance
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-5xl md:text-7xl font-black text-foreground tracking-tight">
                    <CircleDollarSign className="md:size-16 size-12 text-amber-500" />
                    1,245
                  </div>
                  <p className="text-xs font-bold text-foreground/40 italic">
                    Use coins to unlock enquiries and premium appointments.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="h-16 px-10 bg-amber-600 hover:bg-amber-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-amber-200 flex items-center gap-3 group">
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
                <Button variant="ghost" className="text-amber-700 font-black hover:bg-amber-50 rounded-xl">
                  View All
                </Button>
              </div>

              <div className="grid gap-3">
                {transactions.map((txn) => (
                  <Card key={txn.id} className="border-none shadow-sm hover:shadow-md transition-all group/card">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${
                          txn.type === 'Credit' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <txn.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground leading-snug group-hover/card:text-amber-600 transition-colors">{txn.description}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{txn.id}</span>
                            <span className="text-[10px] font-bold text-foreground/30 italic">{txn.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-black flex items-center justify-end ${
                          txn.type === 'Credit' ? 'text-amber-600' : 'text-foreground'
                        }`}>
                          {txn.type === 'Credit' ? '+' : '-'}
                          {txn.amount}
                        </div>
                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-tighter mt-1 outline-none border-none py-0 h-4 ${
                          txn.status === 'Success' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-amber-100/50 text-amber-700'
                        }`}>
                          {txn.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Why use coins? */}
            <div className="space-y-6">
               <div className="bg-white p-8 rounded-4xl border border-border space-y-6">
                  <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                    <CircleDollarSign size={28} />
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
      </main>

      <BottomNav />
    </div>
  );
}
