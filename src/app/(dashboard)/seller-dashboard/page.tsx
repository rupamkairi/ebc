"use client";

import {
  Users,
  Send,
  PackageSearch,
  Star,
  Trophy,
  LineChart,
  Megaphone,
  ArrowRight,
  Plus,
  Calendar,
} from "lucide-react";
import { DashboardHeader } from "./dashboard-header";
import { UserInfo } from "./user-info";
import { DashboardCard } from "./dashboard-card";
import { BottomNav } from "./bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4">
        <UserInfo />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Customer Enquiries */}
          <DashboardCard
            title="New Customer Enquiries."
            icon={Users}
            className="md:col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-foreground/80">
                Dekhiye Kitne Ghar Banna Start Huye!
              </p>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-extrabold text-primary">15</span>
                <span className="text-xl font-bold text-foreground">
                  New Leads
                </span>
              </div>
              <div className="space-y-2 mt-2">
                {[
                  { name: "Amit Sharma", detail: "Cement (50 bags)" },
                  { name: "Priya Verma", detail: "Bricks (5000 pcs)" },
                  { name: "Rahul Gupta", detail: "Sariya (2 Ton)" },
                  { name: "Vivek Roy", detail: "Marble (1200 Sqft)" },
                ]
                  .slice(0, 4)
                  .map((lead, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm border-l-4 border-primary/20 pl-3 py-1"
                    >
                      <span className="font-bold text-foreground">
                        {lead.name}
                      </span>
                      <span className="text-foreground/60">{lead.detail}</span>
                    </div>
                  ))}
              </div>
              <Link href="/seller-dashboard/enquiries">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl mt-2">
                  View Leads & Quote Now
                </Button>
              </Link>
            </div>
          </DashboardCard>

          {/* Send Quotation */}
          <DashboardCard title="Send Quotation." icon={Send}>
            <div className="flex flex-col gap-6 h-full justify-between">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Price bhejiye aur deal pakka kijiye!
                </p>
                <div className="flex justify-center py-6">
                  <div className="relative border-2 border-primary/10 rounded-xl p-4 bg-muted/20">
                    <Send
                      size={48}
                      className="text-primary/30"
                      strokeWidth={1}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[10px] font-extrabold px-2 py-1 rounded-sm shadow-md">
                      QUT
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/seller-dashboard/quotations/new">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                  Create Quotation
                </Button>
              </Link>
            </div>
          </DashboardCard>

          {/* My Catalog */}
          <DashboardCard title="My Catalog." icon={PackageSearch}>
            <div className="flex flex-col gap-6 h-full justify-between">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Aapke Product Online — Har Buyer ke Mobile Me!
                </p>
                <div className="flex justify-center py-6">
                  <div className="grid grid-cols-3 gap-1 bg-muted/10 p-2 rounded-lg aspect-square w-32 items-end">
                    <div className="h-full w-full bg-primary/10 rounded-t flex items-center justify-center">
                      <PackageSearch size={20} className="text-primary/40" />
                    </div>
                    <div className="h-[60%] w-full bg-secondary/10 rounded-t border-x border-secondary/20"></div>
                    <div className="h-[80%] w-full bg-primary/10 rounded-t"></div>
                  </div>
                </div>
              </div>
              <Link href="/seller-dashboard/catalog">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                  Add/Update Items
                </Button>
              </Link>
            </div>
          </DashboardCard>

          {/* Ratings & Reviews */}
          <DashboardCard title="Ratings & Reviews." icon={Star}>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-foreground/80 mb-2">
                  Aapka Vishwas Score:
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        size={24}
                        className="fill-secondary text-secondary"
                      />
                    ))}
                    <Star size={24} className="text-secondary/30" />
                  </div>
                  <span className="text-2xl font-black text-foreground">
                    (4.3)
                  </span>
                </div>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                Improve Rating
              </Button>
            </div>
          </DashboardCard>

          {/* Business Insights */}
          <DashboardCard title="Business Insights." icon={LineChart}>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Dekhiye pichhle hafte ka performance!
                </p>
                <div className="flex justify-center py-4">
                  {/* Simple SVG Chart Mockup */}
                  <div className="w-full h-24 bg-muted/20 rounded-lg p-2 flex items-end gap-1">
                    {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/20 rounded-t-sm relative group hover:bg-primary transition-colors cursor-pointer"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-white text-[8px] px-1 rounded hidden group-hover:block">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                View Growth Report
              </Button>
            </div>
          </DashboardCard>

          {/* Appointments */}
          <DashboardCard title="Appointments." icon={Calendar}>
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-foreground/80 leading-snug">
                Upcoming site visits aur meetings ko manage kijiye
              </p>
              <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-foreground">Site Survey: Scheme 54</p>
                    <p className="text-[10px] font-medium text-foreground/40 uppercase">Tomorrow, 11:00 AM</p>
                  </div>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded">PENDING</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9 rounded-lg border-primary text-primary hover:bg-primary/5 text-xs font-bold">
                    REJECT
                  </Button>
                  <Button className="h-9 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold">
                    CONFIRM
                  </Button>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-secondary font-black text-sm py-2 group">
                View All Appointments
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </DashboardCard>

          {/* Conference Hall */}
          <DashboardCard title="Conference Hall." icon={Megaphone}>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-foreground/80 leading-snug">
                  Offers & Promotions Chalaye - Sabke saamne!
                </p>
                <div className="flex flex-col items-center py-4">
                  <div className="w-full bg-primary/5 p-3 rounded-lg border border-primary/10 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Plus size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-primary/20 rounded-full mb-1"></div>
                      <div className="h-2 w-16 bg-primary/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg rounded-xl">
                Publish Promotion
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
                  Vendors who reply fast → 3X more business!
                </h4>
                <p className="text-foreground/60 font-medium">
                  Customer satisfaction is the key to winning repeats.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-6 rounded-full flex items-center gap-2 group whitespace-nowrap"
            >
              Learn How To Win More Deals
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

      <BottomNav />
    </div>
  );
}
