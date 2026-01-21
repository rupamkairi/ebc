"use client";

import React from "react";
import { useEnquiryStore } from "@/store/enquiryStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Phone, Mail, User } from "lucide-react";
import { UNIT_TYPE_LABELS } from "@/constants/quantities";

interface EnquiryReviewProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function EnquiryReview({ onSubmit, isSubmitting }: EnquiryReviewProps) {
  const { items, buyerDetails } = useEnquiryStore();

  if (!buyerDetails) return <div>No details found.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Buyer Information
              </h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{buyerDetails.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{buyerDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{buyerDetails.phoneNumber}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Delivery Details
              </h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p>{buyerDetails.address}</p>
                  <p className="font-medium">Pin: {buyerDetails.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Items ({items.length})
            </h3>
            <div className="border rounded-md divide-y">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  className="p-3 flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.remarks && (
                      <p className="text-xs text-muted-foreground">
                        {item.remarks}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {item.quantity}{" "}
                      {item.unitType ? UNIT_TYPE_LABELS[item.unitType] : ""}
                    </p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {item.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          onClick={onSubmit}
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Request..." : "Submit Enquiry"}
        </Button>
      </div>
    </div>
  );
}
