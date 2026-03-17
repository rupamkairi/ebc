"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ClipboardList, 
  Calendar, 
  User, 
  History, 
  Package, 
  MapPin, 
  MessageSquare,
  Activity,
  ArrowRight,
  Clock
} from "lucide-react";
import { Enquiry, Appointment, EnquiryLineItem } from "@/types/activity";
import { useLanguage } from "@/hooks/useLanguage";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CustomerPurchaseModalProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    location: string;
    status: string;
    activities: (Enquiry | Appointment)[];
  };
  trigger: React.ReactNode;
}

export function CustomerPurchaseModal({ customer, trigger }: CustomerPurchaseModalProps) {
  const { t } = useLanguage();

  const sortedActivities = [...customer.activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const lastActivityDate = sortedActivities.length > 0
    ? new Date(sortedActivities[0].createdAt)
    : null;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none bg-slate-50 shadow-2xl rounded-[24px]">
        {/* Header */}
        <DialogHeader className="relative p-6 md:p-8 bg-primary overflow-hidden shrink-0">
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shrink-0">
              <User size={32} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-black text-white truncate">
                {customer.name}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-secondary text-white border-none uppercase text-[9px] font-black px-3 py-0.5 rounded">
                  {customer.status}
                </Badge>
                <span className="text-white/60 text-[10px] font-bold">ID: {customer.id.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-primary" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("engagements", "Engagements")}</p>
              </div>
              <p className="text-xl font-black text-primary">{customer.activities.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-secondary" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("last_active", "Last Active")}</p>
              </div>
              <p className="text-sm font-black text-slate-700">
                {lastActivityDate ? format(lastActivityDate, "MMM d, yyyy") : "N/A"}
              </p>
            </div>
          </div>

          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <History size={14} />
            {t("elaborate_engagement_history", "Elaborate Interaction History")}
          </h3>

          {/* Activity Feed */}
          <ScrollArea className="flex-1 -mr-2 pr-2">
            <div className="space-y-6 pb-4">
              {sortedActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100 italic text-slate-400 text-sm">
                  {t("no_interactions_recorded", "No service interactions recorded yet.")}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedActivities.map((act) => {
                    const isEnquiry = "enquiryLineItems" in act;
                    const items = isEnquiry ? act.enquiryLineItems : act.appointmentLineItems;
                    const details = isEnquiry ? act.enquiryDetails?.[0] : act.appointmentDetails?.[0];

                    return (
                      <div key={act.id} className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        {/* Entry Sub-header */}
                        <div className="bg-slate-50/50 px-5 py-3 flex items-center justify-between border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-7 w-7 rounded-lg flex items-center justify-center text-white",
                              isEnquiry ? "bg-primary" : "bg-emerald-500"
                            )}>
                              {isEnquiry ? <ClipboardList size={14} /> : <Calendar size={14} />}
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none mb-0.5">
                                 {isEnquiry ? t("enquiry", "Enquiry") : t("appointment", "Appointment")}
                               </p>
                               <p className="text-[11px] font-black text-primary leading-none">#{act.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-slate-500">{format(new Date(act.createdAt), "MMM d, yyyy")}</p>
                        </div>

                        {/* Items Breakdown */}
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            {items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[13px] bg-slate-50/50 p-2.5 rounded-xl border border-slate-50">
                                <div className="flex items-center gap-3">
                                  <Package size={16} className="text-slate-400" />
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 leading-tight">{item.item?.name || "Service Item"}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.item?.brand?.name || "Generic"}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-primary">
                                    {isEnquiry ? (item as EnquiryLineItem).quantity : 1}
                                  </span>
                                  <span className="text-[10px] text-slate-400 ml-1 font-bold">
                                    {isEnquiry ? (item as EnquiryLineItem).unitType : "Units"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Remarks & Address */}
                          {(details?.remarks || details?.address) && (
                            <div className="space-y-3 pt-1">
                              {details?.remarks && (
                                <div className="flex gap-3 items-start">
                                  <MessageSquare size={14} className="text-slate-300 mt-1 shrink-0" />
                                  <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{t("buyer_remarks", "Buyer Remarks")}</p>
                                    <p className="text-xs text-slate-600 italic leading-relaxed">&quot;{details.remarks}&quot;</p>
                                  </div>
                                </div>
                              )}
                              {details?.address && (
                                <div className="flex gap-3 items-start">
                                  <MapPin size={14} className="text-slate-300 mt-0.5 shrink-0" />
                                  <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{t("location", "Address")}</p>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed">{details.address}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Link */}
                        <div className="px-5 py-2 bg-slate-50/30 flex justify-end border-t border-slate-50">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] font-black uppercase text-primary hover:bg-primary/5 transition-all"
                            asChild
                          >
                            <a href={`/seller-dashboard/${isEnquiry ? 'enquiries' : 'appointments'}/${act.id}`}>
                              {t("full_details", "View Document")}
                              <ArrowRight size={12} className="ml-1.5" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
