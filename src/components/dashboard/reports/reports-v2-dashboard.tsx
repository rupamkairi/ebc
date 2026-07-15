"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Loader2, RefreshCw, ShieldAlert, SlidersHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportService, ReportV2Dashboard, ReportV2Module } from "@/services/reportService";

type Grouping = "day" | "week" | "month" | "year";
const initialStart = () => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
const initialEnd = () => new Date().toISOString().slice(0, 10);
const dateLabel = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
const displayValue = (value: number | null, format?: string) => value === null ? "Not available" : format === "percent" ? `${value}%` : format === "currency" ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value) : format === "duration" ? `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value)} min` : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value);

function Metrics({ module }: { module: ReportV2Module }) {
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{module.metrics.map((metric) => <div key={metric.id} className="rounded-lg border bg-muted/30 p-3" title={metric.definition}>
    <p className="text-xs text-muted-foreground">{metric.label}</p>
    <p className="mt-1 text-lg font-semibold">{displayValue(metric.value, metric.format)}</p>
    {metric.unavailableReason ? <p className="mt-1 text-[11px] text-amber-700">Collection unavailable for this period</p> : metric.comparison?.change !== null && metric.comparison?.change !== undefined ? <p className={`mt-1 flex items-center gap-1 text-[11px] ${metric.comparison.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{metric.comparison.change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}{Math.abs(metric.comparison.change)}% vs previous period</p> : <p className="mt-1 text-[11px] text-muted-foreground">No comparable baseline</p>}
  </div>)}</div>;
}

function Rows({ module }: { module: ReportV2Module }) {
  if (!module.rows.length || !module.columns.length) return null;
  return <div className="overflow-hidden rounded-lg border"><div className="border-b bg-muted/30 px-4 py-2 text-sm font-medium">Audit details <span className="font-normal text-muted-foreground">({module.rows.length} rows)</span></div><div className="max-h-80 overflow-auto"><Table><TableHeader><TableRow>{module.columns.map((column) => <TableHead key={column}>{column.replaceAll(/([A-Z])/g, " $1")}</TableHead>)}</TableRow></TableHeader><TableBody>{module.rows.slice(0, 25).map((row, index) => <TableRow key={String(row.id || row.rfqId || row.transactionId || index)}>{module.columns.map((column) => <TableCell key={column} className="whitespace-nowrap text-xs">{String(row[column] ?? "-")}</TableCell>)}</TableRow>)}</TableBody></Table></div></div>;
}

export function ReportsV2Dashboard() {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [dashboard, setDashboard] = useState<ReportV2Dashboard | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [pincodeId, setPincodeId] = useState("");
  const [grouping, setGrouping] = useState<Grouping>("day");
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (refine = false, clear = false) => {
    if (!startDate || !endDate) return setError("Select both start and end dates.");
    if (new Date(startDate) > new Date(endDate)) return setError("Start date must be before or equal to end date.");
    try {
      setLoading(true); setError(null);
      const next = refine ? await reportService.admin.refineV2Dashboard({ startDate, endDate, categoryId: clear ? undefined : categoryId || undefined, pincodeId: clear ? undefined : pincodeId || undefined, grouping: clear ? "day" : grouping }) : await reportService.admin.fetchV2Dashboard(startDate, endDate);
      if (clear) { setCategoryId(""); setPincodeId(""); setGrouping("day"); }
      setDashboard(next);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Failed to load Reports V2"); }
    finally { setLoading(false); }
  };

  const download = async (moduleId: string) => {
    try { await reportService.admin.downloadV2Module(moduleId, startDate, endDate, { categoryId: dashboard?.appliedFilters.categoryId || undefined, pincodeId: dashboard?.appliedFilters.pincodeId || undefined, grouping: dashboard?.appliedFilters.grouping }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Failed to export module"); }
  };

  const categoryName = dashboard?.refinements.categories.find((item) => item.id === dashboard.appliedFilters.categoryId)?.name;
  const pincodeName = dashboard?.refinements.pincodes.find((item) => item.id === dashboard.appliedFilters.pincodeId)?.label;

  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-responsive py-8">
    <div><h1 className="text-2xl font-bold">Reports V2</h1><p className="text-sm text-muted-foreground">Operations, revenue, risk, and marketplace health.</p></div>
    <Card><CardContent className="grid grid-cols-1 items-end gap-3 p-5 md:grid-cols-[1fr_1fr_auto]"><div className="space-y-2"><Label htmlFor="report-start">Start date</Label><Input id="report-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="report-end">End date</Label><Input id="report-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div><Button onClick={() => run(false)} disabled={loading || !startDate || !endDate}>{loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}{loading ? "Loading reports…" : "View reports"}</Button></CardContent></Card>
    {error && <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
    {!dashboard && !loading && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Select a date range and view reports.</CardContent></Card>}
    {dashboard && <>
      <Card><CardContent className="grid gap-4 p-5 md:grid-cols-3"><div><p className="text-xs text-muted-foreground">Selected period</p><p className="font-medium">{dateLabel(dashboard.selectedPeriod.start)} - {dateLabel(dashboard.selectedPeriod.end)}</p></div><div><p className="text-xs text-muted-foreground">Compared with</p><p className="font-medium">{dateLabel(dashboard.comparisonPeriod.start)} - {dateLabel(dashboard.comparisonPeriod.end)}</p></div><div><p className="text-xs text-muted-foreground">Generated</p><p className="font-medium">{new Date(dashboard.generatedAt).toLocaleString("en-IN")}</p></div></CardContent></Card>
      <details className="rounded-lg border bg-card"><summary className="flex cursor-pointer list-none items-center gap-2 p-4 font-medium"><SlidersHorizontal className="size-4" />Refine report</summary><div className="grid gap-4 border-t p-4 md:grid-cols-3"><div className="space-y-2"><Label>Category</Label><Combobox options={dashboard.refinements.categories.filter((item) => item.name.toLowerCase().includes(categorySearch.toLowerCase())).map((item) => ({ value: item.id, label: item.name }))} value={categoryId} onValueChange={setCategoryId} searchValue={categorySearch} onSearchValueChange={setCategorySearch} placeholder="Search category name" label="All categories" /></div><div className="space-y-2"><Label>Location</Label><Combobox options={dashboard.refinements.pincodes.filter((item) => item.label.toLowerCase().includes(locationSearch.toLowerCase())).slice(0, 100).map((item) => ({ value: item.id, label: item.label }))} value={pincodeId} onValueChange={setPincodeId} searchValue={locationSearch} onSearchValueChange={setLocationSearch} placeholder="Search pincode or place" label="All locations" /></div><div className="space-y-2"><Label>Trend grouping</Label><Select value={grouping} onValueChange={(value) => setGrouping(value as Grouping)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(["day", "week", "month", "year"] as const).map((value) => <SelectItem key={value} value={value} className="capitalize">{value}</SelectItem>)}</SelectContent></Select></div><div className="flex flex-wrap items-center gap-2 md:col-span-3">{categoryName && <Badge variant="secondary">Category: {categoryName}</Badge>}{pincodeName && <Badge variant="secondary">Location: {pincodeName}</Badge>}<Badge variant="outline">Grouped by {dashboard.appliedFilters.grouping}</Badge><div className="ml-auto flex gap-2"><Button variant="ghost" onClick={() => run(true, true)} disabled={loading}>Clear filters</Button><Button onClick={() => run(true)} disabled={loading}>Apply refinements</Button></div></div></div></details>
      <section><h2 className="mb-3 text-lg font-semibold">Executive summary</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{dashboard.executiveSummary.slice(0, 8).map((item) => <Card key={item.id}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 text-xl font-semibold">{displayValue(item.value, item.format)}</p></CardContent></Card>)}</div></section>
      {dashboard.alerts.length ? <Card className="border-amber-500/40"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="size-5 text-amber-600" />Active alerts</CardTitle><CardDescription>Automatically triggered operational thresholds.</CardDescription></CardHeader><CardContent className="grid gap-2 md:grid-cols-2">{dashboard.alerts.map((alert) => <div key={alert.id} className="rounded-md bg-muted p-3 text-sm"><span className="font-medium">{alert.severity}: {alert.metric.replaceAll("_", " ")}</span><span className="ml-2 text-muted-foreground">{alert.observed} (threshold {alert.threshold})</span></div>)}</CardContent></Card> : <Card><CardContent className="flex items-center gap-2 p-4 text-sm text-emerald-700"><CheckCircle2 className="size-4" />No active threshold alerts for this report.</CardContent></Card>}
      <section><h2 className="mb-3 text-lg font-semibold">Operations checklists</h2><div className="grid gap-4 md:grid-cols-3">{dashboard.checklists.map((list) => <Card key={list.period}><CardHeader><CardTitle className="capitalize">{list.period} review</CardTitle></CardHeader><CardContent className="space-y-2">{list.items.map((item) => <div key={item} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 text-muted-foreground" />{item}</div>)}</CardContent></Card>)}</div></section>
      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Report modules">{dashboard.modules.map((module, index) => <Button key={module.id} variant="outline" size="sm" asChild><a href={`#${module.id}`}>{index + 1}. {module.title}</a></Button>)}</nav>
      <div className="space-y-6">{dashboard.modules.map((module, index) => <Card id={module.id} key={module.id} className="scroll-mt-4"><CardHeader className="flex-row items-start justify-between gap-4"><div><CardDescription>Module {index + 1}</CardDescription><CardTitle>{module.title}</CardTitle><CardDescription className="mt-1">{module.objective}</CardDescription></div><Button variant="outline" size="sm" onClick={() => download(module.id)}><Download className="mr-2 size-4" />CSV</Button></CardHeader><CardContent className="space-y-5"><Metrics module={module} />{module.tags.length > 0 && <div><p className="mb-2 text-sm font-medium">Performance tags</p><div className="flex flex-wrap gap-2">{module.tags.map((tag) => <Badge key={tag.code} variant="outline" title={tag.explanation}>{tag.label}</Badge>)}</div></div>}{module.breakdowns.map((breakdown) => <div key={breakdown.id}><p className="mb-2 text-sm font-medium">{breakdown.title}</p><div className="flex flex-wrap gap-2">{breakdown.rows.slice(0, 8).map((row, rowIndex) => <Badge key={rowIndex} variant="secondary">{Object.values(row).join(": ")}</Badge>)}</div></div>)}<Rows module={module} />{module.metrics.some((item) => item.unavailableReason) && <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800"><AlertTriangle className="mt-0.5 size-4 shrink-0" />Telemetry-dependent metrics show “Not available” until events exist for the selected period; they are never represented as misleading zeroes.</div>}</CardContent></Card>)}</div>
    </>}
  </div>;
}
