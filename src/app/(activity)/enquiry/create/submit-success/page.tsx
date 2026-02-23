"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSessionQuery } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-v2-components";

export default function SubmitSuccessPage() {
  const { data: session } = useSessionQuery();

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      {/* Profile Section */}
      {session?.user && (
        <BuyerProfileCard
          name={session.user.name || "Buyer"}
          role={session.user.role || "Buyer"}
          avatarUrl={session.user.image || undefined}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-[#3D52A0] tracking-tight">Enquiries</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Manage and track your product enquiries
        </p>
      </div>

      {/* Success Success Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 sm:p-20 flex flex-col items-center text-center space-y-8 border border-[#3D52A0]/5">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative h-32 w-32 bg-white rounded-full flex items-center justify-center border-[6px] border-green-500 shadow-xl">
            <CheckCircle2 className="h-20 w-20 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="text-4xl font-black text-[#2e7d32] tracking-tight italic uppercase">
            Enquiry Submitted
          </h2>
          <p className="text-lg text-[#3D52A0]/70 font-medium leading-relaxed">
            Thank You for your enquiry. We have received your request and will get
            back to you with a quotation shortly
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-6 w-full max-w-md">
          <Button 
            asChild 
            variant="outline" 
            className="flex-1 h-14 rounded-xl border-[#3D52A0] text-[#3D52A0] font-bold text-lg hover:bg-[#3D52A0]/5 border-2 transition-all duration-300"
          >
            <Link href="/browse">Browse More Items</Link>
          </Button>
          <Button 
            asChild 
            className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#0F28A9] to-[#0A1B75] text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 border-none"
          >
            <Link href="/buyer-dashboard">Goto Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
