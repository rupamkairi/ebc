"use client";

import { useEnquiriesQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { EnquiryCard } from "@/components/dashboard/buyer/enquiry/enquiry-card";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";
import { cn } from "@/lib/utils";
import { Frown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const filters = ["All", "Pending", "Approved", "Rejected"];

export default function EnquiriesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: session } = useSessionQuery();
  const { data: enquiries, isLoading } = useEnquiriesQuery({});
  const { t } = useLanguage();

  const filteredEnquiries = (enquiries || []).filter((e) => {
    if (activeFilter === "All") return true;
    return (e.status || "").toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto py-8">
      {/* Profile Section */}
      {session?.user && (
        <BuyerProfileCard
          name={session.user.name || "Buyer"}
          role={session.user.role || "Buyer"}
          avatarUrl={session.user.image || undefined}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black text-[#3D52A0] tracking-tight">
          {t("enquiries_title_page")}
        </h1>
        <p className="text-base text-muted-foreground font-bold uppercase tracking-widest">
          {t("manage_track_enquiries_subtitle")}
        </p>
      </div>

      {/* Filters and Action Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white p-6 rounded-3xl border border-[#3D52A0]/10 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "bg-[#3D52A0] text-white shadow-lg shadow-[#3D52A0]/20 scale-105"
                    : "bg-slate-50 text-[#3D52A0]/60 hover:bg-slate-100",
                )}
              >
                {filter === "All" && t("all_filter")}
                {filter === "Pending" && t("pending_filter")}
                {filter === "Approved" && t("approved_filter")}
                {filter === "Rejected" && t("rejected_filter")}
              </button>
            );
          })}
        </div>

        <Link href="/enquiry/create">
          <Button className="bg-[#FFA500] hover:bg-[#E69500] text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 h-14 shadow-lg shadow-[#FFA500]/20 transition-all active:scale-95 border-none">
            <span className="text-xl">+</span>
            {t("create_enquiry_btn")}
          </Button>
        </Link>
      </div>

      {/* Enquiries List Container */}
      <div className="min-h-[400px] relative">
        <div className="relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-3xl border border-[#3D52A0]/10 shadow-sm">
              <div className="h-12 w-12 border-4 border-[#3D52A0]/10 border-t-[#3D52A0] rounded-full animate-spin" />
              <p className="text-[#3D52A0]/40 font-black uppercase tracking-widest text-xs">
                {t("fetching_enquiries")}
              </p>
            </div>
          ) : filteredEnquiries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEnquiries.map((enquiry) => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-[#3D52A0]/20">
              <div className="flex flex-col items-center gap-4 text-[#3D52A0]/30 mb-2">
                <Frown className="size-16 mb-2 opacity-20" />
                <p className="text-xl font-black uppercase tracking-widest">
                  {t("no_enquiries_empty_state")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
