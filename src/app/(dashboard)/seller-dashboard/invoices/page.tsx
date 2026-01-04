"use client";

import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  IndianRupee,
  Calendar,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const invoices = [
  {
    id: "INV-2025-441",
    orderId: "ORD-992",
    customer: "Amit Sharma",
    amount: "2,25,000",
    date: "24 Dec 2025",
    status: "Paid",
  },
  {
    id: "INV-2025-442",
    orderId: "ORD-995",
    customer: "Rahul Gupta",
    amount: "1,30,000",
    date: "26 Dec 2025",
    status: "Unpaid",
  },
  {
    id: "INV-2025-440",
    orderId: "ORD-980",
    customer: "Sanjay Malhotra",
    amount: "50,000",
    date: "20 Dec 2025",
    status: "Paid",
  },
];

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Invoices
              </h1>
              <p className="text-foreground/60 font-medium">
                Download and manage your billing records.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-12 px-5 border-border font-bold bg-white">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
              <Button className="rounded-2xl h-12 px-6 bg-primary text-white font-black shadow-lg shadow-primary/20 flex items-center gap-2">
                Batch Download
              </Button>
            </div>
          </div>

          {/* Invoices List */}
          <div className="grid gap-4">
            {invoices.map((inv) => (
              <Card key={inv.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center text-foreground/20 shrink-0">
                          <FileText size={28} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-foreground/50">
                              {inv.id}
                            </span>
                            <Badge className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-2.5 py-0.5 ${
                              inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                            }`}>
                              {inv.status}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">
                            Invoice for {inv.customer}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-foreground/30">
                            <span className="flex items-center gap-1 uppercase tracking-tight">
                              Order ID: {inv.orderId}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 italic">
                              Issued on {inv.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Amount</p>
                          <div className="flex items-center justify-end font-black text-foreground text-xl">
                            <IndianRupee size={16} />
                            {inv.amount}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button variant="outline" className="h-12 border-border hover:border-primary hover:text-primary font-bold rounded-xl px-6 bg-white flex items-center gap-2">
                            <Download size={18} />
                            <span className="hidden sm:inline">Download PDF</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full text-foreground/20 hover:text-primary">
                            <MoreVertical size={20} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Need Help Banner */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <ExternalLink size={160} />
            </div>
            <div className="space-y-2 relative z-10 text-center md:text-left">
              <h4 className="text-2xl font-black italic tracking-tight">GST Filing Made Easy!</h4>
              <p className="text-white/60 font-medium">Export and sync your invoices directly with your favorite accounting software.</p>
            </div>
            <Button className="relative z-10 bg-white text-slate-900 hover:bg-white/90 font-black px-10 h-14 rounded-2xl shadow-xl">
              Connect Software
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
