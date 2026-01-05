"use client";

import { 
  Search, 
  ChevronRight,
  Calendar,
  MapPin
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const enquiries = [
  {
    id: "ENQ-001",
    customer: "Amit Sharma",
    location: "Indore, MP",
    items: "Cement (50 bags)",
    date: "22 Dec 2025",
    time: "10:30 AM",
    status: "New",
    priority: "High",
  },
  {
    id: "ENQ-002",
    customer: "Priya Verma",
    location: "Ujjain, MP",
    items: "Bricks (5000 pcs)",
    date: "22 Dec 2025",
    time: "11:45 AM",
    status: "New",
    priority: "Medium",
  },
  {
    id: "ENQ-003",
    customer: "Rahul Gupta",
    location: "Bhopal, MP",
    items: "Sariya (2 Ton)",
    date: "21 Dec 2025",
    time: "03:20 PM",
    status: "Quoted",
    priority: "High",
  },
  {
    id: "ENQ-004",
    customer: "Vivek Roy",
    location: "Indore, MP",
    items: "Marble (1200 Sqft)",
    date: "21 Dec 2025",
    time: "05:10 PM",
    status: "New",
    priority: "Low",
  },
];

export default function EnquiriesPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-foreground tracking-tight italic">
                Active Enquiries
              </h1>
              <p className="text-foreground/60 font-bold italic mt-1">
                New leads from buyers looking for your products & services.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
                <input 
                  type="text" 
                  placeholder="Search leads by customer or item..." 
                  className="w-full bg-white border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="grid gap-6">
            {enquiries.map((enq) => (
              <Card key={enq.id} className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group bg-white rounded-4xl">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Urgency/Status Marker */}
                    <div className={`w-full md:w-2 h-2 md:h-auto ${
                      enq.status === 'New' ? 'bg-amber-500' : 'bg-primary/30'
                    }`} />
                    
                    <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                            LEAD {enq.id}
                          </span>
                          {enq.status === 'New' && (
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Premium Lead
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors italic">
                            {enq.customer}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm font-bold text-foreground/40 italic">
                            <span className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary" />
                              {enq.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar size={16} className="text-primary" />
                              {enq.date}, {enq.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-3 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Buyer Requirement</p>
                            <span className="text-lg font-black text-primary italic">
                              {enq.items}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        {enq.status === 'New' ? (
                          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 font-black text-xs uppercase px-4 py-2 rounded-xl border border-amber-100 italic">
                              Unlock for 5 Coins
                            </div>
                            <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black py-7 px-10 rounded-2xl flex items-center gap-3 group/btn shadow-xl shadow-amber-200">
                              Unlock Lead
                              <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        ) : (
                          <Link href={`/seller-dashboard/enquiries/${enq.id}`} className="w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-black py-7 px-10 rounded-2xl flex items-center gap-3 group/btn shadow-xl shadow-primary/20">
                              Create Quotation
                              <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
