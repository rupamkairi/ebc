"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isServiceBusiness } from "@/constants/roles";
import { useAuthStore } from "@/store/authStore";
import { ReportPreviewPage } from "@/components/dashboard/reports/report-preview-page";
import {
  getReportBySlug,
  ReportScope,
} from "@/components/dashboard/reports/report-registry";

export default function SellerReportRoutePage() {
  const params = useParams<{ reportSlug: string }>();
  const { user } = useAuthStore();
  const reportScope: ReportScope = isServiceBusiness(user?.role)
    ? "serviceProvider"
    : "productSeller";
  const report = getReportBySlug(reportScope, params.reportSlug);

  if (!report) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-responsive py-8">
        <h1 className="text-2xl font-bold text-foreground">Report Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This report route does not match an available report for your role.
        </p>
        <Button asChild className="w-fit">
          <Link href="/seller-dashboard/reports">Back to reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <ReportPreviewPage
      report={report}
      backHref="/seller-dashboard/reports"
    />
  );
}
