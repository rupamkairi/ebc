"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { useSessionQuery } from "@/queries/authQueries";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SELLER_ROLES, USER_ROLE } from "@/constants/roles";

export default function SubmitSuccessPage() {
  const { data: session } = useSessionQuery();
  const { t } = useLanguage();

  const dashboardLink = useMemo(() => {
    if (!session?.user?.role) return "/buyer-dashboard";
    if (SELLER_ROLES.includes(session.user.role as USER_ROLE)) {
      return "/seller-dashboard/my-enquiries";
    }
    return "/buyer-dashboard";
  }, [session?.user?.role]);

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      {session?.user && (
        <div className="bg-white rounded-3xl p-6 border border-primary/10 shadow-sm flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-secondary">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
            <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-primary">{session.user.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">
              {session.user.role}
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          {t("enquiries")}
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t("manage_track_enquiries")}
        </p>
      </div>

      {/* Success Success Card */}
      <div className="bg-white rounded-4xl shadow-2xl p-10 sm:p-20 flex flex-col items-center text-center space-y-8 border border-primary/5">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative h-32 w-32 bg-white rounded-full flex items-center justify-center border-[6px] border-green-500 shadow-xl">
            <CheckCircle2
              className="h-20 w-20 text-green-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="text-3xl font-bold text-[#2e7d32] tracking-tight">
            {t("enquiry_submitted")}
          </h2>
          <p className="text-lg text-primary/70 font-medium leading-relaxed">
            {t("enquiry_thank_you")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-6 w-full max-w-md">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-14 rounded-xl border-primary text-primary font-bold text-lg hover:bg-primary/5 border-2 transition-all duration-300"
          >
            <Link href="/browse">{t("browse_more_items")}</Link>
          </Button>
          <Button
            asChild
            className="flex-1 h-14 rounded-xl bg-linear-to-r from-primary to-primary/80 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 border-none"
          >
            <Link href={dashboardLink}>{t("goto_dashboard")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
