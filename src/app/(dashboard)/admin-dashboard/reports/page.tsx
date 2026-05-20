"use client";

import { ReportNavigationGrid } from "@/components/dashboard/reports/report-navigation-grid";
import { adminReports } from "@/components/dashboard/reports/report-registry";

export default function AdminReportsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-responsive py-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Admin Reports & Analytics
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Open a report, select the date range, preview the full table in the
          browser, then download the filtered CSV.
        </p>
      </div>

      <ReportNavigationGrid
        reports={adminReports}
        basePath="/admin-dashboard/reports"
      />
    </div>
  );
}
