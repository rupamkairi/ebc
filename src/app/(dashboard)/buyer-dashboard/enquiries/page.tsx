"use client";

import { 
  Search, 
  Filter,
  Calendar,
  ChevronRight,
  Clock,
  Plus
} from "lucide-react";
import { BuyerHeader } from "../buyer-header";
import { BuyerBottomNav } from "../buyer-bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const requirements = [
  {
    id: "REQ-882",
    title: "Cement & Bricks",
    items: "Ultratech Cement (50 bags), Red Bricks (5000 pcs)",
    date: "22 Dec 2025",
    time: "10:30 AM",
    status: "Active",
    quotes: 5,
  },
  {
    id: "REQ-721",
    title: "Electrical Fitting",
    items: "Havells Wire (10 bundles), MCB Box (2 pcs)",
    date: "22 Dec 2025",
    time: "11:45 AM",
    status: "Active",
    quotes: 8,
  },
  {
    id: "REQ-654",
    title: "Sanitary Ware",
    items: "Hindware Commode (2 pcs), Wash Basin (3 pcs)",
    date: "21 Dec 2025",
    time: "03:20 PM",
    status: "Draft",
    quotes: 0,
  },
  {
    id: "REQ-598",
    title: "Paint & Putty",
    items: "Asian Paints Royale (20L), Birla Putty (40kg)",
    date: "21 Dec 2025",
    time: "05:10 PM",
    status: "Active",
    quotes: 12,
  },
];

export default function BuyerEnquiriesPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <BuyerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                My Requirements
              </h1>
              <p className="text-foreground/60 font-medium">
                Manage your construction material requests.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/buyer-dashboard/enquiries/new">
                <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold h-11 px-6 rounded-xl hidden md:flex items-center gap-2">
                  <Plus size={18} />
                  Post New Requirement
                </Button>
              </Link>
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search requirements..." 
                  className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <Button variant="outline" className="rounded-xl border-border h-11 px-4">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Requirements List */}
          <div className="grid gap-4">
            {requirements.map((req) => (
              <Card key={req.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Status Indicator */}
                    <div className={`w-full md:w-1.5 h-1 md:h-24 ${
                      req.status === 'Active' ? 'bg-secondary' : 'bg-muted'
                    }`} />
                    
                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-foreground/50">
                            {req.id}
                          </span>
                          {req.status === 'Active' && (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Requirement Live
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {req.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm font-medium text-foreground/60">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} className="text-primary/60" />
                              {req.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} className="text-primary/60" />
                              {req.time}
                            </span>
                            <span className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-[10px] uppercase font-black">
                              {req.quotes} Quotes Received
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5">
                            <span className="text-sm font-bold text-primary">
                              Details: {req.items}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href="/buyer-dashboard/quotations" className="w-full md:w-auto">
                          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 rounded-xl flex items-center gap-2 group/btn">
                            View All Quotes
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
