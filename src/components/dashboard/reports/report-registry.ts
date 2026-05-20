export type ReportScope = "admin" | "productSeller" | "serviceProvider";

export interface ReportDefinition {
  slug: string;
  title: string;
  description: string;
  roleScope: ReportScope;
  endpoint: string;
  filename: string;
}

export const adminReports: ReportDefinition[] = [
  {
    slug: "platform-overview",
    title: "Platform Overview",
    description:
      "Daily health summary tracking user registrations, active sessions, enquiries, appointments, and wallet transactions.",
    roleScope: "admin",
    endpoint: "/admin/platform-overview",
    filename: "platform-overview.csv",
  },
  {
    slug: "enquiries",
    title: "Enquiries Report",
    description:
      "Monitors product enquiry activity, entity matches, quotations, and acceptance outcomes.",
    roleScope: "admin",
    endpoint: "/admin/enquiries",
    filename: "enquiries.csv",
  },
  {
    slug: "appointments",
    title: "Appointments Report",
    description:
      "Tracks service appointment requests, visit confirmations, completion, and cancellation activity.",
    roleScope: "admin",
    endpoint: "/admin/appointments",
    filename: "appointments.csv",
  },
  {
    slug: "entities",
    title: "Entities Report",
    description:
      "Compares entity activity, lead intake, submitted quotations, confirmed appointments, and ratings.",
    roleScope: "admin",
    endpoint: "/admin/entities",
    filename: "entities-performance.csv",
  },
  {
    slug: "wallet-transactions",
    title: "Wallet Transactions",
    description:
      "Reviews coin credits, deductions, transaction reasons, and INR-equivalent wallet activity.",
    roleScope: "admin",
    endpoint: "/admin/wallet-transactions",
    filename: "wallet-transactions.csv",
  },
  {
    slug: "conference-discussions",
    title: "Conference Discussions",
    description:
      "Measures forum discussions, conference activity, event participation, and engagement metrics.",
    roleScope: "admin",
    endpoint: "/admin/conference-discussions",
    filename: "conference-discussions.csv",
  },
  {
    slug: "support-queries",
    title: "Support Queries",
    description:
      "Tracks support query categories, statuses, and resolution timelines.",
    roleScope: "admin",
    endpoint: "/admin/support-queries",
    filename: "support-queries.csv",
  },
  {
    slug: "system-health",
    title: "System Health",
    description:
      "Reviews technical health signals, failed operations, notifications, and system bottlenecks.",
    roleScope: "admin",
    endpoint: "/admin/system-health",
    filename: "system-health.csv",
  },
];

export const productSellerReports: ReportDefinition[] = [
  {
    slug: "enquiries",
    title: "Enquiries Report",
    description:
      "Exports assigned enquiries with buyer pincodes, quotation submissions, and conversion outcomes.",
    roleScope: "productSeller",
    endpoint: "/product-seller/enquiries",
    filename: "seller-enquiries.csv",
  },
  {
    slug: "entity-metrics",
    title: "Self Performance Metrics",
    description:
      "Summarizes lead intake, quoting responsiveness, conversion rates, and buyer ratings.",
    roleScope: "productSeller",
    endpoint: "/product-seller/entity-metrics",
    filename: "seller-metrics.csv",
  },
  {
    slug: "wallet-transactions",
    title: "Wallet Transactions Ledger",
    description:
      "Exports wallet coin deductions, credits, transaction reasons, and closing balances.",
    roleScope: "productSeller",
    endpoint: "/product-seller/wallet-transactions",
    filename: "seller-wallet-transactions.csv",
  },
];

export const serviceProviderReports: ReportDefinition[] = [
  {
    slug: "appointments",
    title: "Appointments Report",
    description:
      "Exports appointment requests with visit tracking, cancellation activity, and ratings.",
    roleScope: "serviceProvider",
    endpoint: "/service-provider/appointments",
    filename: "provider-appointments.csv",
  },
  {
    slug: "entity-metrics",
    title: "Self Performance Metrics",
    description:
      "Summarizes appointment intake, visit confirmations, completion rates, and buyer ratings.",
    roleScope: "serviceProvider",
    endpoint: "/service-provider/entity-metrics",
    filename: "provider-metrics.csv",
  },
  {
    slug: "wallet-transactions",
    title: "Wallet Transactions Ledger",
    description:
      "Exports wallet coin deductions, credits, transaction reasons, and closing balances.",
    roleScope: "serviceProvider",
    endpoint: "/service-provider/wallet-transactions",
    filename: "provider-wallet-transactions.csv",
  },
];

const reportsByScope: Record<ReportScope, ReportDefinition[]> = {
  admin: adminReports,
  productSeller: productSellerReports,
  serviceProvider: serviceProviderReports,
};

export const getReportsForScope = (scope: ReportScope) => reportsByScope[scope];

export const getReportBySlug = (scope: ReportScope, slug?: string) =>
  reportsByScope[scope].find((report) => report.slug === slug);
