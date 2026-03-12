"use client";

import { 
  TrendingUp, 
  Users2,
  UserCheck,
  CreditCard,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEntitiesQuery } from "@/queries/entityQueries";
import {
  useAssignmentsQuery,
  useQuotationsQuery,
} from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface CustomerData {
  id: string;
  name?: string;
  orders: number;
  totalValue: number;
  createdAt: string;
  lastActivity: string;
}

export default function CustomerAnalyticsPage() {
  const { t } = useLanguage();
  const { data: session } = useSessionQuery();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const isServiceProvider = mainEntity?.op_type === "SERVICE";

  const { data: assignments = [], isLoading: isAssignmentsLoading } =
    useAssignmentsQuery({
      toEntityId: mainEntity?.id,
    });

  const { data: quotations = [], isLoading: isQuotationsLoading } =
    useQuotationsQuery({
      createdById: session?.user?.id,
    });

  const isLoading = isAssignmentsLoading || isQuotationsLoading;

  const stats = useMemo(() => {
    if (!assignments.length && !quotations.length) return null;

    const customerMap = new Map<string, CustomerData>();
    
    // Process assignments to find potential customers (Enquiries & Appointments)
    assignments.forEach((assignment: Record<string, any>) => {
      const activity = assignment.enquiry || assignment.appointment;
      const buyer = activity?.createdBy;
      if (!buyer) return;
      
      if (!customerMap.has(buyer.id)) {
        customerMap.set(buyer.id, {
          id: buyer.id,
          name: buyer.name,
          orders: 0,
          totalValue: 0,
          createdAt: buyer.createdAt,
          lastActivity: activity.createdAt
        });
      }
    });

    // Process quotations to find actual buyers
    quotations.forEach((q: Record<string, any>) => {
      const buyerId = q.enquiry?.createdById;
      if (buyerId && customerMap.has(buyerId)) {
        const cus = customerMap.get(buyerId)!;
        if (q.status === "ACCEPTED") {
          cus.orders += 1;
          // Only track revenue for product sellers
          if (!isServiceProvider) {
            const totalAmount = q.quotationLineItems?.reduce((sum: number, item: Record<string, any>) => sum + (item.amount || 0), 0) || 0;
            cus.totalValue += totalAmount;
          }
          if (q.updatedAt > cus.lastActivity) {
            cus.lastActivity = q.updatedAt;
          }
        }
      }
    });

    const customers = Array.from(customerMap.values());
    const totalCustomers = customers.length;
    const activeBuyers = customers.filter(c => c.orders > 0).length;
    const repeatBuyers = customers.filter(c => c.orders > 1).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalValue, 0);
    
    const topCustomers = [...customers]
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Weekly stats for the chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const dailyStats = last7Days.map(dateStr => {
      // Leads count both Enquiries and Appointments
      const dayLeads = assignments.filter((a: Record<string, any>) => 
        (a.enquiry?.createdAt || a.appointment?.createdAt || "").startsWith(dateStr)
      ).length;
      const dayConversions = quotations.filter((q: Record<string, any>) => 
        q.status === "ACCEPTED" && (q.updatedAt || "").startsWith(dateStr)
      ).length;
      
      return {
        label: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        leads: dayLeads,
        conversions: dayConversions
      };
    });

    return {
      totalCustomers,
      activeBuyers,
      totalRevenue,
      retentionRate: activeBuyers > 0 ? (repeatBuyers / activeBuyers) * 100 : 0,
      dailyStats,
      topCustomers
    };
  }, [assignments, quotations, isServiceProvider]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          {t("customer_analytics", "Customer Analytics")}
        </h1>
        <p className="text-slate-500 font-medium">
          {t("analytics_subtitle", "Real-time insights from your business activity")}
        </p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isServiceProvider ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
        <StatCard 
          title={t("total_customers")} 
          value={stats?.totalCustomers || 0}
          icon={<Users2 className="text-blue-600" />}
          color="blue"
        />
        <StatCard 
          title={t("active_buyers", "Active Buyers")} 
          value={stats?.activeBuyers || 0}
          icon={<UserCheck className="text-emerald-600" />}
          color="emerald"
        />
        <StatCard 
          title={t("repeat_rate", "Repeat Rate")} 
          value={`${(stats?.retentionRate || 0).toFixed(1)}%`}
          icon={<TrendingUp className="text-indigo-600" />}
          color="indigo"
        />
        {!isServiceProvider && (
          <StatCard 
            title={t("total_revenue")} 
            value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={<CreditCard className="text-orange-600" />}
            color="orange"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-12 border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
            <CardTitle className="text-xl font-bold text-primary">
              {t("customer_growth", "Customer Acquisition (Last 7 Days)")}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                {t("new_leads", "New Leads")}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                {t("conversions", "Conversions")}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full flex items-end justify-between gap-4 sm:gap-12 px-4">
              {(stats?.dailyStats || []).map((day, i) => {
                const maxVal = Math.max(...(stats?.dailyStats || []).map(d => d.leads), 5);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full relative h-[220px] flex items-end gap-1">
                      <div 
                        className="flex-1 bg-blue-100 group-hover:bg-blue-200 transition-all rounded-t-lg relative"
                        style={{ height: `${(day.leads / maxVal) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.leads}
                        </div>
                      </div>
                      <div 
                        className="flex-1 bg-emerald-500 group-hover:bg-emerald-600 transition-all rounded-t-lg relative"
                        style={{ height: `${((day.conversions / maxVal) * 100) || 0}%` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.conversions}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="px-8 py-6 border-b border-slate-50">
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
             <Target className="text-orange-500" />
             {t("top_performing_customers", "Top Performing Customers")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{t("customer")}</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{t("total_orders")}</th>
                  {!isServiceProvider && (
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{t("total_value")}</th>
                  )}
                  <th className={`px-8 py-4 ${isServiceProvider ? 'text-right' : 'text-right'} text-xs font-bold text-slate-400 uppercase tracking-wider`}>{t("last_active")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {!stats?.topCustomers || stats.topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={isServiceProvider ? 3 : 4} className="px-8 py-10 text-center text-slate-400 font-medium italic">
                       {t("no_data_available")}
                    </td>
                  </tr>
                ) : (
                  stats.topCustomers.map((cus: CustomerData) => (
                    <tr key={cus.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                            {cus.name?.[0] || "?"}
                          </div>
                          <div>
                            <div className="font-bold text-primary">{cus.name || "Unknown"}</div>
                            <div className="text-xs text-slate-400 font-medium">ID: #{cus.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-primary">
                        {cus.orders}
                      </td>
                      {!isServiceProvider && (
                        <td className="px-8 py-5 text-primary font-medium">
                          ₹{cus.totalValue.toLocaleString()}
                        </td>
                      )}
                      <td className="px-8 py-5 text-right text-slate-500 text-sm font-medium">
                        {new Date(cus.lastActivity).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[28px] bg-white">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
          <p className="text-2xl font-black text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
