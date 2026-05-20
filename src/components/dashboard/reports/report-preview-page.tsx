"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { ArrowLeft, Download, Loader2, Search, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/datatable/data-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { ReportDefinition } from "./report-registry";
import { ReportResponse, ReportRow, reportService } from "@/services/reportService";

interface ReportPreviewPageProps {
  report: ReportDefinition;
  backHref: string;
}

const defaultStartDate = () =>
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const defaultEndDate = () => new Date().toISOString().split("T")[0];

const formatCell = (value: ReportRow[string]) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const compareValues = (a: ReportRow[string], b: ReportRow[string]) => {
  const aValue = a ?? "";
  const bValue = b ?? "";
  const aNumber = Number(aValue);
  const bNumber = Number(bValue);

  if (
    String(aValue).trim() !== "" &&
    String(bValue).trim() !== "" &&
    Number.isFinite(aNumber) &&
    Number.isFinite(bNumber)
  ) {
    return aNumber - bNumber;
  }

  return String(aValue).localeCompare(String(bValue), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

export function ReportPreviewPage({ report, backHref }: ReportPreviewPageProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ReportRow, string | number | boolean | null | undefined>[]>(
    () =>
      (data?.columns ?? []).map((columnName) => ({
        accessorKey: columnName,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={columnName} />
        ),
        cell: ({ row }) => (
          <span className="block max-w-[320px] truncate" title={formatCell(row.original[columnName])}>
            {formatCell(row.original[columnName])}
          </span>
        ),
      })),
    [data?.columns],
  );
  const tableColumns = useMemo<
    ColumnDef<ReportRow, string | number | boolean | null | undefined>[]
  >(
    () =>
      columns.length > 0
        ? columns
        : [
            {
              id: "report-data",
              header: "Report Data",
              cell: () => null,
            },
          ],
    [columns],
  );

  const filteredRows = useMemo(() => {
    const rows = data?.rows ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(query),
      ),
    );
  }, [data?.rows, search]);

  const sortedRows = useMemo(() => {
    const [activeSort] = sorting;
    if (!activeSort) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const result = compareValues(a[activeSort.id], b[activeSort.id]);
      return activeSort.desc ? -result : result;
    });
  }, [filteredRows, sorting]);

  const pageCount = Math.max(
    1,
    Math.ceil(sortedRows.length / pagination.pageSize),
  );
  const pageRows = sortedRows.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
  );

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSearch("");
      setSorting([]);
      setPagination((current) => ({ ...current, pageIndex: 0 }));
      const response = await reportService.fetchReport(
        report.endpoint,
        report.filename,
        startDate,
        endDate,
      );
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate report.";
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data) return;
    reportService.downloadRows(sortedRows, data.filename, data.columns);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-responsive py-8">
      <div className="space-y-4">
        <Button variant="ghost" asChild className="w-fit px-0">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 size-4" />
            Back to reports
          </Link>
        </Button>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {report.title}
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {report.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Preview</CardTitle>
          <CardDescription>
            Select a date range. The full CSV report is loaded into the browser
            for preview, filtering, and download.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-1.5">
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
          <div className="space-y-1.5">
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
              onClick={handleGenerate}
              disabled={isLoading || !startDate || !endDate}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Table2 className="mr-2 size-4" />
              )}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              {data
                ? `${filteredRows.length} of ${data.total} rows loaded`
                : "Generate a report to preview table data here."}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            disabled={!data || sortedRows.length === 0}
            onClick={handleDownload}
          >
            <Download className="mr-2 size-4" />
            Download CSV
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPagination((current) => ({ ...current, pageIndex: 0 }));
              }}
              disabled={!data}
              placeholder="Search report rows"
              className="pl-9"
            />
          </div>

          <DataTable
            columns={tableColumns}
            data={pageRows}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={(updater) =>
              setPagination((current) => {
                const next =
                  typeof updater === "function" ? updater(current) : updater;
                const nextPageCount = Math.max(
                  1,
                  Math.ceil(sortedRows.length / next.pageSize),
                );
                return {
                  ...next,
                  pageIndex: Math.min(next.pageIndex, nextPageCount - 1),
                };
              })
            }
            sorting={sorting}
            onSortingChange={(updater) =>
              setSorting((current) =>
                typeof updater === "function" ? updater(current) : updater,
              )
            }
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
