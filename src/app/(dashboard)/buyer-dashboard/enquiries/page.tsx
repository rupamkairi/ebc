"use client";

import { useEnquiriesQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { EnquiryCard } from "@/components/dashboard/buyer/enquiry-card";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-v2-components";
import { cn } from "@/lib/utils";
import { Frown } from "lucide-react";

const filters = ["All", "Pending", "Approved", "Rejected"];

export default function EnquiriesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: session } = useSessionQuery();
  const { data: enquiries, isLoading } = useEnquiriesQuery({});

  const filteredEnquiries = (enquiries || []).filter((e) => {
    if (activeFilter === "All") return true;
    return (e.status || "").toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto">
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

      {/* Filters and Action Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold transition-all shadow-sm",
                  isActive 
                    ? "bg-[#3D52A0] text-white shadow-[#3D52A0]/20" 
                    : "bg-white text-[#3D52A0] hover:bg-muted"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <Link href="/browse">
          <Button className="bg-[#3D52A0] hover:bg-[#2A3B7D] text-white px-8 py-6 rounded-xl font-bold flex items-center gap-2 h-12">
            + Create Enquiry
          </Button>
        </Link>
      </div>

      {/* Enquiries List Container */}
      <div className="min-h-[300px] rounded-[2rem] bg-gradient-to-br from-[#2A3B7D] to-[#1D2A5C] p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 font-medium">Fetching enquiries...</p>
            </div>
          ) : filteredEnquiries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredEnquiries.map((enquiry) => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex flex-row items-center gap-3 text-white/50 mb-2">
                <Frown className="size-6 mb-1" />
                <p className="text-lg font-medium italic">
                  seems empty here. create Enquiries and it will show down here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
