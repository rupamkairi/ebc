"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReportPreviewPage } from "@/components/dashboard/reports/report-preview-page";
import { getReportBySlug } from "@/components/dashboard/reports/report-registry";

export default function AdminReportRoutePage() {
  const params = useParams<{ reportSlug: string }>();
  const report = getReportBySlug("admin", params.reportSlug);

  if (!report) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-responsive py-8">
        <h1 className="text-2xl font-bold text-foreground">Report Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This admin report route does not match an available report.
        </p>
        <Button asChild className="w-fit">
          <Link href="/admin-dashboard/reports">Back to reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <ReportPreviewPage
      report={report}
      backHref="/admin-dashboard/reports"
    />
  );
}
