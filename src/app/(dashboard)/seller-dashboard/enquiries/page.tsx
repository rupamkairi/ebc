"use client";

import { 
  Users, 
  ArrowRight, 
  Search, 
  Filter,
  Calendar,
  ChevronRight,
  Clock,
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
        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Customer Enquiries
              </h1>
              <p className="text-foreground/60 font-medium">
                Manage and respond to requirements from buyers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search enquiries..." 
                  className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <Button variant="outline" className="rounded-xl border-border h-11 px-4">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="grid gap-4">
            {enquiries.map((enq) => (
              <Card key={enq.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Status Indicator */}
                    <div className={`w-full md:w-1.5 h-1 md:h-24 ${
                      enq.status === 'New' ? 'bg-secondary' : 'bg-primary/40'
                    }`} />
                    
                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-foreground/50">
                            {enq.id}
                          </span>
                          {enq.status === 'New' && (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                              Active Enquiry
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {enq.customer}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm font-medium text-foreground/60">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} className="text-primary/60" />
                              {enq.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} className="text-primary/60" />
                              {enq.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} className="text-primary/60" />
                              {enq.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5">
                            <span className="text-sm font-bold text-primary">
                              Requirement: {enq.items}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/seller-dashboard/enquiries/${enq.id}`} className="w-full md:w-auto">
                          <Button className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white font-bold py-6 px-8 rounded-xl flex items-center gap-2 group/btn">
                            View Details & Quote
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

      <BottomNav />
    </div>
  );
}
