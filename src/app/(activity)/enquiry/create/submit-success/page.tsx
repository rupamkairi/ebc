"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { useSessionQuery } from "@/queries/authQueries";
import { useLanguage } from "@/hooks/useLanguage";
import { SELLER_ROLES, USER_ROLE } from "@/constants/roles";

export default function SubmitSuccessPage() {
  const { data: session } = useSessionQuery();
  const { t } = useLanguage();

  const dashboardLink = useMemo(() => {
    if (!session?.user?.role) return "/buyer-dashboard";
    if (SELLER_ROLES.includes(session.user.role as USER_ROLE)) {
      return "/seller-dashboard/b2b-enquiries";
    }
    return "/buyer-dashboard";
  }, [session?.user?.role]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative group">
         <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 scale-150" />
         <div className="relative h-28 w-28 bg-white rounded-3xl flex items-center justify-center border-2 border-primary/10 shadow-xl shadow-primary/5 transition-transform group-hover:rotate-6">
            <ShoppingBag className="h-14 w-14 text-primary" strokeWidth={1.5} />
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white">
               <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
            </div>
         </div>
      </div>

      <div className="space-y-3 max-w-lg">
        <h1 className="text-4xl font-black text-primary tracking-tight uppercase italic italic-none">
          {t("enquiry_submitted")}
        </h1>
        <p className="text-sm text-primary/60 font-medium leading-relaxed uppercase tracking-widest">
          {t("enquiry_thank_you")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full max-w-md">
        <Button
          asChild
          variant="outline"
          className="flex-1 h-12 rounded-xl border-primary/20 text-primary/60 font-black text-[11px] tracking-widest uppercase hover:bg-primary/5 hover:border-primary/30 transition-all"
        >
          <Link href="/browse">{t("browse_more_items")}</Link>
        </Button>
        <Button
          asChild
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 border-none"
        >
          <Link href={dashboardLink}>{t("goto_dashboard")}</Link>
        </Button>
      </div>
    </div>
  );
}
