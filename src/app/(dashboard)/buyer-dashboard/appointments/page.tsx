"use client";

import { useAppointmentsQuery } from "@/queries/activityQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { AppointmentCard } from "@/components/dashboard/buyer/appointment/appointment-card";
import { useLanguage } from "@/hooks/useLanguage";
import { useSessionQuery } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";

const filters = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { t } = useLanguage();
  const { data: session } = useSessionQuery();

  const { data: appointments, isLoading } = useAppointmentsQuery({
    search: search,
  });

  const filteredAppointments = (appointments || []).filter((a) => {
    if (activeFilter === "All") return true;
    return (a.status || "").toUpperCase() === activeFilter.toUpperCase();
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

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
            {t("appointment_page_title")}
          </h1>
          <p className="text-base text-muted-foreground font-bold uppercase tracking-widest">
            {t("appointment_page_desc")}
          </p>
        </div>
        <Link href="/appointment/create">
          <Button className="bg-secondary hover:bg-secondary/90 text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 h-14 shadow-lg shadow-secondary/20 transition-all active:scale-95 border-none w-full md:w-auto">
            <span className="text-xl">+</span>
            {t("create_appointment_btn")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
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
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "bg-slate-50 text-primary/60 hover:bg-slate-100",
                )}
              >
                {filter === "All" && t("all_filter")}
                {filter === "Upcoming" && t("upcoming_filter")}
                {filter === "Completed" && t("completed_filter")}
                {filter === "Cancelled" && t("cancelled_filter")}
              </button>
            );
          })}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
          <Input
            type="search"
            placeholder={t("search_appointments")}
            className="w-full bg-slate-50 border-slate-200 rounded-xl pl-12 h-12 text-sm font-bold text-primary focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="min-h-[400px] relative">
        <div className="relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-3xl border border-primary/10 shadow-sm">
              <div className="h-12 w-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-primary/40 font-black uppercase tracking-widest text-xs">
                {t("loading_appointments_msg")}
              </p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-primary/20">
              <div className="flex flex-col items-center gap-4 text-primary/30 mb-2 font-black uppercase tracking-widest">
                <Search className="size-16 mb-2 opacity-20" />
                <p className="text-xl">{t("no_appointments_found_msg")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
