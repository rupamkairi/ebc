"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Visits are not a standalone section — they live inside individual Appointments.
 * This page redirects any direct navigation to /buyer-dashboard/visits → /buyer-dashboard/appointments.
 */
export default function BuyerVisitsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/buyer-dashboard/appointments");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
