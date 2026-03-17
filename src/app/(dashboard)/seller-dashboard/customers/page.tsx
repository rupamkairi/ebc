"use client";

import { User, Phone, MapPin, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useEntitiesQuery } from "@/queries/entityQueries";
import {
  useAssignmentsQuery,
  useQuotationsQuery,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { useMemo, useState } from "react";
import { Enquiry, Appointment } from "@/types/activity";
import { useLanguage } from "@/hooks/useLanguage";
import { CustomerPurchaseModal } from "@/components/dashboard/seller/customer-purchase-modal";
import { format } from "date-fns";

export default function CustomersPage() {
  const { t } = useLanguage();
  const { data: session } = useSessionQuery();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const [searchQuery] = useState("");

  const { data: assignments = [], isLoading: isAssignmentsLoading } =
    useAssignmentsQuery({
      toEntityId: mainEntity?.id,
    });

  const { data: quotations = [], isLoading: isQuotationsLoading } =
    useQuotationsQuery({
      createdById: session?.user?.id,
    });

  const { isLoading: isVisitsLoading } = useVisitsQuery({});

  const isLoading =
    isAssignmentsLoading || isQuotationsLoading || isVisitsLoading;

  const processedCustomers = useMemo(() => {
    if (!assignments.length) return [];

    const customerMap = new Map();

    assignments.forEach((assignment) => {
      const activity = assignment.enquiry || assignment.appointment;
      const buyer = activity?.createdBy;

      if (!buyer) return;

      if (!customerMap.has(buyer.id)) {
        const address =
          "enquiryDetails" in activity
            ? activity.enquiryDetails?.[0]?.address
            : "appointmentDetails" in activity
              ? activity.appointmentDetails?.[0]?.address
              : "Location N/A";

        customerMap.set(buyer.id, {
          id: buyer.id,
          name: buyer.name,
          phone: buyer.phone || "N/A",
          location: address || "Location N/A",
          lastEnquiry: "",
          lastActivityDate: activity?.createdAt,
          orders: 0,
          totalValue: 0,
          activities: [],
        });
      }

      const cus = customerMap.get(buyer.id);
      cus.activities.push(activity);

      if (new Date(activity.createdAt) > new Date(cus.lastActivityDate)) {
        cus.lastActivityDate = activity.createdAt;
      }
    });

    quotations.forEach((q) => {
      const buyerId = q.enquiry?.createdById;
      if (buyerId && customerMap.has(buyerId)) {
        const cus = customerMap.get(buyerId);
        if (q.status === "ACCEPTED") {
          cus.orders += 1;
        }
      }
    });

    return Array.from(customerMap.values()).map((cus) => ({
      ...cus,
      status: cus.orders === 0 ? "Lead" : "Active",
    }));
  }, [assignments, quotations]);

  const filteredCustomers = useMemo(() => {
    return processedCustomers.filter(
      (cus) =>
        cus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cus.phone.includes(searchQuery) ||
        cus.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [processedCustomers, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <h1 className="text-3xl font-black text-primary tracking-tight">
        {t("my_customers", "My Customers")}
      </h1>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[32px] border border-dashed border-slate-200 text-slate-400 font-bold">
            {t("no_active_customers", "No active customers found.")}
          </div>
        ) : (
          filteredCustomers.map((cus) => (
            <Card
              key={cus.id}
              className="bg-[#4155a0] border-none shadow-2xl rounded-[32px] overflow-hidden w-full max-w-[540px]"
            >
              <CardContent className="p-8 md:p-10 space-y-8">
                {/* Header Section */}
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-[28px] bg-white flex items-center justify-center shrink-0">
                    <User size={48} className="text-slate-700" title="User" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                      {cus.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-[#f2f48f] text-[#865d21] uppercase text-[10px] font-black rounded px-3 py-1 hover:bg-[#f2f48f]">
                        {cus.status.toUpperCase()}
                      </Badge>
                      <span className="text-white/60 text-[11px] font-bold tracking-wider">
                        ID: {cus.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Profile Button - Orange style */}
                <CustomerPurchaseModal
                  customer={cus}
                  trigger={
                    <Button className="w-full bg-[#fca211] hover:bg-[#e89410] text-white font-black h-14 rounded-2xl text-lg shadow-lg active:scale-[0.98] transition-all">
                      {t("view_profile", "View Profile")}
                    </Button>
                  }
                />

                {/* Location & Contact */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/90 text-[15px] font-bold italic">
                    <MapPin size={18} className="shrink-0 text-white/70" />
                    {cus.location}
                  </div>
                  <div className="flex items-center gap-3 text-white/90 text-[15px] font-bold italic">
                    <Phone size={18} className="shrink-0 text-white/70" />
                    {cus.phone}
                  </div>
                </div>

                {/* Recent Purchases Activity Table */}
                <div className="rounded-3xl overflow-hidden border border-white/10">
                  <div className="bg-[#5164b4] py-3 px-6 text-white text-[12px] font-black uppercase tracking-widest">
                    {t("recent_product_purchases", "Recent Product Purchases")}
                  </div>
                  <div className="bg-white p-0">
                    <table className="w-full text-[10px] md:text-[11px] font-bold border-collapse">
                      <thead className="bg-[#f8faff] text-[#5164b4] border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-4 text-left">ID Unit</th>
                          <th className="py-3 px-4 text-left">Product Name</th>
                          <th className="py-3 px-4 text-left text-center">Qty</th>
                          <th className="py-3 px-4 text-left text-center">Date</th>
                          <th className="py-3 px-4 text-left text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-600 font-bold">
                        {cus.activities.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                              {t("no_recent_activity", "No Recent Activity")}
                            </td>
                          </tr>
                        ) : (
                          cus.activities
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 2)
                            .map((act: Enquiry | Appointment, idx: number) => {
                              const isEnq = "enquiryLineItems" in act;
                              const items = isEnq ? act.enquiryLineItems : act.appointmentLineItems;
                              const item = items?.[0] as any;
                              return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-4 text-[#5164b4]">U-#{idx + 1}</td>
                                  <td className="py-3 px-4 text-slate-800">
                                    {item?.item?.name || "Service Item"}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    {isEnq ? (item?.quantity || 1) : 1}
                                  </td>
                                  <td className="py-3 px-4 text-center text-slate-400">
                                    {format(new Date(act.createdAt), "M/d/yyyy")}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="text-[#008767] font-black uppercase text-[9px] tracking-widest">REGULAR</span>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Loyalty Score Banner */}
      <div className="mt-8 bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-10 flex-col md:flex-row text-center md:text-left">
          <div className="relative">
            <Star size={80} className="text-secondary" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center pt-1 animate-pulse">
              <div className="h-4 w-4 bg-white rounded-full blur-md" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {t("loyalty_score")} : <span className="text-secondary">A+</span>
          </h2>
        </div>
        <Link href="/seller-dashboard/analytics" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-black px-12 h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg transition-all active:scale-95">
            {t("view_analytics")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
