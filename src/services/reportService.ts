import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";

export type ReportRow = Record<string, string | number | boolean | null | undefined>;

export interface ReportResponse {
  filename: string;
  columns: string[];
  rows: ReportRow[];
  total: number;
}

const parseCsv = (csv: string) => {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(field);
      records.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    records.push(row);
  }

  const [headerRow, ...bodyRows] = records;
  if (!headerRow || headerRow.length === 0) {
    return { columns: [], rows: [] as ReportRow[] };
  }

  const columns = headerRow.map((column, index) => column || `Column ${index + 1}`);
  const rows = bodyRows
    .filter((record) => record.some((value) => value.trim().length > 0))
    .map((record) =>
      columns.reduce<ReportRow>((acc, column, index) => {
        acc[column] = record[index] ?? "";
        return acc;
      }, {}),
    );

  return { columns, rows };
};

const withDates = (startDate: string, endDate: string) => ({
  startDate,
  endDate,
});

const dateToParam = (date: Date) => date.toISOString();

const fetchReport = async (
  endpoint: string,
  params: Record<string, string>,
  filename: string,
): Promise<ReportResponse> => {
  const token = useAuthStore.getState().token;
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/report${endpoint}?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/csv",
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

  const csv = await response.text();
  const { columns, rows } = parseCsv(csv);

  return {
    filename,
    columns,
    rows,
    total: rows.length,
  };
};

const escapeCsvValue = (value: ReportRow[string]) => {
  const stringValue = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const rowsToCsv = (rows: ReportRow[], columns?: string[]) => {
  const csvColumns =
    columns && columns.length > 0
      ? columns
      : Array.from(
          rows.reduce((set, row) => {
            Object.keys(row).forEach((key) => set.add(key));
            return set;
          }, new Set<string>()),
        );

  if (csvColumns.length === 0) return "";

  const header = csvColumns.map(escapeCsvValue).join(",");
  const body = rows.map((row) =>
    csvColumns.map((column) => escapeCsvValue(row[column])).join(","),
  );
  return [header, ...body].join("\n");
};

const downloadRows = (rows: ReportRow[], filename: string, columns?: string[]) => {
  const blob = new Blob([rowsToCsv(rows, columns)], {
    type: "text/csv;charset=utf-8",
  });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

const fetchReportByDateStrings = (
  endpoint: string,
  filename: string,
  startDate: string,
  endDate: string,
) => fetchReport(endpoint, withDates(startDate, endDate), filename);

const fetchReportByDates = (endpoint: string, filename: string) => (
  start: Date,
  end: Date,
) =>
  fetchReport(endpoint, withDates(dateToParam(start), dateToParam(end)), filename);

export const reportService = {
  downloadRows,
  fetchReport: fetchReportByDateStrings,
  admin: {
    fetchPlatformOverview: fetchReportByDates(
      "/admin/platform-overview",
      "platform-overview.csv",
    ),
    fetchEnquiries: fetchReportByDates("/admin/enquiries", "enquiries.csv"),
    fetchAppointments: fetchReportByDates("/admin/appointments", "appointments.csv"),
    fetchEntities: fetchReportByDates(
      "/admin/entities",
      "entities-performance.csv",
    ),
    fetchWalletTransactions: fetchReportByDates(
      "/admin/wallet-transactions",
      "wallet-transactions.csv",
    ),
    fetchConferenceDiscussions: fetchReportByDates(
      "/admin/conference-discussions",
      "conference-discussions.csv",
    ),
    fetchSupportQueries: fetchReportByDates(
      "/admin/support-queries",
      "support-queries.csv",
    ),
    fetchSystemHealth: fetchReportByDates("/admin/system-health", "system-health.csv"),
  },
  productSeller: {
    fetchEnquiries: fetchReportByDates(
      "/product-seller/enquiries",
      "seller-enquiries.csv",
    ),
    fetchEntityMetrics: fetchReportByDates(
      "/product-seller/entity-metrics",
      "seller-metrics.csv",
    ),
    fetchWalletTransactions: fetchReportByDates(
      "/product-seller/wallet-transactions",
      "seller-wallet-transactions.csv",
    ),
  },
  serviceProvider: {
    fetchAppointments: fetchReportByDates(
      "/service-provider/appointments",
      "provider-appointments.csv",
    ),
    fetchEntityMetrics: fetchReportByDates(
      "/service-provider/entity-metrics",
      "provider-metrics.csv",
    ),
    fetchWalletTransactions: fetchReportByDates(
      "/service-provider/wallet-transactions",
      "provider-wallet-transactions.csv",
    ),
  },
};
