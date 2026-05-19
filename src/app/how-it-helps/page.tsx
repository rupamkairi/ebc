"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Home,
  Briefcase,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  Truck,
  Building2,
  FileText,
  BadgeAlert,
  HelpCircle,
  Activity,
  Layers,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { FooterSection } from "@/components/landing/footer-section";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export default function HowItHelpsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");

  const comparisonData = {
    buyer: {
      title: "For Buyers: Stress-Free Building",
      subtitle: "See how EBC completely redefines the homeowner construction experience.",
      traditional: [
        {
          label: "Price Manipulation ❌",
          desc: "Local retail suppliers inflate cement and steel prices up to 20-30% based on project size.",
        },
        {
          label: "Counterfeit Materials ❌",
          desc: "High risk of duplicate raw materials or lower-grade structural steel without certified testing.",
        },
        {
          label: "Contractor Scheduling Issues ❌",
          desc: "Endless calling and chasing architects, specialists, and builders who miss booking times.",
        },
        {
          label: "Stolen Advances ❌",
          desc: "Contractors take massive cash advances upfront and vanish or slow down milestone works.",
        },
      ],
      ebc: [
        {
          label: "Wholesale Rate Guarantee ✨",
          desc: "Regional yards compete live inside EBC to win your order, securing true factory-direct wholesale pricing.",
        },
        {
          label: "Site Grade Verification ✨",
          desc: "EBC provides optional physical testing on your plot to verify steel strength grades and cement curing quality.",
        },
        {
          label: "3-Slot Automated Booking ✨",
          desc: "Select exactly three slot times that fit your calendar; specialists accept and book in seconds.",
        },
        {
          label: "Secure Escrow Milestones ✨",
          desc: "Your funds are held safely in EBC Escrow. Sellers are paid only after you confirm delivery or successful build stages.",
        },
      ],
    },
    seller: {
      title: "For Partners: Guaranteed B2B Growth",
      subtitle: "See how EBC handles the business administrative load so you can focus on shipping products.",
      traditional: [
        {
          label: "Bad Debts & Stuck Cash ❌",
          desc: "Outstanding bills are delayed for 90+ days, starving your operational working capital.",
        },
        {
          label: "Heavy Client Acquisition Costs ❌",
          desc: "Spending hours bidding, marketing, and talking to cold leads who are only comparison shopping.",
        },
        {
          label: "Logistical Nightmares ❌",
          desc: "Suppliers must organize expensive local trucking or deal with delayed third-party shipping agencies.",
        },
        {
          label: "No Brand Authority ❌",
          desc: "Local dealers get swallowed by corporate distributors and cannot showcase their genuine service ratings.",
        },
      ],
      ebc: [
        {
          label: "Secure Escrow Lock ✨",
          desc: "Buyers deposit 100% of the milestone cash into EBC Escrow before you dispatch materials or confirm calendar hours.",
        },
        {
          label: "Matching High-Intent Leads ✨",
          desc: "EBC routes local buyers actively looking for your exact inventory categories straight to your dashboard.",
        },
        {
          label: "EBC Coordinated Freight ✨",
          desc: "Utilize EBC's massive heavy haul logistics network to easily ship raw materials direct from your yard.",
        },
        {
          label: "Priority Bids & Reviews ✨",
          desc: "Five-star reviews unlock corporate bids, EBC certification, and direct priority channels for government works.",
        },
      ],
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-16 px-4 relative overflow-hidden">
        {/* Background Mesh Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-6xl mx-auto space-y-16">
          
          {/* Back Navigation & Header */}
          <div className="text-center space-y-4 animate-in fade-in duration-700">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all mb-4 group"
              id="back-to-home"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              {t("back_to_home", "Return to Home")}
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-xs font-black tracking-widest uppercase">
              <Award size={12} className="text-primary" />
              {t("ebc_advantage_badge", "THE EBC ADVANTAGE")}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] max-w-4xl mx-auto">
              {t("how_ebc_helps_title", "Why Choose EBC?")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {t("how_ebc_helps_subtitle", "Discover how our digital ecosystem eliminates transparency gaps, secures transaction finances, and streamlines heavy industrial logistics.")}
            </p>
          </div>

          {/* Side-by-Side Dual-Advantage Split Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            
            {/* Buyer/Homeowner Path Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-30 transition duration-500" />
              <div className="relative flex flex-col h-full bg-white border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 overflow-hidden">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Home size={32} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                
                <span className="text-[10px] font-black text-primary tracking-widest uppercase mb-1">
                  For Homeowners & Builders
                </span>
                <h3 className="text-2xl font-black text-foreground mb-4">
                  {t("i_am_buyer_title", "Stress-Free Construction")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-8 leading-relaxed flex-1">
                  Escape local retail price gouging, fake materials, and contractor delays. Access direct factory-grade yard inventory with optional site testing and bulletproof escrow milestones.
                </p>

                {/* Feature highlights grid */}
                <div className="grid grid-cols-1 gap-3.5 mb-8">
                  {[
                    "Compare B2B Wholesale Pricing Live",
                    "Certified Cement/Steel Site Checks",
                    "Propose 3 Slots for Expert Bookings",
                    "Funds Protected Safely in Escrow"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link href="/how-it-helps/buyer" className="w-full">
                  <Button
                    size="xl"
                    className="w-full bg-primary hover:bg-primary/95 text-white font-black text-base rounded-2xl shadow-xl shadow-primary/20 gap-3 group/btn cursor-pointer py-6"
                  >
                    {t("get_started_buyer", "Explore Homeowner Path")}
                    <ArrowRight className="size-5 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Seller/Partner Path Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-secondary to-orange-500 rounded-[2.5rem] blur opacity-15 group-hover:opacity-30 transition duration-500" />
              <div className="relative flex flex-col h-full bg-white border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 overflow-hidden">
                <div className="size-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                  <Briefcase size={32} className="text-secondary group-hover:text-secondary-foreground transition-colors duration-300" />
                </div>
                
                <span className="text-[10px] font-black text-secondary tracking-widest uppercase mb-1">
                  For Retailers & Specialists
                </span>
                <h3 className="text-2xl font-black text-foreground mb-4">
                  {t("i_am_seller_title", "Guaranteed Business Growth")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-8 leading-relaxed flex-1">
                  End the stress of cash-flow deficits and unpaid outstanding bills. Connect directly with active local buyers, receive secured escrow orders, and coordinate deliveries with EBC.
                </p>

                {/* Feature highlights grid */}
                <div className="grid grid-cols-1 gap-3.5 mb-8">
                  {[
                    "Zero Acquisition Fees & Matching Leads",
                    "Escrow Guaranteed Prompt Cash Payouts",
                    "Integrated Fleet Delivery Management",
                    "Priority Channels for Corporate Bids"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                      <CheckCircle2 size={16} className="text-secondary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link href="/how-it-helps/seller" className="w-full">
                  <Button
                    size="xl"
                    className="w-full bg-secondary hover:bg-secondary/95 text-secondary-foreground font-black text-base rounded-2xl shadow-xl shadow-secondary/20 gap-3 group/btn cursor-pointer py-6"
                  >
                    {t("get_started_seller", "Explore Partner Path")}
                    <ArrowRight className="size-5 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Interactive Traditional vs EBC Comparative Dashboard */}
          <div className="bg-white rounded-[2.5rem] border border-border p-8 md:p-12 shadow-xl space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 pb-6 border-b border-border">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  The EBC Difference
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl font-medium">
                  We analyzed the traditional construction procurement flaws and re-engineered the process completely.
                </p>
              </div>
              
              {/* Interactive Dashboard Tab Toggles */}
              <div className="flex p-1 bg-accent/40 rounded-xl border border-border self-start shrink-0">
                <button
                  onClick={() => setActiveTab("buyer")}
                  className={cn(
                    "py-2 px-4 text-xs font-black rounded-lg transition-all cursor-pointer",
                    activeTab === "buyer" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  For Buyers
                </button>
                <button
                  onClick={() => setActiveTab("seller")}
                  className={cn(
                    "py-2 px-4 text-xs font-black rounded-lg transition-all cursor-pointer",
                    activeTab === "seller" ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  For Partners
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              
              {/* Left Column: Traditional way (Red accents) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-red-600">
                  <BadgeAlert size={22} />
                  <h4 className="text-lg font-black tracking-tight">The Stressful Traditional Way</h4>
                </div>
                <div className="space-y-4">
                  {comparisonData[activeTab].traditional.map((item, idx) => (
                    <div key={idx} className="bg-red-50/20 border border-red-100 p-5 rounded-2xl space-y-1">
                      <h5 className="text-xs font-black text-red-900 leading-snug">{item.label}</h5>
                      <p className="text-xs text-red-700/80 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: EBC way (Blue/Emerald/Orange accents depending on active role) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck size={22} />
                  <h4 className="text-lg font-black tracking-tight">The Seamless EBC Way</h4>
                </div>
                <div className="space-y-4">
                  {comparisonData[activeTab].ebc.map((item, idx) => (
                    <div key={idx} className="bg-emerald-50/20 border border-emerald-100 p-5 rounded-2xl space-y-1">
                      <h5 className="text-xs font-black text-emerald-900 leading-snug">{item.label}</h5>
                      <p className="text-xs text-emerald-700/80 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Visual Marketplace Pipeline Flow */}
          <div className="p-8 md:p-12 bg-accent/20 border border-border rounded-[2.5rem] space-y-10 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                How EBC Holds the Center
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto font-medium">
                Our centralized hub coordinates verified funds, logistics dispatch, and technical checks dynamically.
              </p>
            </div>

            {/* Visual Horizontal Timeline Steps for Desktop, Vertical for Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {[
                {
                  id: "01",
                  title: "Escrow Deposit",
                  icon: Lock,
                  desc: "Buyer pays securely into EBC's escrow account, locking project funds.",
                },
                {
                  id: "02",
                  title: "Order Secured",
                  icon: CheckCircle2,
                  desc: "Dealer receives the secured lead and prepares materials.",
                },
                {
                  id: "03",
                  title: "Fleet Dispatched",
                  icon: Truck,
                  desc: "EBC Logistics handles transport directly from regional yard.",
                },
                {
                  id: "04",
                  title: "Quality Check",
                  icon: ShieldCheck,
                  desc: "Optional site engineer test verifies grades at the plot.",
                },
                {
                  id: "05",
                  title: "Direct Release",
                  icon: TrendingUp,
                  desc: "Funds instantly hit seller wallet upon confirmed unloading.",
                },
              ].map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-3 relative group/flow hover:border-primary/50 transition-all duration-300">
                    <span className="text-[10px] font-black text-primary/30 tracking-widest block font-mono">
                      {step.id}
                    </span>
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <StepIcon size={20} />
                    </div>
                    <h5 className="text-sm font-black text-foreground tracking-tight">{step.title}</h5>
                    <p className="text-[11px] text-muted-foreground leading-normal font-medium">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Growth Metrics Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center pt-4 animate-in fade-in duration-700">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-3xl md:text-4xl font-black text-primary">500+</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Verified Retail Yards
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-3xl md:text-4xl font-black text-primary">200+</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Qualified Consultants
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-3xl md:text-4xl font-black text-primary">₹50Cr+</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Escrow Milestones Secured
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-3xl md:text-4xl font-black text-primary">0%</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Payment Default Rate
              </div>
            </div>
          </div>

          {/* Bottom India Tagline */}
          <div className="text-center text-muted-foreground/40 text-xs font-black tracking-widest pt-4">
            {t("india_premier_digital", "INDIA'S PREMIER DIGITAL CONSTRUCTION BLUEPRINT")}
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
