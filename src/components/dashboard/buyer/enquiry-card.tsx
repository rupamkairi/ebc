"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Enquiry } from "@/types/activity";
import { format } from "date-fns";
import { Package, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EnquiryCardProps {
  enquiry: Enquiry;
}

export function EnquiryCard({ enquiry }: EnquiryCardProps) {
  const firstItem = enquiry.enquiryLineItems?.[0];
  const itemCount = enquiry.enquiryLineItems?.length || 0;
  const details = enquiry.enquiryDetails?.[0];

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "REJECTED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b bg-muted/5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="truncate max-w-[200px] sm:max-w-md">
                {firstItem?.item?.name || "Enquiry Items"}
              </span>
              {itemCount > 1 && (
                <Badge variant="secondary" className="font-normal">
                  +{itemCount - 1} more
                </Badge>
              )}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">ID: {enquiry.id.slice(0, 8)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {enquiry.createdAt
                  ? format(new Date(enquiry.createdAt), "PPP")
                  : "N/A"}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(enquiry.status || "PENDING")}>
            {enquiry.status || "PENDING"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Requested Quantity
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {firstItem?.quantity} {firstItem?.unitType}
            </p>
            {details?.address && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{details.address}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary hover:text-primary hover:bg-primary/5"
            >
              <Link
                href={`/buyer-dashboard/enquiries/${enquiry.id}`}
                className="flex items-center gap-1"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
