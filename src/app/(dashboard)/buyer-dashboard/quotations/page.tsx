"use client";

import { 
  ArrowLeft, 
  FileText, 
  ChevronRight, 
  IndianRupee, 
  UserCircle, 
  Star,
  CheckCircle2,
  Clock,
  Filter,
  Search
} from "lucide-react";
import { BuyerHeader } from "../buyer-header";
import { BuyerBottomNav } from "../buyer-bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const quotations = [
  {
    id: "QUT-441",
    seller: "Global Hardware & Paints",
    rating: 4.8,
    items: "Cement (50 Bags), Bricks (5000 Pcs)",
    amount: "78,500",
    date: "10 mins ago",
    status: "New",
    isVerified: true,
  },
  {
    id: "QUT-392",
    seller: "Indore Building Materials",
    rating: 4.5,
    items: "Cement (50 Bags), Bricks (5000 Pcs)",
    amount: "76,200",
    date: "1 hour ago",
    status: "Reviewed",
    isVerified: true,
  },
  {
    id: "QUT-311",
    seller: "Prime Construct Solutions",
    rating: 4.2,
    items: "Cement (50 Bags), Bricks (5000 Pcs)",
    amount: "81,000",
    date: "3 hours ago",
    status: "Review",
    isVerified: false,
  },
];

export default function QuotationsListPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <BuyerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Received Quotations
              </h1>
              <p className="text-foreground/60 font-medium">
                Compare prices and details from different sellers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search quotes..." 
                  className="w-full h-12 bg-white border border-border rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <Button variant="outline" className="rounded-2xl h-12 px-6 border-border font-black text-sm uppercase tracking-wide gap-2">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {/* Quotations List */}
          <div className="grid gap-6">
            {quotations.map((quote) => (
              <Card key={quote.id} className="border-none shadow-sm hover:shadow-xl transition-all group rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Seller Profile Side */}
                    <div className="md:w-72 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{quote.id}</span>
                          {quote.status === 'New' && (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-black text-foreground leading-tight group-hover:text-primary transition-colors text-lg">
                            {quote.seller}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-orange-500">
                              <Star size={12} className="fill-current" />
                              <span className="text-xs font-black ml-1 text-foreground/70">{quote.rating}</span>
                            </div>
                            {quote.isVerified && (
                              <div className="flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                                <CheckCircle2 size={10} />
                                Verified
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="pt-6 mt-6 border-t border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Response Time</p>
                        <p className="text-xs font-bold text-foreground/60 flex items-center gap-1">
                          <Clock size={12} />
                          {quote.date}
                        </p>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-8 flex flex-col md:flex-row justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Includes Items</p>
                          <p className="text-lg font-bold text-foreground">
                            {quote.items}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-foreground/60 border border-slate-100">
                            Delivery Included
                          </div>
                          <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-foreground/60 border border-slate-100">
                            GST Invoice Available
                          </div>
                        </div>
                      </div>

                      <div className="md:w-56 flex flex-col justify-between items-end gap-6 text-right">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Quote Amount</p>
                          <div className="flex items-center justify-end text-3xl font-black text-primary">
                            <IndianRupee size={22} className="mt-1" />
                            {quote.amount}
                          </div>
                        </div>

                        <Link href={`/buyer-dashboard/quotations/${quote.id}`} className="w-full">
                          <Button className="w-full bg-slate-900 hover:bg-primary text-white font-black py-6 rounded-2xl flex items-center justify-center gap-2 group/btn active:scale-95 transition-all">
                            Review Details
                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
