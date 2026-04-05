"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Enquiry } from "@/types/activity";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { ENQUIRY_STATUS } from "@/constants/enums";
import { format } from "date-fns";
import { Package, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

interface EnquiryCardProps {
  enquiry: Enquiry;
  detailsHref?: string;
}

export function EnquiryCard({ enquiry, detailsHref }: EnquiryCardProps) {
  const { t } = useLanguage();
  const items = enquiry.enquiryLineItems || [];
  const details = enquiry.enquiryDetails?.[0];

  const getStatusColor = (status: ENQUIRY_STATUS) => {
    switch (status) {
      case ENQUIRY_STATUS.APPROVED:
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case ENQUIRY_STATUS.REJECTED:
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      case ENQUIRY_STATUS.PENDING:
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
      case ENQUIRY_STATUS.COMPLETED:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200";
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-primary/10 overflow-hidden group rounded-2xl bg-white">
      <CardHeader className="pb-4 border-b bg-slate-50/30">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-primary/40 tracking-wider">
              {t("enquiry_id")}
            </span>
            <CardTitle className="text-sm font-black text-primary">
              #{enquiry.id.slice(0, 8).toUpperCase()}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(enquiry.status || ENQUIRY_STATUS.PENDING)} font-bold text-[10px] uppercase px-3 py-1 rounded-full border shadow-xs`}
          >
            {enquiry.status || "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase text-primary/60 flex items-center gap-2 tracking-widest">
              <Package className="h-4 w-4" />
              {t("items")} ({items.length})
            </h4>
            <div className="flex items-center gap-1 text-[10px] font-black text-primary/60 uppercase">
              <Calendar className="h-3.5 w-3.5" />
              {enquiry.createdAt
                ? format(new Date(enquiry.createdAt), "dd MMM yyyy")
                : "N/A"}
            </div>
          </div>

          <div className="space-y-3">
            {items.map((lineItem, idx) => (
              <div
                key={lineItem.id || idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-primary">
                    {lineItem.item?.name || "Unspecified Item"}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-secondary">
                        {lineItem.quantity}
                      </span>
                      <span className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">
                        {lineItem.unitType
                          ? UNIT_TYPE_LABELS[lineItem.unitType as UnitType]
                          : "-"}
                      </span>
                    </div>
                    {lineItem.flexibleWithBrands && (
                      <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100 uppercase tracking-tighter">
                        {t("flexible_brands")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {details?.address && (
          <div className="pt-5 border-t border-slate-100 space-y-2">
            <h4 className="text-[10px] font-black uppercase text-primary/60 flex items-center gap-1.5 tracking-widest">
              <MapPin className="h-4 w-4" />
              {t("delivery_location")}
            </h4>
            <p className="text-xs font-bold text-primary/80 line-clamp-2 leading-relaxed">
              {details.address}
            </p>
          </div>
        )}
      </CardContent>

      <div className="px-6 pb-6 mt-auto">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full bg-white border-primary/20 text-primary font-black text-xs h-12 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-widest group"
        >
          <Link href={detailsHref || `/buyer-dashboard/enquiries/${enquiry.id}`}>
            {t("view_details")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
