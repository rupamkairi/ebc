"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { MapPin, Calendar, Phone, Mail, User, StickyNote } from "lucide-react";

export interface BuyerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pincode: string;
  expectedDate?: Date | string;
  remarks?: string;
}

export interface EnquiryItem {
  name: string;
  brandName?: string;
  categoryName?: string;
  quantity: number;
  unit: string;
  remarks?: string;
}

interface EnquiryDetailsViewProps {
  buyerDetails: BuyerDetails;
  items: EnquiryItem[];
  showActions?: boolean;
}

export function EnquiryDetailsView({
  buyerDetails,
  items,
}: EnquiryDetailsViewProps) {
  return (
    <div className="space-y-6">
      {/* Buyer Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="size-5" /> Buyer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">{buyerDetails.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span>{buyerDetails.phone}</span>
              </div>
              {buyerDetails.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{buyerDetails.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-semibold block">
                    Delivery Location:
                  </span>
                  <span className="text-muted-foreground">
                    {buyerDetails.address ? `${buyerDetails.address}, ` : ""}
                    {buyerDetails.pincode}
                  </span>
                </div>
              </div>
              {buyerDetails.expectedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>
                    Expected by:{" "}
                    <span className="font-medium">
                      {format(new Date(buyerDetails.expectedDate), "PPP")}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {buyerDetails.remarks && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-start gap-2 text-sm">
                <StickyNote className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-semibold block">Remarks:</span>
                  <p className="text-muted-foreground italic">
                    &quot;{buyerDetails.remarks}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requested Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Brand / Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      {item.remarks && (
                        <p className="text-xs text-muted-foreground italic">
                          &quot;{item.remarks}&quot;
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.brandName && (
                          <span className="font-medium">{item.brandName}</span>
                        )}
                        {item.brandName && item.categoryName && (
                          <span className="mx-1 text-muted-foreground">•</span>
                        )}
                        {item.categoryName && (
                          <span className="text-muted-foreground">
                            {item.categoryName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.quantity} {item.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
