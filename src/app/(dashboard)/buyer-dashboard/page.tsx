"use client";

import {
  Plus,
  Search,
  FileText,
  Truck,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  PackageSearch,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { BuyerHeader } from "./buyer-header";
import { UserInfo } from "./user-info";
import { DashboardCard } from "./dashboard-card";
import { BuyerBottomNav } from "./buyer-bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BuyerDashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <BuyerHeader />

      <main className="container mx-auto px-4">
        <UserInfo />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Requirements */}
          <DashboardCard
            title="My Active Requirements."
            icon={ShoppingBag}
            className="md:col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-foreground/80">
                Aapki construction requirements live hain!
              </p>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-extrabold text-primary">03</span>
                <span className="text-xl font-bold text-foreground">
                  Active Posts
                </span>
              </div>
              <div className="space-y-2 mt-2">
                {[
                  { id: "REQ-882", title: "Cement & Bricks", quotes: "5 Quotes" },
                  { id: "REQ-721", title: "Electrical Fitting", quotes: "8 Quotes" },
                  { id: "REQ-654", title: "Sanitary Ware", quotes: "2 Quotes" },
                ].map((req, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm border-l-4 border-primary/20 pl-3 py-1"
                  >
                    <div>
                      <span className="font-bold text-foreground block">
                        {req.title}
                      </span>
                      <span className="text-[10px] text-foreground/40 font-bold tracking-wider">{req.id}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-black">
                      {req.quotes}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/buyer-dashboard/enquiries">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl mt-2">
                  View All Requirements
                </Button>
              </Link>
            </div>
          </DashboardCard>

          {/* Post New Requirement */}
          <DashboardCard title="Post Requirement." icon={Plus}>
            <div className="flex flex-col gap-6 h-full justify-between">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Post kijiye aur payiye best deals in minutes!
                </p>
                <div className="flex justify-center py-6">
                  <div className="relative border-2 border-primary/10 rounded-xl p-4 bg-muted/20">
                    <Plus
                      size={48}
                      className="text-primary/30"
                      strokeWidth={1}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[10px] font-extrabold px-2 py-1 rounded-sm shadow-md">
                      NEW
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/buyer-dashboard/enquiries/new">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                  Post Live Now
                </Button>
              </Link>
            </div>
          </DashboardCard>

          {/* Browse Catalog */}
          <DashboardCard title="Browse Catalog." icon={PackageSearch}>
            <div className="flex flex-col gap-6 h-full justify-between">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Explore products from top-rated vendors!
                </p>
                <div className="flex justify-center py-6">
                  <div className="grid grid-cols-3 gap-1 bg-muted/10 p-2 rounded-lg aspect-square w-32 items-end">
                    <div className="h-full w-full bg-primary/10 rounded-t flex items-center justify-center">
                      <Search size={24} className="text-primary/40" />
                    </div>
                    <div className="h-[60%] w-full bg-secondary/10 rounded-t border-x border-secondary/20"></div>
                    <div className="h-[80%] w-full bg-primary/10 rounded-t"></div>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                Explore Items
              </Button>
            </div>
          </DashboardCard>

          {/* Quotes Received */}
          <DashboardCard title="Recent Quotes." icon={FileText}>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-foreground/80 mb-2">
                  Aapke liye naye rates aaye hain:
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-extrabold text-primary">12</span>
                  <span className="text-xl font-bold text-foreground">
                    Quotes Received
                  </span>
                </div>
              </div>
              <Link href="/buyer-dashboard/quotations">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                  Review & Compare
                </Button>
              </Link>
            </div>
          </DashboardCard>

          {/* Ongoing Deliveries */}
          <DashboardCard title="Order Status." icon={Truck}>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Track kijiye apna construction material!
                </p>
                <div className="bg-muted/30 p-4 rounded-xl mt-4 border border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-foreground">5000 Bricks - VK Co.</p>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded">IN TRANSIT</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-blue-500 rounded-full" />
                  </div>
                  <p className="text-[10px] font-medium text-foreground/40 mt-1 uppercase">Eta: Today, 5:00 PM</p>
                </div>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                Track Delivery
              </Button>
            </div>
          </DashboardCard>

          {/* Verified Sellers */}
          <DashboardCard title="Verified Sellers." icon={ShieldCheck}>
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-foreground/80 leading-snug">
                Why choose EBC Verified Sellers?
              </p>
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-emerald-600" />
                  </div>
                  <span className="text-foreground/70 font-bold">Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-emerald-600" />
                  </div>
                  <span className="text-foreground/70 font-bold">Standardized Pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-emerald-600" />
                  </div>
                  <span className="text-foreground/70 font-bold">Verified Documents</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-secondary font-black text-sm py-2 group">
                Learn About Verification
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </DashboardCard>

          {/* Help & Support */}
          <DashboardCard title="Assistance." icon={MessageSquare}>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Construction related koi bhi sawal?
                </p>
                <div className="flex flex-col items-center py-4">
                  <div className="w-full bg-primary/5 p-3 rounded-lg border border-primary/10 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Sparkles size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-primary italic">"Need help choosing the right cement?"</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                Ask EBC Assistant
              </Button>
            </div>
          </DashboardCard>

          {/* Tip/Banner Card */}
          <div className="md:col-span-2 lg:col-span-3 bg-white border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Trophy size={32} className="text-secondary" />
              </div>
              <div>
                <h4 className="text-xl font-black text-foreground">
                  Lowest Price Guarantee with Verified Sellers!
                </h4>
                <p className="text-foreground/60 font-medium">
                  Compare quotes from 10+ sellers and save up to 20%.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-6 rounded-full flex items-center gap-2 group whitespace-nowrap"
            >
              Check Price Alerts
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-border py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-primary"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-black text-primary">EBC</span>
          </div>
          <p className="text-primary font-black text-lg text-center tracking-wide">
            EBC AAPKE SATH, HAR KADAM PAR.
          </p>
          <div className="flex gap-6 text-sm font-bold text-foreground/40">
            <span className="hover:text-primary cursor-pointer">Privacy</span>
            <span className="hover:text-primary cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

      <BuyerBottomNav />
    </div>
  );
}
