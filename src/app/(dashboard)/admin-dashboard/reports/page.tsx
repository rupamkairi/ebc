"use client";

import { ReportDownloadCard } from "@/components/dashboard/reports/report-download-card";
import { reportService } from "@/services/reportService";

export default function AdminReportsPage() {
  const adminReports = [
    {
      title: "Platform Overview",
      description: "Daily health summary tracking User registrations, active sessions, Enquiries, Appointments, and Wallet Transactions.",
      onDownload: reportService.admin.downloadPlatformOverview,
    },
    {
      title: "Enquiries Report",
      description: "Monitors marketplace core product transaction engine. Tracks Enquiries, Entity matches, and Quotation acceptance rates.",
      onDownload: reportService.admin.downloadEnquiries,
    },
    {
      title: "Appointments Report",
      description: "Tracks service-provider interactions. Monitors Appointment requests, Visit confirmations, and completion rates.",
      onDownload: reportService.admin.downloadAppointments,
    },
    {
      title: "Entities Report",
      description: "Evaluates marketplace quality per Entity. Compares Activity leads against Quotations submitted or Appointments confirmed.",
      onDownload: reportService.admin.downloadEntities,
    },
    {
      title: "Wallet Transactions",
      description: "Protects monetization by tracking total Coins altered across Wallets. Details transactions, reasons, and INR equivalents.",
      onDownload: reportService.admin.downloadWalletTransactions,
    },
    {
      title: "Conference Discussions",
      description: "Measures trust-building engine by tracking Discussion posts, Event participation, and engagement metrics.",
      onDownload: reportService.admin.downloadConferenceDiscussions,
    },
    {
      title: "Support Queries",
      description: "Logs system complaints routing them by Category to Support Queries. Measures resolution time and status.",
      onDownload: reportService.admin.downloadSupportQueries,
    },
    {
      title: "System Health",
      description: "Technical monitoring for platform reliability. Tracks failed Orders, failed Notification deliveries, and system bottlenecks.",
      onDownload: reportService.admin.downloadSystemHealth,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">Admin Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
          Download detailed historical platform data in CSV format. Select your desired date range
          for each report before generating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminReports.map((report) => (
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
