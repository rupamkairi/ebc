"use client";

import { 
  FileText, 
  Search, 
  Filter,
  Plus,
  IndianRupee,
  Clock,
  ChevronRight,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Quotations
              </h1>
              <p className="text-foreground/60 font-medium">
                Track status of quotes and manage your deals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-12 px-5 border-border font-bold bg-white">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
              <Button className="rounded-2xl h-12 px-6 bg-secondary hover:bg-secondary/90 text-white font-black shadow-lg shadow-secondary/20 flex items-center gap-2">
                <Plus size={20} />
                Create New Quote
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input 
              type="text" 
              placeholder="Search by quote ID or customer name..." 
              className="w-full bg-white border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Quotations List */}
          <div className="grid gap-4">
            {quotations.map((qut) => (
              <Card key={qut.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Status Indicator Bar */}
                    <div className={`w-full md:w-1.5 h-1 md:h-auto ${
                      qut.status === 'Accepted' ? 'bg-emerald-500' : 
                      qut.status === 'Sent' ? 'bg-blue-500' : 'bg-slate-300'
                    }`} />
                    
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center text-foreground/20 shrink-0">
                          <FileText size={32} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-foreground/50">
                              {qut.id}
                            </span>
                            <Badge className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-2.5 py-0.5 ${
                              qut.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                              qut.status === 'Sent' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                              'bg-slate-100 text-slate-700 hover:bg-slate-100'
                            }`}>
                              {qut.status}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-foreground">
                            {qut.customer}
                          </h3>
                          <p className="text-sm font-bold text-foreground/40 italic">
                            {qut.items}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Amount</p>
                          <div className="flex items-center justify-end font-black text-primary text-2xl">
                            <IndianRupee size={20} />
                            {qut.amount}
                          </div>
                          <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-foreground/30 mt-1">
                            <Clock size={10} />
                            {qut.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button variant="outline" className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-bold rounded-xl px-8 h-12 group/btn bg-white">
                            View Details
                            <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full text-foreground/20 hover:text-primary hidden md:flex">
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

          {/* Quick Tip */}
          <div className="bg-primary/5 border border-primary/10 rounded-4xl p-6 flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-primary">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-primary italic">Pro Tip: Following up on &quot;Sent&quot; quotations within 24 hours increases conversion by 40%!</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
