"use client";

import { 
  User,
  Phone,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useEntitiesQuery } from "@/queries/entityQueries";
import { useAssignmentsQuery, useQuotationsQuery } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Enquiry, Appointment } from "@/types/activity";
import { useLanguage } from "@/hooks/useLanguage";

export default function CustomersPage() {
  const { t } = useLanguage();
  const { data: session } = useSessionQuery();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const searchQuery = ""; // Placeholder for now

  const { data: assignments = [], isLoading: isAssignmentsLoading } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
  });

  const { data: quotations = [], isLoading: isQuotationsLoading } = useQuotationsQuery({
    createdById: session?.user?.id,
  });

  const processedCustomers = useMemo(() => {
    if (!assignments.length) return [];

    const customerMap = new Map();

    assignments.forEach((assignment) => {
      const activity = assignment.enquiry || assignment.appointment;
      const buyer = activity?.createdBy;
      
      if (!buyer) return;

      if (!customerMap.has(buyer.id)) {
        customerMap.set(buyer.id, {
          id: buyer.id,
          name: buyer.name,
          phone: buyer.phone || "N/A",
          location: activity?.enquiryDetails?.[0]?.address || activity?.appointmentDetails?.[0]?.address || "Location N/A",
          lastEnquiry: "",
          lastActivityDate: activity?.createdAt,
          orders: 0,
          totalValue: 0,
          activities: [],
        });
      }

      const cus = customerMap.get(buyer.id);
      cus.activities.push(activity);
      
      // Update last activity if newer
      if (new Date(activity.createdAt) > new Date(cus.lastActivityDate)) {
        cus.lastActivityDate = activity.createdAt;
        const lineItems = activity.enquiryLineItems || activity.appointmentLineItems || [];
        if (lineItems.length > 0) {
          const firstItem = lineItems[0].item?.name || "Item";
          cus.lastEnquiry = `${firstItem}${lineItems.length > 1 ? ` (+${lineItems.length - 1} more)` : ""}`;
        }
      }
    });

    // Link quotations to calculate value and order count
    quotations.forEach((q) => {
      const buyerId = q.enquiry?.createdById;
      if (buyerId && customerMap.has(buyerId)) {
        const cus = customerMap.get(buyerId);
        if (q.status === "ACCEPTED") {
          cus.orders += 1;
          const totalAmount = q.quotationLineItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
          cus.totalValue += totalAmount;
        }
      }
    });

    return Array.from(customerMap.values()).map(cus => ({
      ...cus,
      status: cus.orders === 0 ? "Lead" : cus.orders > 2 ? "Repeat Buyer" : "Active Buyer"
    }));
  }, [assignments, quotations]);

  const filteredCustomers = useMemo(() => {
    return processedCustomers.filter(cus => 
      cus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cus.phone.includes(searchQuery) ||
      cus.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [processedCustomers, searchQuery]);

  if (isAssignmentsLoading || isQuotationsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A237E] tracking-tight">
          {t("my_customers")}
        </h1>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed text-slate-400 font-bold">
            {t("no_active_customers")}
          </div>
        ) : (
          filteredCustomers.map((cus) => (
            <Card key={cus.id} className="bg-[#001D8D] border-none shadow-xl rounded-[24px] overflow-hidden">
              <CardContent className="p-6 space-y-5">
                {/* Header Section */}
                <div className="flex items-start gap-5">
                  <div className="h-20 w-20 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <User size={40} className="text-[#001D8D]" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      {cus.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`uppercase text-[10px] font-bold rounded px-3 py-0.5 ${
                        cus.status === 'Lead' ? 'bg-[#FFEB3B] text-black' :
                        'bg-[#FFA000] text-white'
                      }`}>
                        {cus.status}
                      </Badge>
                      <Badge className="bg-[#3D52A0]/50 text-white/80 uppercase text-[10px] font-bold rounded px-3 py-0.5 border-none">
                        ID: {cus.id.substring(0, 8)}
                      </Badge>
                    </div>
                    <Button className="w-full mt-2 bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold h-10 rounded-lg text-sm transition-all shadow-md">
                      {t("view_profile")}
                    </Button>
                  </div>
                </div>

                {/* Location & Contact */}
                <div className="bg-[#3D52A0]/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-3 text-white/90 text-[13px] font-medium italic">
                    <MapPin size={16} className="shrink-0" />
                    {cus.location}
                  </div>
                  <div className="flex items-center gap-3 text-white/90 text-[13px] font-medium italic">
                    <Phone size={16} className="shrink-0" />
                    {cus.phone}
                  </div>
                </div>

                {/* Stats & Purchase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Total Orders Box */}
                  <div className="md:col-span-4 rounded-xl overflow-hidden border border-white/10">
                    <div className="bg-[#3D52A0] py-1.5 px-3 text-white text-[11px] font-bold">
                      {t("total_orders")}
                    </div>
                    <div className="bg-white p-3 flex flex-col items-center justify-center gap-2">
                      <div className="flex justify-between w-full text-[9px] font-black uppercase text-[#1A237E]/40">
                        <span>{t("orders_delivered")}</span>
                        <span>{t("total_order_value")}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-xl font-black text-[#FFA000]">{cus.orders}</span>
                        <span className="text-xl font-black text-[#FFA000]">₹{cus.totalValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Product Purchases Box */}
                  <div className="md:col-span-8 rounded-xl overflow-hidden border border-white/10">
                    <div className="bg-[#3D52A0] py-1.5 px-4 text-white text-[11px] font-bold">
                      {t("recent_product_purchases")}
                    </div>
                    <div className="bg-white p-0">
                      <table className="w-full text-[9px] font-medium">
                        <thead className="bg-[#F0F4FF] text-[#1A237E]/50 border-b border-slate-100">
                          <tr>
                            <th className="py-1.5 px-3 text-left">ID Unit</th>
                            <th className="py-1.5 px-3 text-left">Product Name</th>
                            <th className="py-1.5 px-3 text-left">Qty</th>
                            <th className="py-1.5 px-3 text-left">Date</th>
                            <th className="py-1.5 px-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cus.activities.slice(0, 2).map((act: (Enquiry | Appointment), idx: number) => {
                            const items = (act as Enquiry).enquiryLineItems || (act as Appointment).appointmentLineItems || [];
                            const item = items[0];
                            return (
                              <tr key={idx} className="text-[#1A237E]/80">
                                <td className="py-2 px-3">U-#{idx + 1}</td>
                                <td className="py-2 px-3 font-bold truncate max-w-[80px]">{item?.item?.name || "Service"}</td>
                                <td className="py-2 px-3">{item?.quantity || "1"}</td>
                                <td className="py-2 px-3">{new Date(act.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-3 text-emerald-600 font-bold uppercase text-[8px]">Regular</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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
            <Star size={80} className="text-[#FFA000]" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center pt-1 animate-pulse">
              <div className="h-4 w-4 bg-white rounded-full blur-md" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E]">
            {t("loyalty_score")} : <span className="text-[#FFA000]">A+</span>
          </h2>
        </div>
        <Button className="w-full md:w-auto bg-[#3D52A0] hover:bg-[#1A237E] text-white font-black px-12 h-16 rounded-2xl shadow-xl shadow-[#3D52A0]/20 text-lg transition-all active:scale-95">
          {t("view_analytics")}
        </Button>
      </div>
    </div>
  );
}
