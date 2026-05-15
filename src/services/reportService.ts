import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";

export type ReportRow = Record<string, string | number | boolean | null | undefined>;

export interface ReportResponse {
  filename: string;
  rows: ReportRow[];
  total: number;
}

const fetchReport = async (
  endpoint: string,
  params: Record<string, string>,
  filename: string,
): Promise<ReportResponse> => {
  const token = useAuthStore.getState().token;
  const queryString = new URLSearchParams({
    ...params,
    format: "json",
  }).toString();
  const url = `${BASE_URL}/report${endpoint}?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate report";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return {
    filename: data.filename || filename,
    rows: Array.isArray(data.rows) ? data.rows : [],
    total: typeof data.total === "number" ? data.total : data.rows?.length || 0,
  };
};

const withDates = (start: Date, end: Date) => ({
  startDate: start.toISOString(),
  endDate: end.toISOString(),
});

const escapeCsvValue = (value: ReportRow[string]) => {
  const stringValue = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const rowsToCsv = (rows: ReportRow[]) => {
  if (rows.length === 0) return "";
  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );
  const header = columns.map(escapeCsvValue).join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsvValue(row[column])).join(","));
  return [header, ...body].join("\n");
};

const downloadRows = (rows: ReportRow[], filename: string) => {
  const blob = new Blob([rowsToCsv(rows)], { type: "text/csv;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

export const reportService = {
  downloadRows,
  admin: {
    fetchPlatformOverview: (start: Date, end: Date) =>
      fetchReport("/admin/platform-overview", withDates(start, end), "platform-overview.csv"),
    fetchEnquiries: (start: Date, end: Date) =>
      fetchReport("/admin/enquiries", withDates(start, end), "enquiries.csv"),
    fetchAppointments: (start: Date, end: Date) =>
      fetchReport("/admin/appointments", withDates(start, end), "appointments.csv"),
    fetchEntities: (start: Date, end: Date) =>
      fetchReport("/admin/entities", withDates(start, end), "entities-performance.csv"),
    fetchWalletTransactions: (start: Date, end: Date) =>
      fetchReport("/admin/wallet-transactions", withDates(start, end), "wallet-transactions.csv"),
    fetchConferenceDiscussions: (start: Date, end: Date) =>
      fetchReport("/admin/conference-discussions", withDates(start, end), "conference-discussions.csv"),
    fetchSupportQueries: (start: Date, end: Date) =>
      fetchReport("/admin/support-queries", withDates(start, end), "support-queries.csv"),
    fetchSystemHealth: (start: Date, end: Date) =>
      fetchReport("/admin/system-health", withDates(start, end), "system-health.csv"),
  },
  productSeller: {
    fetchEnquiries: (start: Date, end: Date) =>
      fetchReport("/product-seller/enquiries", withDates(start, end), "seller-enquiries.csv"),
    fetchEntityMetrics: (start: Date, end: Date) =>
      fetchReport("/product-seller/entity-metrics", withDates(start, end), "seller-metrics.csv"),
    fetchWalletTransactions: (start: Date, end: Date) =>
      fetchReport(
        "/product-seller/wallet-transactions",
        withDates(start, end),
        "seller-wallet-transactions.csv",
      ),
  },
  serviceProvider: {
    fetchAppointments: (start: Date, end: Date) =>
      fetchReport("/service-provider/appointments", withDates(start, end), "provider-appointments.csv"),
    fetchEntityMetrics: (start: Date, end: Date) =>
      fetchReport("/service-provider/entity-metrics", withDates(start, end), "provider-metrics.csv"),
    fetchWalletTransactions: (start: Date, end: Date) =>
      fetchReport(
        "/service-provider/wallet-transactions",
        withDates(start, end),
        "provider-wallet-transactions.csv",
      ),
  },
};
