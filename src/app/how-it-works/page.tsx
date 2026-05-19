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
  Search,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  Store,
  HelpCircle,
  Truck,
  Lock,
  MessageSquare,
  MapPin,
  Plus,
  Minus,
  Info,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FooterSection } from "@/components/landing/footer-section";

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const [activeRole, setActiveRole] = useState<"buyer" | "seller">("buyer");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Simulation Sandbox States
  const [simBuyerMode, setSimBuyerMode] = useState<"enquiry" | "appointment">("enquiry");
  const [simSellerMode, setSimSellerMode] = useState<"retailer" | "specialist">("retailer");
  
  // Interactive Simulation Data States
  const [simEnquiryStep, setSimEnquiryStep] = useState<"add" | "verify" | "quotes" | "escrow">("add");
  const [simApptStep, setSimApptStep] = useState<"slots" | "verify" | "confirmed">("slots");
  const [simQuoteInput, setSimQuoteInput] = useState<string>("385");
  const [simQuoteStatus, setSimQuoteStatus] = useState<"idle" | "submitted" | "success">("idle");
  const [simSpecialistSlot, setSimSpecialistSlot] = useState<number | null>(null);
  const [simSpecialistConfirmed, setSimSpecialistConfirmed] = useState<boolean>(false);

  // Mocks for Buyer enquiry sandbox
  const [addedItems, setAddedItems] = useState<Array<{ name: string; qty: string }>>([
    { name: "UltraTech Premium Cement", qty: "100 Bags" },
    { name: "Tata Tiscon TMT Steel Rebar", qty: "2 Tons" },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && newItemQty.trim()) {
      setAddedItems([...addedItems, { name: newItemName.trim(), qty: newItemQty.trim() }]);
      setNewItemName("");
      setNewItemQty("");
    }
  };

  const resetBuyerEnquirySim = () => {
    setAddedItems([
      { name: "UltraTech Premium Cement", qty: "100 Bags" },
      { name: "Tata Tiscon TMT Steel Rebar", qty: "2 Tons" },
    ]);
    setSimEnquiryStep("add");
  };

  const resetBuyerApptSim = () => {
    setSimApptStep("slots");
  };

  const resetSellerRetailerSim = () => {
    setSimQuoteStatus("idle");
    setSimQuoteInput("385");
  };

  const resetSellerSpecialistSim = () => {
    setSimSpecialistSlot(null);
    setSimSpecialistConfirmed(false);
  };

  // Step Data Based on Current Workflows
  const buyerSteps = [
    {
      id: 1,
      title: t("how_it_works_buyer_step1_title", "Browse Materials & Services"),
      icon: Search,
      desc: t(
        "how_it_works_buyer_step1_desc",
        "Browse EBC's extensive verified B2B catalog. Locate exactly the raw materials (cement, bricks, steel) you need or filter through top-tier construction professionals (architects, civil engineers, renovation crews) near your location."
      ),
      highlights: [
        t("how_it_works_buyer_step1_hl1", "Transparent specifications and retail/wholesale grade items"),
        t("how_it_works_buyer_step1_hl2", "Curated listings of vetted, highly rated local specialists"),
      ],
    },
    {
      id: 2,
      title: t("how_it_works_buyer_step2_title", "Create Enquiry or Book Appointment"),
      icon: FileText,
      desc: t(
        "how_it_works_buyer_step2_desc",
        "Define your project needs clearly. Our platform customizes the workflow depending on what your project requires:"
      ),
      customContent: (
        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-left space-y-3">
          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">A</div>
            <div>
              <h5 className="text-sm font-bold text-primary">{t("how_it_works_buyer_step2_optA_title", "Material Enquiry (Products)")}</h5>
              <p className="text-xs text-muted-foreground mt-1">
                {t("how_it_works_buyer_step2_optA_desc", "Bundle raw materials, add specific quantities, and declare expected delivery dates with your target pincode directory location.")}
              </p>
            </div>
          </div>
          <div className="h-px bg-primary/10 my-2" />
          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">B</div>
            <div>
              <h5 className="text-sm font-bold text-foreground">{t("how_it_works_buyer_step2_optB_title", "Consultant Appointment (Services)")}</h5>
              <p className="text-xs text-muted-foreground mt-1">
                {t("how_it_works_buyer_step2_optB_desc", "Choose an expert specialist and select exactly three preferred date-time slot options to guarantee matching with their live schedules.")}
              </p>
            </div>
          </div>
          <div className="h-px bg-primary/10 my-2" />
          <p className="text-xs text-primary/70 font-semibold italic flex items-center gap-1.5">
            <Info size={12} /> {t("how_it_works_buyer_step2_otp", "Verification: Unregistered users bypass complex signups via instant secure mobile SMS OTP.")}
          </p>
        </div>
      ),
      highlights: [],
    },
    {
      id: 3,
      title: t("how_it_works_buyer_step3_title", "Receive Bids & Confirmed Schedules"),
      icon: TrendingUp,
      desc: t(
        "how_it_works_buyer_step3_desc",
        "EBC's partner engine immediately notifies nearby verified dealers or specialist providers about your request. Rather than standard bidding, they compete to deliver excellent values:"
      ),
      highlights: [
        t("how_it_works_buyer_step3_hl1", "Dealers quote transparent, negotiable pricing directly answering raw material enquiries"),
        t("how_it_works_buyer_step3_hl2", "Specialists pick from your three proposed slot times and instantly confirm the appointment"),
        t("how_it_works_buyer_step3_hl3", "No aggressive sales calls: compare clean quotes side-by-side inside your central dashboard"),
      ],
    },
    {
      id: 4,
      title: t("how_it_works_buyer_step4_title", "Escrow Protection & Milestone Building"),
      icon: ShieldCheck,
      desc: t(
        "how_it_works_buyer_step4_desc",
        "Build with the backing of India's most secure construction logistics network. EBC ensures complete transactional peace of mind:"
      ),
      highlights: [
        t("how_it_works_buyer_step4_hl1", "Buyer Escrow Safety: Payment is held securely and only released to sellers post verified milestone or delivery"),
        t("how_it_works_buyer_step4_hl2", "EBC Managed Logistics: Integrated fleet logistics delivers materials from regional yards directly to your plot"),
        t("how_it_works_buyer_step4_hl3", "Expert Site Guidance: Optional onsite quality inspections ensure steel grades and cement specifications match invoice"),
      ],
    },
  ];

  const sellerSteps = [
    {
      id: 1,
      title: t("how_it_works_seller_step1_title", "Onboard & Match High-Intent Leads"),
      icon: Sparkles,
      desc: t(
        "how_it_works_seller_step1_desc",
        "Register either as a Retailer/Dealer (selling materials) or Consultant/Specialist (providing construction services). EBC routes active local requests in your region directly to your partner dashboard."
      ),
      highlights: [
        t("how_it_works_seller_step1_hl1", "Zero customer acquisition fees or monthly subscription costs"),
        t("how_it_works_seller_step1_hl2", "Receive matching notifications based on your chosen inventory categories and pincodes"),
      ],
    },
    {
      id: 2,
      title: t("how_it_works_seller_step2_title", "Submit Custom Quotes or Pick Slots"),
      icon: Briefcase,
      desc: t(
        "how_it_works_seller_step2_desc",
        "Respond swiftly to close high-intent leads using EBC's tailored provider interfaces:"
      ),
      customContent: (
        <div className="mt-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/15 text-left space-y-3">
          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">A</div>
            <div>
              <h5 className="text-sm font-bold text-foreground">{t("how_it_works_seller_step2_optA_title", "Retailers (Materials)")}</h5>
              <p className="text-xs text-muted-foreground mt-1">
                {t("how_it_works_seller_step2_optA_desc", "Review requested material quantities and propose a competitive wholesale price quotation. Set terms for loading and in-yard pick-ups.")}
              </p>
            </div>
          </div>
          <div className="h-px bg-secondary/10 my-2" />
          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">B</div>
            <div>
              <h5 className="text-sm font-bold text-primary">{t("how_it_works_seller_step2_optB_title", "Consultants & Specialists (Services)")}</h5>
              <p className="text-xs text-muted-foreground mt-1">
                {t("how_it_works_seller_step2_optB_desc", "Analyze the buyer's detailed scope of work. Simply accept one of their three proposed date-time options that seamlessly fits your schedule.")}
              </p>
            </div>
          </div>
        </div>
      ),
      highlights: [],
    },
    {
      id: 3,
      title: t("how_it_works_seller_step3_title", "Escrow Secured Orders & Logistics"),
      icon: Lock,
      desc: t(
        "how_it_works_seller_step3_desc",
        "Eliminate bad debt and payment delays. EBC secures your earnings upfront so you can focus entirely on high-quality delivery:"
      ),
      highlights: [
        t("how_it_works_seller_step3_hl1", "Upfront Payment Lock: Buyers pay 100% of the milestone value into EBC Escrow before dispatch or call confirmation"),
        t("how_it_works_seller_step3_hl2", "EBC Freight Support: Leverage EBC's shipping network to move heavy supplies, or host consultation calls in-app"),
      ],
    },
    {
      id: 4,
      title: t("how_it_works_seller_step4_title", "Direct Wallet Payouts & Scaling"),
      icon: Store,
      desc: t(
        "how_it_works_seller_step4_desc",
        "Withdraw earnings instantly. Every completed job build builds your digital presence on EBC to scale your enterprise:"
      ),
      highlights: [
        t("how_it_works_seller_step4_hl1", "Instant Wallet Payout: Funds release to your EBC Wallet immediately upon buyer digital delivery confirmation"),
        t("how_it_works_seller_step4_hl2", "One-Click Withdrawals: Transfer money safely from your EBC wallet directly into your verified bank account"),
        t("how_it_works_seller_step4_hl3", "Enterprise Growth: Gain five-star reviews and unlock corporate priority bids for bulk government/commercial works"),
      ],
    },
  ];

  const faqs = [
    {
      q: t("how_it_works_faq_1_q", "Is EBC a free platform for buyers?"),
      a: t("how_it_works_faq_1_a", "Yes! Posting sourcing enquiries for raw materials and sending booking requests for specialists is 100% free for homeowners. You only pay for the materials and professional services you choose to buy, all secured by EBC Escrow."),
    },
    {
      q: t("how_it_works_faq_2_q", "Why do buyers need to submit three preferred time slots for service appointments?"),
      a: t("how_it_works_faq_2_a", "Providing three preferred slots ensures high appointment success rates. Specialists can immediately choose the slot that perfectly aligns with their field schedules, eliminating lengthy back-and-forth negotiation."),
    },
    {
      q: t("how_it_works_faq_3_q", "How does EBC Escrow protect both parties?"),
      a: t("how_it_works_faq_3_a", "For buyers, EBC holds funds safely and only releases them to sellers once materials arrive on-site in correct grades or services are rendered. For sellers, it guarantees that the buyer has 100% of the funds ready, eliminating default risks."),
    },
    {
      q: t("how_it_works_faq_4_q", "How do material deliveries get handled?"),
      a: t("how_it_works_faq_4_a", "EBC operates an integrated, live-tracked B2B logistics network. Once you accept a dealer's quotation, EBC coordinates loading, trucking, and site delivery, offering transparent shipping milestones to your phone."),
    },
    {
      q: t("how_it_works_faq_5_q", "What is the OTP verification step when creating an activity?"),
      a: t("how_it_works_faq_5_a", "To ensure seamless user experiences, buyers do not need to register accounts before creating an Enquiry or Appointment. They fill in their requirements and authenticate via a fast 4-digit SMS OTP, which safely auto-registers their account."),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-16 px-4 relative overflow-hidden">
        {/* Background Radial Sleek Decorators */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-6xl mx-auto space-y-16">
          
          {/* Header Navigation & High Impact Title */}
          <div className="text-center space-y-4 animate-in fade-in duration-700">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all mb-4 group"
              id="back-to-home-link"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              {t("return_to_home")}
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black tracking-widest uppercase">
              <Sparkles size={12} className="text-secondary" />
              {t("ebc_how_it_works_badge", "EBC Unified Ecosystem")}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] max-w-4xl mx-auto">
              {t("how_ebc_helps_title", "How EBC Works")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {t("how_ebc_helps_subtitle", "A transparent, escrow-backed marketplace designed for effortless construction procurement and service delivery.")}
            </p>
          </div>

          {/* Interactive Role Switcher Toggle */}
          <div className="flex justify-center max-w-md mx-auto animate-in fade-in delay-100">
            <div className="grid w-full grid-cols-2 p-1.5 bg-white border border-border rounded-2xl shadow-lg relative z-10">
              <button
                id="role-toggle-buyer"
                onClick={() => setActiveRole("buyer")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-black transition-all cursor-pointer",
                  activeRole === "buyer"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Home size={18} />
                {t("i_am_buyer_title", "For Buyers")}
              </button>
              <button
                id="role-toggle-seller"
                onClick={() => setActiveRole("seller")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-black transition-all cursor-pointer",
                  activeRole === "seller"
                    ? "bg-secondary text-secondary-foreground shadow-md shadow-secondary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Briefcase size={18} />
                {t("i_am_seller_title", "For Sellers")}
              </button>
            </div>
          </div>

          {/* Dynamic Workflow Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
            
            {/* Left Side: Interactive Steps Timeline */}
            <div className="lg:col-span-7 space-y-12 animate-in fade-in slide-in-from-left duration-700">
              <div className="border-l-2 border-dashed border-border ml-6 pl-8 space-y-12 relative">
                {(activeRole === "buyer" ? buyerSteps : sellerSteps).map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="relative group/step">
                      {/* Step Number Dot Indicator */}
                      <div className={cn(
                        "absolute -left-[45px] top-0 size-8 rounded-full flex items-center justify-center text-xs font-black shadow-md border transition-all duration-300",
                        activeRole === "buyer"
                          ? "bg-primary border-primary text-white group-hover/step:scale-110"
                          : "bg-secondary border-secondary text-secondary-foreground group-hover/step:scale-110"
                      )}>
                        {step.id}
                      </div>

                      <div className="space-y-3 bg-white p-6 rounded-3xl border border-border shadow-xs hover:shadow-lg transition-all duration-300">
                        {/* Step Header */}
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2.5 rounded-xl shrink-0",
                            activeRole === "buyer" ? "bg-primary/10 text-primary" : "bg-secondary/15 text-secondary"
                          )}>
                            <Icon size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-foreground tracking-tight">
                            {step.title}
                          </h3>
                        </div>

                        {/* Step Description */}
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>

                        {/* Custom Embedded Workflow Visuals */}
                        {step.customContent && step.customContent}

                        {/* Bullet Highlights */}
                        {step.highlights.length > 0 && (
                          <ul className="grid grid-cols-1 gap-2 pt-2">
                            {step.highlights.map((hl, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 font-semibold leading-normal">
                                <CheckCircle2 className={cn(
                                  "size-4 shrink-0 mt-0.5",
                                  activeRole === "buyer" ? "text-emerald-500" : "text-secondary"
                                )} />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Call-to-action redirect cards */}
              <div className={cn(
                "p-8 rounded-[2rem] border relative overflow-hidden transition-all duration-500",
                activeRole === "buyer" 
                  ? "bg-primary/5 border-primary/15" 
                  : "bg-secondary/5 border-secondary/20"
              )}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-foreground">
                      {activeRole === "buyer"
                        ? t("how_it_works_buyer_cta_title", "Ready to start your build journey?")
                        : t("how_it_works_seller_cta_title", "Start scaling your business now")}
                    </h4>
                    <p className="text-xs font-semibold text-muted-foreground max-w-md">
                      {activeRole === "buyer"
                        ? t("how_it_works_buyer_cta_desc", "Book appointments with certified civil consultants or get wholesale B2B quotes for raw construction materials.")
                        : t("how_it_works_seller_cta_desc", "Join India's premium builder-retailer ecosystem. Receive qualified local leads and enjoy guaranteed prompt payouts.")}
                    </p>
                  </div>
                  <Link href={activeRole === "buyer" ? "/auth/register?role=BUYER" : "/auth/register?role=SELLER"}>
                    <Button
                      variant={activeRole === "buyer" ? "glow" : "secondary"}
                      size="lg"
                      className="group font-black text-sm rounded-xl py-6 px-6 gap-2"
                    >
                      {activeRole === "buyer" ? t("get_started_buyer", "Get Started") : t("join_ebc_today", "Join Now")}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: EBC Interactive Workflow Simulator / Sandbox */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="bg-white rounded-[2.5rem] border border-border p-6 shadow-xl relative">
                
                {/* Visual Glassmorphic Accent */}
                <div className="absolute -top-3 -right-3 size-12 bg-linear-to-tr from-primary/10 to-secondary/10 rounded-full blur-md" />

                {/* Sandbox Header */}
                <div className="space-y-1.5 pb-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                      Interactive Simulation
                    </span>
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black text-foreground">
                    {activeRole === "buyer" ? "Try Buyer Workflows" : "Try Partner Dashboard"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Experience our actual platform mechanics in this live mockup.
                  </p>
                </div>

                {/* SIMULATOR SCREEN CONTENT */}
                <div className="py-6 min-h-[380px] flex flex-col justify-between">
                  
                  {/* ====== BUYER SIMULATOR ====== */}
                  {activeRole === "buyer" && (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {/* Sub-toggles for Enquiry vs Appointment */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-accent/40 rounded-xl border border-border">
                        <button
                          onClick={() => { setSimBuyerMode("enquiry"); resetBuyerEnquirySim(); }}
                          className={cn(
                            "py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer",
                            simBuyerMode === "enquiry" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Raw Materials (Enquiry)
                        </button>
                        <button
                          onClick={() => { setSimBuyerMode("appointment"); resetBuyerApptSim(); }}
                          className={cn(
                            "py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer",
                            simBuyerMode === "appointment" ? "bg-white text-secondary shadow-sm" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Book Service (Appointment)
                        </button>
                      </div>

                      {/* A. ENQUIRY FLOW */}
                      {simBuyerMode === "enquiry" && (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          {/* Step 1: Add Items */}
                          {simEnquiryStep === "add" && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Step 1: Build Enquiry Cart</span>
                              <div className="p-3 bg-muted/20 border border-dashed border-border rounded-2xl max-h-[140px] overflow-y-auto space-y-1.5 no-scrollbar">
                                {addedItems.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-border shadow-2xs">
                                    <span className="font-bold text-foreground">{item.name}</span>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-black text-[10px]">{item.qty}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Form to mock add */}
                              <form onSubmit={handleAddItem} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Material Name (e.g. Bricks)"
                                  value={newItemName}
                                  onChange={(e) => setNewItemName(e.target.value)}
                                  className="text-xs p-2.5 bg-white border border-border rounded-lg flex-1 outline-none focus:border-primary text-foreground font-semibold"
                                />
                                <input
                                  type="text"
                                  placeholder="Qty (e.g. 500)"
                                  value={newItemQty}
                                  onChange={(e) => setNewItemQty(e.target.value)}
                                  className="text-xs p-2.5 bg-white border border-border rounded-lg w-20 outline-none focus:border-primary text-foreground font-semibold"
                                />
                                <button type="submit" className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors cursor-pointer">
                                  <Plus size={16} />
                                </button>
                              </form>

                              <button
                                onClick={() => setSimEnquiryStep("verify")}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Proceed to Live Verification
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          )}

                          {/* Step 2: OTP Verification */}
                          {simEnquiryStep === "verify" && (
                            <div className="space-y-4 animate-in slide-in-from-bottom duration-300 text-center py-4">
                              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Step 2: Instant OTP Bypass</span>
                              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                <Lock size={20} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-black text-foreground">Confirm your Mobile Number</p>
                                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">EBC creates your secure buyer account seamlessly via instant OTP verification.</p>
                              </div>
                              <div className="flex justify-center gap-2">
                                {["4", "7", "2", "9"].map((digit, i) => (
                                  <div key={i} className="size-10 rounded-lg border-2 border-primary/30 flex items-center justify-center font-black text-sm bg-accent/20 text-primary">
                                    {digit}
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => setSimEnquiryStep("quotes")}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Verify & Broadcast Request
                                <CheckCircle2 size={14} />
                              </button>
                            </div>
                          )}

                          {/* Step 3: Bids Competitive screen */}
                          {simEnquiryStep === "quotes" && (
                            <div className="space-y-3 animate-in slide-in-from-bottom duration-300">
                              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Step 3: Compare Incoming Retailer Bids</span>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                Nearby verified dealers analyze your exact quantities and bid dynamically to win your order:
                              </p>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2.5 bg-white border border-border rounded-xl shadow-2xs">
                                  <div className="flex items-center gap-2">
                                    <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center font-bold text-[10px] text-primary">A</div>
                                    <span className="text-xs font-bold text-foreground">Shree Balaji Traders (Noida)</span>
                                  </div>
                                  <span className="text-xs font-black text-foreground">₹1,18,500</span>
                                </div>

                                <div className="flex justify-between items-center p-2.5 bg-primary/5 border border-primary/30 rounded-xl shadow-sm relative overflow-hidden">
                                  <div className="absolute top-0 right-0 bg-primary text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg">
                                    Best Rate ✅
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="size-6 bg-primary rounded-full flex items-center justify-center font-bold text-[10px] text-white">B</div>
                                    <span className="text-xs font-black text-primary">EBC Regional Yard Noida</span>
                                  </div>
                                  <span className="text-xs font-black text-primary">₹1,14,200</span>
                                </div>

                                <div className="flex justify-between items-center p-2.5 bg-white border border-border rounded-xl shadow-2xs">
                                  <div className="flex items-center gap-2">
                                    <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center font-bold text-[10px] text-primary">C</div>
                                    <span className="text-xs font-bold text-foreground">Apex Steel & Concrete</span>
                                  </div>
                                  <span className="text-xs font-black text-foreground">₹1,21,000</span>
                                </div>
                              </div>

                              <button
                                onClick={() => setSimEnquiryStep("escrow")}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Accept Best Price & Pay Escrow
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          )}

                          {/* Step 4: Escrow protection and Logistics dispatch */}
                          {simEnquiryStep === "escrow" && (
                            <div className="space-y-4 animate-in zoom-in-95 duration-300 text-center py-4">
                              <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2 py-1 rounded-md">Escrow Secure 🛡️</span>
                              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto relative">
                                <Truck size={28} className="animate-bounce" />
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-sm font-black text-foreground">Material Locked & Dispatched!</h5>
                                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                                  ₹1,14,200 is held securely in EBC Escrow. Our shipping fleet is moving cement/steel to Noida.
                                </p>
                              </div>
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-left">
                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Live Milestone</p>
                                <p className="text-[11px] text-emerald-700 font-bold mt-1">🚚 Fleet dispatched from Yard at Noida Sector 63</p>
                                <p className="text-[10px] text-emerald-600/70 font-semibold mt-0.5">Note: Funds release to dealer only upon site arrival & site grading confirmation.</p>
                              </div>
                              <button
                                onClick={resetBuyerEnquirySim}
                                className="w-full bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground font-black text-xs py-2.5 rounded-xl cursor-pointer"
                              >
                                Reset Material Sourcing Demo
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* B. APPOINTMENT FLOW */}
                      {simBuyerMode === "appointment" && (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          
                          {/* Step 1: Select 3 preferred slots */}
                          {simApptStep === "slots" && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Step 1: Request 3 Time Slots</span>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                EBC appointments require selecting exactly 3 slots to fit the live field schedule of construction specialists:
                              </p>

                              <div className="p-3 bg-muted/10 border border-border rounded-xl text-xs space-y-1">
                                <span className="font-bold text-foreground">Specialist:</span> Rajesh Sharma (Structural Consultant)
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 bg-white border border-border rounded-lg text-xs font-semibold">
                                  <span className="size-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-[10px]">1</span>
                                  <span>Mon, May 22 &mdash; 10:00 AM (Proposed)</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white border border-border rounded-lg text-xs font-semibold">
                                  <span className="size-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-[10px]">2</span>
                                  <span>Tue, May 23 &mdash; 02:00 PM (Proposed)</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white border border-border rounded-lg text-xs font-semibold">
                                  <span className="size-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-[10px]">3</span>
                                  <span>Wed, May 24 &mdash; 04:00 PM (Proposed)</span>
                                </div>
                              </div>

                              <button
                                onClick={() => setSimApptStep("verify")}
                                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Request Slots & Verify Phone
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          )}

                          {/* Step 2: Verification */}
                          {simApptStep === "verify" && (
                            <div className="space-y-4 animate-in slide-in-from-bottom duration-300 text-center py-4">
                              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Step 2: Instant OTP Bypass</span>
                              <div className="size-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
                                <Lock size={20} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-black text-foreground">OTP Sent to +91 98765-XXXXX</p>
                                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">Verify your mobile to securely lock in this appointment request.</p>
                              </div>
                              <div className="flex justify-center gap-2">
                                {["8", "3", "0", "1"].map((digit, i) => (
                                  <div key={i} className="size-10 rounded-lg border-2 border-secondary/30 flex items-center justify-center font-black text-sm bg-accent/20 text-secondary-foreground">
                                    {digit}
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => setSimApptStep("confirmed")}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                Verify & Send to Specialist
                                <CheckCircle2 size={14} />
                              </button>
                            </div>
                          )}

                          {/* Step 3: Confirmed booking */}
                          {simApptStep === "confirmed" && (
                            <div className="space-y-4 animate-in zoom-in-95 duration-300 text-center py-4">
                              <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2 py-1 rounded-md">Appointment Confirmed ✅</span>
                              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                                <Calendar size={28} />
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-sm font-black text-foreground">Rajesh Sharma Confirmed Slot 2!</h5>
                                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                                  Structural consultant Rajesh Sharma accepted Slot 2: **Tue, May 23 - 2:00 PM**.
                                </p>
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-left space-y-1">
                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Meeting Card</p>
                                <p className="text-xs text-emerald-950 font-bold">📅 Tue, May 23 &mdash; 02:00 PM</p>
                                <p className="text-[11px] text-emerald-700 font-medium">🛡️ Escrow safety active. Consulting fees locked. Video consulting room will open in-app at scheduled hour.</p>
                              </div>
                              <button
                                onClick={resetBuyerApptSim}
                                className="w-full bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground font-black text-xs py-2.5 rounded-xl cursor-pointer"
                              >
                                Reset Service Booking Demo
                              </button>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  )}

                  {/* ====== SELLER SIMULATOR ====== */}
                  {activeRole === "seller" && (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {/* Sub-toggles for Retailer vs Specialist */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-accent/40 rounded-xl border border-border">
                        <button
                          onClick={() => { setSimSellerMode("retailer"); resetSellerRetailerSim(); }}
                          className={cn(
                            "py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer",
                            simSellerMode === "retailer" ? "bg-white text-secondary shadow-sm" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Retailer Panel (Materials)
                        </button>
                        <button
                          onClick={() => { setSimSellerMode("specialist"); resetSellerSpecialistSim(); }}
                          className={cn(
                            "py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer",
                            simSellerMode === "specialist" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Specialist Panel (Services)
                        </button>
                      </div>

                      {/* A. RETAILER FLOW */}
                      {simSellerMode === "retailer" && (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3 animate-in fade-in duration-300">
                            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Incoming B2B Sourcing Enquiry</span>
                            
                            <div className="p-3 bg-muted/20 border border-border rounded-xl text-left space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-black text-foreground">Enquiry #ENQ-9043</span>
                                <span className="bg-secondary/15 text-secondary px-2 py-0.5 rounded text-[8px] font-black uppercase">Noida Sector 62</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                                  <span>Ultratech Cement</span>
                                  <span className="font-bold text-foreground">200 Bags</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                                  <span>Tata Tiscon Steel Rebar</span>
                                  <span className="font-bold text-foreground">1.5 Tons</span>
                                </div>
                              </div>
                            </div>

                            {simQuoteStatus === "idle" && (
                              <div className="space-y-3 animate-in fade-in">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-foreground">Propose wholesale price per cement bag (INR):</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-bold">₹</span>
                                    <input
                                      type="number"
                                      value={simQuoteInput}
                                      onChange={(e) => setSimQuoteInput(e.target.value)}
                                      className="w-full text-xs py-2.5 pl-7 pr-3 bg-white border border-border rounded-lg outline-none focus:border-secondary font-black text-foreground"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSimQuoteStatus("submitted")}
                                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98]"
                                >
                                  Submit Custom B2B Quotation
                                </button>
                              </div>
                            )}

                            {simQuoteStatus === "submitted" && (
                              <div className="space-y-4 animate-in slide-in-from-bottom duration-300 py-3">
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-1">
                                  <CheckCircle2 size={20} className="text-emerald-600 mx-auto" />
                                  <p className="text-xs font-black text-emerald-800">Quotation Submitted Successfully!</p>
                                  <p className="text-[10px] text-emerald-700">Proposing ₹{simQuoteInput}/bag for 200 bags.</p>
                                </div>

                                <div className="bg-muted/10 p-3 rounded-xl border border-border text-left">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">EBC Bidding Status</p>
                                  <p className="text-[11px] text-foreground font-bold mt-1">Status: Competitive Rank #1 🏆 (Lowest Rate)</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">The buyer is reviewing and executing secure checkout payment. Funds will hold in EBC Escrow.</p>
                                </div>

                                <button
                                  onClick={() => setSimQuoteStatus("success")}
                                  className="w-full bg-primary hover:bg-primary/90 text-white font-black text-xs py-2.5 rounded-xl cursor-pointer"
                                >
                                  Simulate Buyer Order Completion
                                </button>
                              </div>
                            )}

                            {simQuoteStatus === "success" && (
                              <div className="space-y-4 animate-in zoom-in-95 duration-300 text-center py-2">
                                <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2 py-1 rounded-md">Order Paid & Guaranteed 🔒</span>
                                <div className="bg-emerald-50/50 p-3 rounded-xl text-left border border-emerald-100 space-y-1">
                                  <p className="text-xs text-emerald-950 font-bold">💰 Escrow Confirmed: ₹77,000 Locked</p>
                                  <p className="text-[10px] text-emerald-700">Buyer completed payment. EBC truck is scheduled for pickup at your yard. Deliver safely to unlock wallet payout.</p>
                                </div>
                                <button
                                  onClick={resetSellerRetailerSim}
                                  className="w-full bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground font-black text-xs py-2.5 rounded-xl cursor-pointer"
                                >
                                  Reset Retailer Demo
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* B. SPECIALIST FLOW */}
                      {simSellerMode === "specialist" && (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3 animate-in fade-in duration-300">
                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Incoming Appointment Booking Request</span>
                            
                            <div className="p-3 bg-muted/20 border border-border rounded-xl text-left space-y-2">
                              <span className="text-xs font-black text-foreground">Soil Test & Foundation Consultation</span>
                              <div className="text-[11px] text-muted-foreground font-medium">
                                <span className="font-bold text-foreground">Buyer:</span> Anuj S. | Sector 62, Noida
                              </div>
                            </div>

                            {!simSpecialistConfirmed && (
                              <div className="space-y-3 animate-in fade-in">
                                <p className="text-[11px] text-muted-foreground leading-normal">
                                  Select one of the buyer's 3 preferred slots that fits your calendar:
                                </p>
                                <div className="space-y-2">
                                  {[
                                    { id: 1, label: "Slot 1: Mon, May 22 - 10:00 AM (Conflict ❌)" },
                                    { id: 2, label: "Slot 2: Tue, May 23 - 02:00 PM (Available ✅)" },
                                    { id: 3, label: "Slot 3: Wed, May 24 - 04:00 PM (Available ✅)" }
                                  ].map((slot) => (
                                    <button
                                      key={slot.id}
                                      onClick={() => setSimSpecialistSlot(slot.id)}
                                      disabled={slot.id === 1}
                                      className={cn(
                                        "w-full text-left p-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                                        slot.id === 1 ? "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50" :
                                        simSpecialistSlot === slot.id ? "bg-primary border-primary text-white" : "bg-white border-border text-foreground hover:bg-accent/50"
                                      )}
                                    >
                                      <span>{slot.label}</span>
                                      {simSpecialistSlot === slot.id && <CheckCircle2 size={14} />}
                                    </button>
                                  ))}
                                </div>

                                <button
                                  onClick={() => setSimSpecialistConfirmed(true)}
                                  disabled={simSpecialistSlot === null}
                                  className="w-full bg-primary hover:bg-primary/90 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                  Accept Selected Slot
                                </button>
                              </div>
                            )}

                            {simSpecialistConfirmed && (
                              <div className="space-y-4 animate-in zoom-in-95 duration-300 text-center py-4">
                                <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2 py-1 rounded-md">Booking Confirmed 📅</span>
                                <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                                  <CheckCircle2 size={24} />
                                </div>
                                <div className="space-y-1">
                                  <h5 className="text-sm font-black text-foreground">Appointment Locked in Calendar</h5>
                                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                                    You confirmed Slot {simSpecialistSlot}. The buyer's appointment booking fee has been secured in EBC Escrow.
                                  </p>
                                </div>
                                <button
                                  onClick={resetSellerSpecialistSim}
                                  className="w-full bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground font-black text-xs py-2.5 rounded-xl cursor-pointer"
                                >
                                  Reset Specialist Demo
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* Simulator Footer Controls */}
                <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-primary" /> Sector 62, Noida
                  </span>
                  <span className="font-bold flex items-center gap-1 text-emerald-600">
                    <ShieldCheck size={12} /> Escrow Protected
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Core Protections & Trust Architecture Section */}
          <div className="py-8 border-t border-b border-border bg-accent/20 rounded-[2.5rem] px-8 space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {t("ebc_trust_title", "Backed by EBC Partner Protection")}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto font-medium">
                {t("ebc_trust_subtitle", "We built security directly into every level of our construction and service booking workflow.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <h4 className="text-base font-black text-foreground">Secure Escrow Accounts</h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Buyers secure payment upfront so partners work with confidence. Funds are only paid out once buyers digitally verify safe delivery or specialist milestone completion.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <h4 className="text-base font-black text-foreground">Integrated Logistics Fleet</h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  No more chasing third-party transport. EBC organizes live-tracked heavy freight hauling directly from yard suppliers to the buyer's plot with on-route updates.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="text-base font-black text-foreground">Site Grade Verification</h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Optional on-site engineering tests confirm that the delivered raw supplies (steel grades, cement strengths) align precisely with invoice specs before release.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive FAQ Section */}
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {t("buyer_faq_title", "Frequently Asked Questions")}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Have questions about our Enquiry or Appointment system? We have answers.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:border-primary/45 transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left font-black text-sm md:text-base py-5 px-6 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-pointer"
                  >
                    <span className="pr-4 font-bold text-foreground">Q: {faq.q}</span>
                    {activeFaq === i ? (
                      <Minus size={18} className="text-primary shrink-0" />
                    ) : (
                      <Plus size={18} className="text-muted-foreground/60 shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      activeFaq === i
                        ? "grid-rows-[1fr] opacity-100 border-t border-border"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 py-5 text-xs md:text-sm font-semibold text-muted-foreground leading-relaxed bg-accent/10">
                        <span className="font-black text-primary mr-2 uppercase text-[10px] tracking-wider">Answer:</span>
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* India Tagline */}
          <div className="text-center text-muted-foreground/40 text-xs font-black tracking-widest pt-4">
            {t("india_premier_digital", "INDIA'S PREMIER DIGITAL CONSTRUCTION BLUEPRINT")}
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
