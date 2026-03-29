"use client";

import { ReportDownloadCard } from "@/components/dashboard/reports/report-download-card";
import { reportService } from "@/services/reportService";
import { useAuthStore } from "@/store/authStore";
import { isServiceBusiness } from "@/constants/roles";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function SellerReportsPage() {
  const { user } = useAuthStore();
  const isServiceProvider = isServiceBusiness(user?.role);

  const productSellerReports = useMemo(() => [
    {
      title: "Enquiries Report",
      description: "Exports your assigned Enquiries tracking Buyer pincodes, your submitted Quotations, and conversion outcomes.",
      onDownload: reportService.productSeller.downloadEnquiries,
    },
    {
      title: "Self Performance Metrics",
      description: "Summarizes total Activity lead intake, quoting responsiveness, and your average Buyer Ratings.",
      onDownload: reportService.productSeller.downloadEntityMetrics,
    },
    {
      title: "Wallet Transactions Ledger",
      description: "Exports ledger of all Coin deductions/credits and closing balances specifically for your Wallet.",
      onDownload: reportService.productSeller.downloadWalletTransactions,
    },
  ], []);

  const serviceProviderReports = useMemo(() => [
    {
      title: "Appointments Report",
      description: "Exports Appointment requests dispatched to you, monitoring Visit tracking, cancellations, and ratings.",
      onDownload: reportService.serviceProvider.downloadAppointments,
    },
    {
      title: "Self Performance Metrics",
      description: "Summarizes appointment requests, your Visit confirm variations, completion rates, and average Buyer Ratings.",
      onDownload: reportService.serviceProvider.downloadEntityMetrics,
    },
    {
      title: "Wallet Transactions Ledger",
      description: "Exports ledger of all Coin deductions/credits and closing balances specifically for your Wallet.",
      onDownload: reportService.serviceProvider.downloadWalletTransactions,
    },
  ], []);

  const reportsToRender = isServiceProvider ? serviceProviderReports : productSellerReports;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
          Download detailed historical data associated with your business in CSV format.
        </p>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4" color="currentColor" />
        <AlertTitle>Role Context</AlertTitle>
        <AlertDescription>
          You are viewing reports customized for your role as a {isServiceProvider ? "Service Provider" : "Product Seller"}.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {reportsToRender.map((report) => (
          <ReportDownloadCard
            key={report.title}
            title={report.title}
            description={report.description}
            onDownload={report.onDownload}
          />
        ))}
      </div>
    </div>
  );
}
