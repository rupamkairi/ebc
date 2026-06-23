"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  Headphones,
  IndianRupee,
  Layers3,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  TicketCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/containers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AdminDashboardSummary,
  DashboardRecentItem,
  reportService,
} from "@/services/reportService";
import { useAuthStore } from "@/store/authStore";

const ONE_HOUR_MS = 60 * 60 * 1000;

type Preset = "7d" | "30d" | "custom";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

const getPresetRange = (preset: Exclude<Preset, "custom">) => {
  const end = new Date();
  const start = subDays(end, preset === "7d" ? 6 : 29);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const formatNumber = (value?: number) => numberFormatter.format(value || 0);
const formatCurrency = (value?: number) => currencyFormatter.format(value || 0);

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden border-slate-200 shadow-sm", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-black text-slate-950">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{detail}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-md bg-white shadow-sm">
            <Icon className="size-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: React.ElementType;
  rows: Array<{ label: string; value: string; tone?: string }>;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-black text-slate-950">
          <Icon className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {row.label}
            </span>
            <span className={cn("text-sm font-black text-slate-950", row.tone)}>
              {row.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: DashboardRecentItem[];
  emptyLabel: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black uppercase text-muted-foreground">
        {title}
      </h3>
      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-200 p-4 text-sm font-medium text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={`${title}-${item.id}`}
              href={item.href}
              className="block rounded-md border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">
                    {item.title}
                  </p>
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {item.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {format(new Date(item.createdAt), "dd MMM, p")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TrendPanel({ data }: { data: AdminDashboardSummary["trend"] }) {
  const maxActivity = Math.max(
    1,
    ...data.map(
      (item) =>
        item.enquiries + item.appointments + item.quotations + item.visits,
    ),
  );

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-black">
          <BarChart3 className="size-4 text-primary" />
          Activity Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {data.map((item) => {
            const total =
              item.enquiries + item.appointments + item.quotations + item.visits;
            const height = Math.max(10, Math.round((total / maxActivity) * 120));
            return (
              <div key={item.label} className="flex min-w-0 flex-col items-center gap-2">
                <div className="flex h-32 w-full max-w-12 items-end rounded-md bg-slate-100 p-1">
                  <div
                    className="w-full rounded-sm bg-primary"
                    style={{ height }}
                    title={`${formatNumber(total)} activities`}
                  />
                </div>
                <span className="w-full truncate text-center text-[10px] font-bold text-muted-foreground">
                  {format(new Date(item.label), "dd MMM")}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {formatNumber(total)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [preset, setPreset] = useState<Preset>("30d");
  const [appliedRange, setAppliedRange] = useState(() => getPresetRange("30d"));
  const [draftRange, setDraftRange] = useState<DateRange | undefined>();

  const summaryQuery = useQuery({
    queryKey: [
      "admin-dashboard-summary",
      appliedRange.start.toISOString(),
      appliedRange.end.toISOString(),
    ],
    queryFn: () =>
      reportService.admin.fetchDashboardSummary(
        appliedRange.start,
        appliedRange.end,
      ),
    staleTime: ONE_HOUR_MS,
  });

  const dateLabel = useMemo(
    () =>
      `${format(appliedRange.start, "dd MMM yyyy")} - ${format(
        appliedRange.end,
        "dd MMM yyyy",
      )}`,
    [appliedRange],
  );

  const applyPreset = (nextPreset: Exclude<Preset, "custom">) => {
    setPreset(nextPreset);
    setDraftRange(undefined);
    setAppliedRange(getPresetRange(nextPreset));
  };

  const applyCustomRange = (range: DateRange | undefined) => {
    setPreset("custom");
    setDraftRange(range);
    if (!range?.from || !range.to) return;

    const start = new Date(range.from);
    const end = new Date(range.to);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    setAppliedRange({ start, end });
  };

  const summary = summaryQuery.data;

  return (
    <Container className="space-y-6 py-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
              Welcome back, {user?.name || "Admin"}
            </h1>
            {summary?.cached ? (
              <Badge variant="secondary" className="font-bold">
                Cached
              </Badge>
            ) : null}
          </div>
          <p className="max-w-3xl text-sm font-medium text-muted-foreground">
            Platform overview for {dateLabel}. Monitor users, marketplace
            activity, revenue, support, and pending operational work.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
            <Button
              size="sm"
              variant={preset === "7d" ? "default" : "ghost"}
              onClick={() => applyPreset("7d")}
            >
              Last 7 Days
            </Button>
            <Button
              size="sm"
              variant={preset === "30d" ? "default" : "ghost"}
              onClick={() => applyPreset("30d")}
            >
              Last 30 Days
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant={preset === "custom" ? "default" : "ghost"}
                >
                  <CalendarDays className="size-4" />
                  Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={draftRange}
                  onSelect={applyCustomRange}
                />
                {preset === "custom" && draftRange?.from && !draftRange.to ? (
                  <div className="border-t px-4 py-3 text-xs font-medium text-muted-foreground">
                    Select an end date to update the dashboard.
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => summaryQuery.refetch()}
            disabled={summaryQuery.isFetching}
          >
            <RefreshCw
              className={cn("size-4", summaryQuery.isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {summaryQuery.isError ? (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-red-600" />
              <div>
                <p className="font-black text-red-950">
                  Dashboard summary failed to load
                </p>
                <p className="text-sm font-medium text-red-700">
                  {(summaryQuery.error as Error).message}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => summaryQuery.refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {summaryQuery.isLoading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Revenue"
              value={formatCurrency(summary.finance.paidRevenueInr)}
              detail={`${formatNumber(summary.finance.paidOrders)} paid orders`}
              icon={IndianRupee}
              className="bg-emerald-50"
            />
            <MetricCard
              label="Active Users"
              value={formatNumber(summary.users.activeUsers)}
              detail={`${formatNumber(summary.users.total)} total accounts`}
              icon={UsersRound}
              className="bg-sky-50"
            />
            <MetricCard
              label="Activities"
              value={formatNumber(
                summary.activities.enquiries + summary.activities.appointments,
              )}
              detail={`${formatNumber(summary.activities.assignmentsDispatched)} assignments sent`}
              icon={MessageSquare}
              className="bg-violet-50"
            />
            <MetricCard
              label="Entities"
              value={formatNumber(summary.entities.total)}
              detail={`${formatNumber(summary.entities.pendingVerification)} pending verification`}
              icon={ShieldCheck}
              className="bg-amber-50"
            />
            <MetricCard
              label="Support Load"
              value={formatNumber(summary.operations.openSupportTickets)}
              detail={`${formatNumber(summary.operations.urgentSupportTickets)} high priority`}
              icon={Headphones}
              className="bg-rose-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SummaryCard
              title="People"
              icon={UserRound}
              rows={[
                { label: "Buyers", value: formatNumber(summary.users.buyers) },
                {
                  label: "Product sellers",
                  value: formatNumber(summary.users.productSellers),
                },
                {
                  label: "Service providers",
                  value: formatNumber(summary.users.serviceProviders),
                },
                {
                  label: "Admin staff",
                  value: formatNumber(summary.users.adminStaff),
                },
              ]}
            />
            <SummaryCard
              title="Marketplace"
              icon={ShoppingBag}
              rows={[
                {
                  label: "Item listings",
                  value: formatNumber(summary.marketplace.itemListings),
                },
                { label: "Offers", value: formatNumber(summary.marketplace.offers) },
                { label: "Events", value: formatNumber(summary.marketplace.events) },
                {
                  label: "Content posts",
                  value: formatNumber(summary.marketplace.content),
                },
              ]}
            />
            <SummaryCard
              title="Activity Flow"
              icon={Layers3}
              rows={[
                {
                  label: "Enquiries",
                  value: formatNumber(summary.activities.enquiries),
                },
                {
                  label: "Appointments",
                  value: formatNumber(summary.activities.appointments),
                },
                {
                  label: "Quotations",
                  value: formatNumber(summary.activities.quotations),
                },
                { label: "Visits", value: formatNumber(summary.activities.visits) },
              ]}
            />
            <SummaryCard
              title="Finance"
              icon={Coins}
              rows={[
                {
                  label: "Coin topups",
                  value: formatNumber(summary.finance.coinTopups),
                },
                {
                  label: "Topup INR",
                  value: formatCurrency(summary.finance.coinTopupsInr),
                },
                {
                  label: "Coins consumed",
                  value: formatNumber(summary.finance.coinsConsumed),
                },
                {
                  label: "Paid revenue",
                  value: formatCurrency(summary.finance.paidRevenueInr),
                  tone: "text-emerald-700",
                },
              ]}
            />
            <SummaryCard
              title="Operations"
              icon={TicketCheck}
              rows={[
                {
                  label: "Support tickets",
                  value: formatNumber(summary.operations.supportTickets),
                },
                {
                  label: "Notification failures",
                  value: `${formatNumber(summary.operations.failedNotifications)} (${summary.operations.notificationFailureRate}%)`,
                  tone:
                    summary.operations.failedNotifications > 0
                      ? "text-red-700"
                      : "text-emerald-700",
                },
                {
                  label: "Reviews",
                  value: formatNumber(summary.operations.reviews),
                },
                {
                  label: "Average rating",
                  value: summary.operations.averageRating.toFixed(1),
                },
              ]}
            />
            <SummaryCard
              title="Entity Health"
              icon={PackageCheck}
              rows={[
                {
                  label: "Approved",
                  value: formatNumber(summary.entities.approved),
                  tone: "text-emerald-700",
                },
                {
                  label: "Pending",
                  value: formatNumber(summary.entities.pendingVerification),
                  tone: "text-amber-700",
                },
                {
                  label: "Needs attention",
                  value: formatNumber(summary.entities.attentionRequired),
                  tone:
                    summary.entities.attentionRequired > 0
                      ? "text-red-700"
                      : "text-emerald-700",
                },
                {
                  label: "Product / Service",
                  value: `${formatNumber(summary.entities.product)} / ${formatNumber(summary.entities.service)}`,
                },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            <TrendPanel data={summary.trend} />

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <Clock3 className="size-4 text-primary" />
                  Attention Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
                <RecentList
                  title="Pending Entity Verification"
                  items={summary.recent.pendingEntities}
                  emptyLabel="No entities waiting for verification."
                />
                <RecentList
                  title="Open Support"
                  items={summary.recent.support}
                  emptyLabel="No open support tickets."
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <CheckCircle2 className="size-4 text-primary" />
                  Recent Buyer Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <RecentList
                  title="Enquiries"
                  items={summary.recent.enquiries}
                  emptyLabel="No recent enquiries in this range."
                />
                <RecentList
                  title="Appointments"
                  items={summary.recent.appointments}
                  emptyLabel="No recent appointments in this range."
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <Star className="size-4 text-primary" />
                  Platform Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-bold text-muted-foreground">
                    Completed visits
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {formatNumber(summary.activities.completedVisits)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-bold text-muted-foreground">
                    Discussions
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {formatNumber(summary.marketplace.discussions)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-bold text-muted-foreground">
                    Notification attempts
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {formatNumber(summary.operations.notificationAttempts)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-bold text-muted-foreground">
                    Review score
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {summary.operations.averageRating.toFixed(1)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Container>
  );
}
