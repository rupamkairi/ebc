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
        <h1 className="text-3xl font-black text-[#3D52A0] tracking-tight">
          {t("enquiries_title_page")}
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t("manage_track_enquiries_subtitle")}
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
                    : "bg-white text-[#3D52A0] hover:bg-muted",
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
          <Button className="bg-[#3D52A0] hover:bg-[#2A3B7D] text-white px-8 py-6 rounded-xl font-bold flex items-center gap-2 h-12">
            + {t("create_enquiry_btn")}
          </Button>
        </Link>
      </div>

      {/* Enquiries List Container */}
      <div className="min-h-[300px] relative overflow-hidden">
        {/* Subtle decorative effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 font-medium">{t("fetching_enquiries")}</p>
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
