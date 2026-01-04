"use client";

import { 
  Wallet, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Plus,
  ChevronRight,
  TrendingUp,
  CreditCard
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
    description: "Inquiry Fee - Amit Sharma",
    amount: "50",
    type: "Debit",
    date: "24 Dec 2025, 10:30 AM",
    status: "Success",
  },
  {
    id: "TXN-102",
    description: "Added to Wallet - UPI",
    amount: "2,000",
    type: "Credit",
    date: "22 Dec 2025, 04:15 PM",
    status: "Success",
  },
  {
    id: "TXN-103",
    description: "Commission Payout - Order #992",
    amount: "1,250",
    type: "Credit",
    date: "20 Dec 2025, 11:00 AM",
    status: "Success",
  },
  {
    id: "TXN-104",
    description: "Withdrawal to Bank",
    amount: "5,000",
    type: "Debit",
    date: "15 Dec 2025, 02:30 PM",
    status: "Pending",
  },
];

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Balance Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary via-indigo-500 to-secondary rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Wallet size={120} className="text-primary" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground/40 italic">
                    <TrendingUp size={16} className="text-emerald-500" />
                    Available Coins / Balance
                  </div>
                  <div className="flex items-center gap-2 text-5xl md:text-6xl font-black text-foreground tracking-tight">
                    <IndianRupee className="md:size-12 size-10" />
                    12,450.00
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-foreground/40 italic">
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      ₹2,500 Added this month
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      ₹450 Spent this month
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="h-16 px-10 bg-secondary hover:bg-secondary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-secondary/20 flex items-center gap-3 group">
                    Add Money
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                  </Button>
                  <Button variant="outline" className="h-16 px-10 border-border text-foreground font-black text-lg rounded-2xl bg-white hover:bg-muted flex items-center gap-3">
                    Withdraw
                    <ArrowUpRight size={20} />
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
                  <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                    <History size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground">Transaction History</h2>
                </div>
                <Button variant="ghost" className="text-primary font-black hover:bg-primary/5 rounded-xl">
                  View All
                </Button>
              </div>

              <div className="grid gap-3">
                {transactions.map((txn) => (
                  <Card key={txn.id} className="border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${
                          txn.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {txn.type === 'Credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground leading-snug">{txn.description}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{txn.id}</span>
                            <span className="text-[10px] font-bold text-foreground/30 italic">{txn.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-black flex items-center justify-end ${
                          txn.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {txn.type === 'Credit' ? '+' : '-'}
                          <IndianRupee size={16} />
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

            {/* Saved Accounts / Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100/50 p-2.5 rounded-xl text-amber-700">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-black text-foreground">Withdrawal Method</h2>
              </div>

              <Card className="border-none shadow-sm bg-white overflow-hidden relative group cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CreditCard size={64} className="text-primary" />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-14 bg-slate-900 rounded-lg flex items-center justify-center">
                      <div className="h-6 w-8 bg-amber-500/20 rounded-sm" />
                    </div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-black tracking-tighter uppercase text-[9px]">Primary</Badge>
                  </div>
                  <div>
                    <h4 className="font-black text-foreground uppercase tracking-wider">HDFC BANK</h4>
                    <p className="text-xl font-mono font-bold text-foreground/40 mt-1">**** **** 9012</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Acc Holder</p>
                    <p className="text-sm font-bold text-foreground">RAJESH KUMAR ENTERPRISES</p>
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full h-12 border-dashed border-2 border-border text-foreground/40 hover:text-primary hover:border-primary font-black rounded-xl bg-transparent">
                <Plus size={18} className="mr-2" />
                Add New Bank Account
              </Button>

              <div className="bg-primary/5 p-6 rounded-3xl space-y-3">
                <h4 className="font-black text-primary italic">Why use EBC Wallet?</h4>
                <p className="text-xs font-medium text-primary/60 leading-relaxed">Faster inquiry unlocking, automatic invoice settlements, and exclusive rewards for high-balance sellers.</p>
                <Link href="#" className="inline-flex items-center text-xs font-black text-primary group underline underline-offset-4">
                  Learn About Coins
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
