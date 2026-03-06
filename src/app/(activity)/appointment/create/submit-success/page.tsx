"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function AppointmentSubmitSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4 text-center space-y-6">
      <div className="h-24 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
        <Calendar className="h-12 w-12" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold">{t("request_submitted")}</h1>
        <p className="text-muted-foreground">
          {t("appointment_thank_you")}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button asChild variant="outline">
          <Link href="/browse">{t("browse_more")}</Link>
        </Button>
        <Button asChild>
          <Link href="/buyer-dashboard">{t("go_to_dashboard")}</Link>
        </Button>
      </div>
    </div>
  );
}
