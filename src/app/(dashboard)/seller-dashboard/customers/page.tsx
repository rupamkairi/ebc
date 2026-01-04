"use client";

import { 
  Search, 
  Filter,
  User,
  Phone,
  MapPin,
  MoreVertical,
  Star,
  ArrowRight
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const customers = [
  {
    id: "CUS-001",
    name: "Amit Sharma",
    location: "Indore, MP",
    phone: "+91 98765 43210",
    lastEnquiry: "Cement (500 Bags)",
    status: "Active Buyer",
    orders: 3,
    totalValue: "4,50,000",
  },
  {
    id: "CUS-002",
    name: "Priya Verma",
    location: "Ujjain, MP",
    phone: "+91 99887 76655",
    lastEnquiry: "Bricks (5000 pcs)",
    status: "Lead",
    orders: 0,
    totalValue: "0",
  },
  {
    id: "CUS-003",
    name: "Rahul Gupta",
    location: "Bhopal, MP",
    phone: "+91 88776 65544",
    lastEnquiry: "Sariya (2 Ton)",
    status: "Repeat Buyer",
    orders: 5,
    totalValue: "8,20,000",
  },
];

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                My Customers
              </h1>
              <p className="text-foreground/60 font-medium">
                Manage your customer relationships and history.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-12 px-5 border-border font-bold bg-white">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
              <Button className="rounded-2xl h-12 px-6 bg-primary text-white font-black shadow-lg shadow-primary/20 flex items-center gap-2">
                Export List
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, phone or location..." 
              className="w-full bg-white border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customers.map((cus) => (
              <Card key={cus.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                          <User size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {cus.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`uppercase tracking-tighter font-black text-[9px] rounded-full px-2 py-0.5 ${
                              cus.status === 'Lead' ? 'bg-slate-100 text-slate-700 hover:bg-slate-100' :
                              cus.status === 'Repeat Buyer' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                              'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            }`}>
                              {cus.status}
                            </Badge>
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                              ID: {cus.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full text-foreground/20 hover:text-primary">
                        <MoreVertical size={20} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/60 italic">
                          <MapPin size={14} className="text-primary/60" />
                          {cus.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/60 italic">
                          <Phone size={14} className="text-primary/60" />
                          {cus.phone}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-2xl text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Orders</p>
                        <p className="text-xl font-black text-foreground">{cus.orders}</p>
                        <p className="text-[10px] font-bold text-primary italic">₹{cus.totalValue}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Latest Activity</p>
                        <p className="text-xs font-bold text-foreground/80 leading-snug">
                          {cus.lastEnquiry}
                        </p>
                      </div>
                      <Button variant="outline" className="h-10 border-border hover:border-primary hover:text-primary font-bold rounded-xl px-5 text-xs group/btn bg-white">
                        View Profile
                        <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <Star size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-emerald-900 leading-tight">Your Loyalty Score: A+</h4>
                <p className="text-emerald-700/60 font-bold italic">Top 5% of sellers in Indore for repeat business!</p>
              </div>
            </div>
            <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 h-14 rounded-2xl shadow-xl shadow-emerald-100">
              View Analytics
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
