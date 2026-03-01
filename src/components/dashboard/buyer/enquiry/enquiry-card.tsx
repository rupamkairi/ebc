"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Enquiry } from "@/types/activity";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { VERIFICATION_STATUS } from "@/constants/enums";
import { format } from "date-fns";
import { Package, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EnquiryCardProps {
  enquiry: Enquiry;
}

export function EnquiryCard({ enquiry }: EnquiryCardProps) {
  const items = enquiry.enquiryLineItems || [];
  const details = enquiry.enquiryDetails?.[0];

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case VERIFICATION_STATUS.APPROVED:
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case VERIFICATION_STATUS.REJECTED:
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      case VERIFICATION_STATUS.PENDING:
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-[#3D52A0]/10 overflow-hidden group">
      <CardHeader className="pb-4 border-b bg-slate-50/50">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3D52A0]/40">
              Enquiry ID
            </span>
            <CardTitle className="text-sm font-black text-[#3D52A0] font-mono">
              #{enquiry.id.slice(0, 8).toUpperCase()}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(enquiry.status || "PENDING")} font-black text-[10px] uppercase tracking-tighter px-3 py-1 rounded-full border shadow-sm`}
          >
            {enquiry.status || "PENDING"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3D52A0]/40 flex items-center gap-2">
              <Package className="h-3 w-3" />
              Items ({items.length})
            </h4>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D52A0]/60">
              <Calendar className="h-3 w-3" />
              {enquiry.createdAt
                ? format(new Date(enquiry.createdAt), "dd MMM yyyy")
                : "N/A"}
            </div>
          </div>

          <div className="space-y-3">
            {items.map((lineItem, idx) => (
              <div
                key={lineItem.id || idx}
                className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 group-hover:border-[#3D52A0]/10 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                  <Package className="h-5 w-5 text-[#3D52A0]/40" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#3D52A0] truncate">
                    {lineItem.item?.name || "Unspecified Item"}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#FFA500]">
                        {lineItem.quantity}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-[#3D52A0]/40">
                        {lineItem.unitType
                          ? UNIT_TYPE_LABELS[lineItem.unitType as UnitType]
                          : "-"}
                      </span>
                    </div>
                    {lineItem.flexibleWithBrands && (
                      <>
                        <span className="text-[#3D52A0]/20 text-[10px]">•</span>
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          Flexible Brands
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {details?.address && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3D52A0]/40 mb-2 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              Delivery Location
            </h4>
            <p className="text-xs font-medium text-[#3D52A0]/70 line-clamp-2 leading-relaxed">
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
          className="w-full bg-white border-[#3D52A0]/10 text-[#3D52A0] font-black uppercase text-[10px] tracking-widest h-11 rounded-xl hover:bg-[#3D52A0] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Link href={`/buyer-dashboard/enquiries/${enquiry.id}`}>
            View Full Details
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
