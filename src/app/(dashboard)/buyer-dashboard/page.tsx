"use client";

import { 
  Plus, 
  Search, 
  FileText, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Building2
} from "lucide-react";
import { BuyerHeader } from "./buyer-header";
import { BuyerBottomNav } from "./buyer-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function BuyerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <BuyerHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Hero */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              Everything for your home
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              What are you <span className="text-blue-400">building</span> today?
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Post your requirement once and get multiple quotes from verified sellers & providers in minutes.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/buyer-dashboard/enquiries/new">
                <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl text-lg font-black shadow-lg shadow-blue-600/20">
                  <Plus className="mr-2" /> Post Requirement
                </Button>
              </Link>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 h-14 px-8 rounded-2xl text-lg font-black">
                Explore Products
              </Button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-[-10%] top-[-20%] h-[150%] w-1/2 opacity-20 hidden lg:block">
            <Building2 size={600} className="text-blue-500 rotate-12" />
          </div>
        </section>

        {/* Quick Stats / Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Active Enquiries</p>
                <p className="text-2xl font-black text-foreground">03</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <FileText size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Quotes Received</p>
                <p className="text-2xl font-black text-foreground">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Truck size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Ongoing Deliveries</p>
                <p className="text-2xl font-black text-foreground">01</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Active Requirements List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-foreground">My Requirements</h2>
              <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">View All</Button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'REQ-882', title: 'Cement & Bricks', date: 'Posted 2 hours ago', quotes: 5, color: 'bg-orange-500' },
                { id: 'REQ-721', title: 'Electrical Fitting', date: 'Posted Yesterday', quotes: 8, color: 'bg-blue-500' }
              ].map((req) => (
                <Card key={req.id} className="border-none shadow-sm hover:shadow-lg transition-all rounded-[2rem] overflow-hidden group">
                  <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className={`h-16 w-16 rounded-[1.25rem] ${req.color}/10 flex items-center justify-center text-primary`}>
                        <ShoppingBag size={32} className={`${req.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{req.id}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-xs font-bold text-emerald-500 uppercase tracking-tight">Post is Live</span>
                        </div>
                        <h3 className="text-xl font-black text-foreground">{req.title}</h3>
                        <p className="text-sm font-medium text-foreground/40">{req.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black ring-1 ring-emerald-500/10">
                        {req.quotes} New Quotes
                      </div>
                      <Link href="/buyer-dashboard/quotations">
                        <Button variant="ghost" className="h-10 px-4 rounded-xl font-black text-xs hover:bg-slate-50 group-hover:text-blue-600">
                          Review Quotes <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips / Verified Info Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-black text-foreground">Next Steps</h2>
            
            <Card className="border-none shadow-sm bg-linear-to-br from-white to-slate-50 rounded-[2rem] p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={120} className="text-blue-600" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-foreground leading-tight">Verified Sellers Program</h4>
                  <p className="text-sm font-medium text-foreground/50">
                    Always look for the blue tick. Our verified sellers provide high-quality materials with guarantee.
                  </p>
                </div>
                <Button className="w-full bg-white border border-border hover:bg-white hover:border-blue-500/50 text-foreground font-black py-6 rounded-2xl shadow-sm group">
                  Learn How We Verify <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>

            <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex items-start gap-4">
              <div className="h-10 w-10 flex-shrink-0 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg">!</div>
              <div>
                <h5 className="font-black text-orange-900 leading-none mb-1">Price Alert</h5>
                <p className="text-sm font-medium text-orange-800/60 leading-tight">
                  Cement prices in your area have dropped by 5% today. Post a requirement now to save!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
