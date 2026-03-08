"use client";

import React from "react";
import { useEnquiryStore } from "@/store/enquiryStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, User, Info } from "lucide-react";
import { UNIT_TYPE_LABELS } from "@/constants/quantities";
import { EnquiryItem } from "@/store/enquiryStore";

interface EnquiryReviewProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function EnquiryReview({ onSubmit, isSubmitting }: EnquiryReviewProps) {
  const { items, buyerDetails } = useEnquiryStore();

  if (!buyerDetails) return <div>No details found.</div>;

  const groupedItems = items.reduce(
    (acc, item) => {
      // If it's a subcategory, use that, else use category, else 'uncategorized'
      const key = item.subCategoryId || item.categoryId || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, EnquiryItem[]>,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
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
              <h3 className="font-semibold text-sm text-muted-foreground">
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
            <h3 className="font-semibold text-sm text-muted-foreground">
              Items ({items.length})
            </h3>

            {Object.keys(groupedItems).length > 1 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-3">
                  <div className="bg-amber-100 p-2 rounded-full h-fit">
                    <Info className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-amber-800 font-semibold mb-1">
                      Split Enquiry Notice
                    </h4>
                    <p className="text-amber-700 text-sm">
                      Your enquiry contains items from different subcategories.
                      It will be
                      <strong className="font-bold">
                        {" "}
                        split into {Object.keys(groupedItems).length} separate
                        enquiries{" "}
                      </strong>
                      based on the groupings below to ensure fastest processing
                      by appropriate sellers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border rounded-xl divide-y overflow-hidden shadow-sm">
              {Object.entries(groupedItems).map(
                ([categoryId, groupItems], groupIdx) => {
                  const firstItem = groupItems[0];
                  const groupLabel =
                    firstItem.subCategoryName ||
                    firstItem.categoryName ||
                    "General Items";

                  return (
                    <div
                      key={categoryId || `group-${groupIdx}`}
                      className="flex flex-col"
                    >
                      {Object.keys(groupedItems).length > 1 && (
                        <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 flex justify-between items-center border-b">
                          <span>{groupLabel}</span>
                          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                            {groupItems.length} items
                          </span>
                        </div>
                      )}
                      {groupItems.map((item) => (
                        <div
                          key={item.itemId}
                          className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-sm bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-slate-900">
                                {item.title}
                              </p>
                              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">
                                {item.type}
                              </span>
                            </div>
                            {item.remarks && (
                              <p className="text-xs text-slate-500 italic flex items-start gap-1">
                                <span className="font-medium text-slate-400 not-italic">
                                  Note:
                                </span>{" "}
                                {item.remarks}
                              </p>
                            )}
                          </div>
                          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none flex justify-between sm:block">
                            <span className="sm:hidden text-xs font-medium text-slate-500">
                              Quantity:
                            </span>
                            <div>
                              <p className="font-bold text-slate-900 text-base">
                                {item.quantity}{" "}
                                <span className="text-sm font-medium text-slate-500">
                                  {item.unitType
                                    ? UNIT_TYPE_LABELS[item.unitType]
                                    : ""}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          onClick={onSubmit}
          className="w-full md:w-auto bg-linear-to-r from-primary to-primary/80 hover:from-secondary hover:to-secondary text-white font-bold tracking-tight py-7 px-10 rounded-2xl text-lg shadow-[0_20px_50px_rgba(15,40,169,0.3)] transition-all duration-500 hover:scale-105 active:scale-95 border-none flex items-center gap-2 group"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing Enquiries..."
            : "Confirm & Submit Enquiry"}
        </Button>
      </div>
    </div>
  );
}
