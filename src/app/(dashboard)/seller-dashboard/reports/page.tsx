"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { isServiceBusiness } from "@/constants/roles";
import { useAuthStore } from "@/store/authStore";
import { ReportNavigationGrid } from "@/components/dashboard/reports/report-navigation-grid";
import {
  getReportsForScope,
  ReportScope,
} from "@/components/dashboard/reports/report-registry";

export default function SellerReportsPage() {
  const { user } = useAuthStore();
  const reportScope: ReportScope = isServiceBusiness(user?.role)
    ? "serviceProvider"
    : "productSeller";
  const reports = getReportsForScope(reportScope);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Analytics & Reports
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Open a report, select the date range, preview the full table in the
          browser, then download the filtered CSV.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50 text-blue-800">
        <Info className="h-4 w-4" color="currentColor" />
        <AlertTitle>Role Context</AlertTitle>
        <AlertDescription>
          You are viewing reports customized for your role as a{" "}
          {reportScope === "serviceProvider"
            ? "Service Provider"
            : "Product Seller"}
          .
        </AlertDescription>
      </Alert>

      <ReportNavigationGrid
        reports={reports}
        basePath="/seller-dashboard/reports"
      />
    </div>
  );
}
