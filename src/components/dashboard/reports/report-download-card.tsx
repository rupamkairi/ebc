"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Search, Table2 } from "lucide-react";
import { ReportResponse, ReportRow, reportService } from "@/services/reportService";

interface ReportDownloadCardProps {
  title: string;
  description: string;
  onPreview: (start: Date, end: Date) => Promise<ReportResponse>;
}

export function ReportDownloadCard({
  title,
  description,
  onPreview,
}: ReportDownloadCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const columns = useMemo(() => {
    const rows = report?.rows || [];
    return Array.from(
      rows.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set<string>()),
    );
  }, [report]);

  const filteredRows = useMemo(() => {
    const rows = report?.rows || [];
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(query),
      ),
    );
  }, [report, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPage(1);
      setSearch("");
      const data = await onPreview(new Date(startDate), new Date(endDate));
      setReport(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate report. Please try again.";
      console.error("Failed to generate report", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCell = (value: ReportRow[string]) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-card-foreground leading-none">
          {title}
        </h3>
        <p className="text-sm text-balance text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Start Date
          </label>
          <Input
            title="Start Date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            End Date
          </label>
          <Input
            title="End Date"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handlePreview}
            disabled={isLoading || !startDate || !endDate}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Table2 className="mr-2 h-4 w-4" />
            )}
            Preview
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}

      {report && (
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search preview"
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              disabled={filteredRows.length === 0}
              onClick={() => reportService.downloadRows(filteredRows, report.filename)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>

          <div className="rounded-lg border overflow-auto max-h-[420px]">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="h-24 text-center text-muted-foreground">
                      No report rows found.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row, index) => (
                    <tr key={index} className="border-t">
                      {columns.map((column) => (
                        <td key={column} className="px-3 py-2 align-top whitespace-nowrap">
                          {formatCell(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-muted-foreground">
            <span>
              Showing {pageRows.length} of {filteredRows.length} rows
            </span>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-8 rounded-md border bg-background px-2"
                aria-label="Rows per page"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <span className="min-w-16 text-center">
                {safePage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
