"use client";

import { Search, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationCard } from "@/components/dashboard/seller/quotations/quotation-card";

const quotations = [
  {
    id: "QUT-2025-001",
    customer: "Rajesh Malhotra",
    items: "Ultratech Cement (500 Bags)",
    amount: "2,25,000",
    date: "24 Dec 2025",
    status: "Accepted",
    expiry: "Expired",
  },
  {
    id: "QUT-2025-002",
    customer: "Sanjay Gupta",
    items: "TATA Tiscon 12mm (2 Tons)",
    amount: "1,30,000",
    date: "26 Dec 2025",
    status: "Sent",
    expiry: "Valid for 3 days",
  },
  {
    id: "QUT-2025-003",
    customer: "Anjali Sharma",
    items: "Premium Wall Tiles (1500 Sqft)",
    amount: "75,000",
    date: "22 Dec 2025",
    status: "Draft",
    expiry: "-",
  },
];

export default function QuotationsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">
            Deal Board
          </h1>
          <p className="text-foreground/60 font-bold italic mt-1">
            Track your active quotations and conversion status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-5 border-border font-bold bg-white italic"
          >
            <Filter size={18} className="mr-2 text-primary" />
            Filter Deals
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by quote ID or customer name..."
          className="w-full bg-white border border-border rounded-3xl py-4.5 pl-14 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Quotations List */}
      <div className="grid gap-6">
        {quotations.map((qut) => (
          <QuotationCard key={qut.id} {...qut} />
        ))}
      </div>

      {/* Quick Tip */}
      <div className="bg-primary/5 border border-primary/10 rounded-4xl p-8 flex items-center gap-6 shadow-xs">
        <div className="bg-white p-4 rounded-3xl shadow-md text-primary shrink-0">
          <AlertCircle size={32} />
        </div>
        <div>
          <p className="text-lg font-black text-primary italic leading-tight">
            Pro Tip: Following up on &quot;Sent&quot; quotations within 24 hours
            increases conversion by 40%!
          </p>
          <p className="text-sm font-medium text-primary/60 mt-1 italic">
            Personal reaching out builds trust with the buyers.
          </p>
        </div>
      </div>
    </div>
  );
}
