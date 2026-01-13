"use client";

import { useQuotationStore, QuotationState } from "@/store/quotationStore";
import { CreateQuotationRequest, Enquiry } from "@/types/activity";
import { ItemListingAutocomplete } from "./item-listing-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import {
  Package,
  MapPin,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface QuotationFormProps {
  enquiry: Enquiry;
  isUpdate?: boolean;
  killSwitchUpdateDisabled?: boolean;
  onSubmit: (data: CreateQuotationRequest) => void;
  isLoading?: boolean;
  initialData?: Pick<QuotationState, "lineItems" | "details"> | null;
}

export function QuotationForm({
  enquiry,
  isUpdate = false,
  killSwitchUpdateDisabled = false,
  onSubmit,
  isLoading,
  initialData,
}: QuotationFormProps) {
  const {
    lineItems,
    details,
    updateLineItem,
    setLineItems,
    setDetails,
    setEnquiryId,
    reset,
  } = useQuotationStore();

  const { data: entities } = useEntitiesQuery();
  const sellerEntityId = entities?.[0]?.id;

  const { data: listings } = useItemListingsQuery({ entityId: sellerEntityId });

  useEffect(() => {
    setEnquiryId(enquiry.id);

    if (initialData) {
      // Logic for editing
      setLineItems(initialData.lineItems);
      setDetails(initialData.details);
    } else if (listings && lineItems.length === 0) {
      // Initial state from enquiry
      const initialLineItems = enquiry.enquiryLineItems.map((eli) => {
        // Try to pre-select exact item listing
        const exactListing = listings.find((l) => l.itemId === eli.itemId);

        return {
          itemId: eli.itemId,
          itemListingId: exactListing?.id || "",
          rate: 0,
          amount: 0,
          isNegotiable: true,
          remarks: "",
          quantity: eli.quantity,
        };
      });
      setLineItems(initialLineItems);
    }

    // Cleanup on unmount
    return () => reset();
  }, [
    enquiry,
    initialData,
    listings,
    setEnquiryId,
    setLineItems,
    setDetails,
    reset,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (killSwitchUpdateDisabled && isUpdate) return;

    // Validate that all items have a listing selected
    const missingListing = lineItems.some((item) => !item.itemListingId);
    if (missingListing) {
      alert("Please select a product listing for all items.");
      return;
    }

    onSubmit({
      enquiryId: enquiry.id,
      lineItems: lineItems.map(({ itemListingId, quantity, ...rest }) => ({
        ...rest,
        // The API expects itemId. Since we select itemListingId,
        // we should ensure itemId is correctly set in the line item.
        // In our store, itemId is already there and updated when listing changes.
      })),
      details,
    });
  };

  const totalAmount = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  }, [lineItems]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {isUpdate ? "Update Quotation" : "Create Quotation"}
        </h1>
        <p className="text-muted-foreground">
          Provide your best pricing for the buyer's requirement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Enquiry Information Card */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Enquiry Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Buyer
                </span>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {enquiry.createdBy?.name || "Anonymous"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Location
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium line-clamp-1">
                    {enquiry.enquiryDetails?.[0]?.address || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 px-2">
              Items to Quote
            </h2>
            {enquiry.enquiryLineItems.map((eli, index) => {
              const currentLineItem = lineItems[index];
              return (
                <Card
                  key={eli.id}
                  className="overflow-hidden border-l-4 border-l-primary"
                >
                  <CardHeader className="bg-muted/20 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {eli.item?.name}
                        </CardTitle>
                        <CardDescription>
                          Requested:{" "}
                          <span className="font-bold text-foreground">
                            {eli.quantity} {eli.unitType}
                          </span>
                        </CardDescription>
                      </div>
                      {eli.flexibleWithBrands && (
                        <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">
                          Flexible with Brands
                        </div>
                      )}
                    </div>
                    {eli.remarks && (
                      <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground bg-white/50 p-2 rounded italic">
                        <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />"
                        {eli.remarks}"
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                          Select Your Matching Listing
                        </Label>
                        {sellerEntityId && (
                          <ItemListingAutocomplete
                            entityId={sellerEntityId}
                            categoryId={eli.item?.categoryId}
                            brandId={eli.item?.brandId}
                            specificationId={eli.item?.specificationId}
                            flexibleWithBrands={eli.flexibleWithBrands}
                            value={currentLineItem?.itemListingId}
                            placeholder={`Select ${eli.item?.name}...`}
                            onValueChange={(val) => {
                              const selectedListing = listings?.find(
                                (l) => l.id === val
                              );
                              updateLineItem(index, {
                                itemListingId: val,
                                itemId: selectedListing?.itemId || eli.itemId,
                              });
                            }}
                            disabled={killSwitchUpdateDisabled && isUpdate}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-muted-foreground">
                            Rate (Per {eli.unitType})
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              ₹
                            </span>
                            <Input
                              type="number"
                              className="pl-7"
                              placeholder="0.00"
                              value={currentLineItem?.rate || ""}
                              onChange={(e) =>
                                updateLineItem(index, {
                                  rate: parseFloat(e.target.value) || 0,
                                })
                              }
                              disabled={killSwitchUpdateDisabled && isUpdate}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-muted-foreground">
                            Total Amount
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                              ₹
                            </span>
                            <Input
                              type="number"
                              className="pl-7 bg-muted/50 font-bold"
                              value={currentLineItem?.amount || 0}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">
                        Item Specific Remarks (Optional)
                      </Label>
                      <Input
                        placeholder="e.g. Delivery included, Brand specifics, etc."
                        value={currentLineItem?.remarks || ""}
                        onChange={(e) =>
                          updateLineItem(index, { remarks: e.target.value })
                        }
                        disabled={killSwitchUpdateDisabled && isUpdate}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary & Terms Card */}
          <Card className="sticky top-24">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Quotation Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-bold">
                    {enquiry.enquiryLineItems.length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Grand Total</span>
                  <span className="font-black text-primary">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Expected Delivery
                  </Label>
                  <Input
                    type="date"
                    value={
                      details.expectedDate
                        ? format(new Date(details.expectedDate), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        setDetails({
                          expectedDate: new Date(e.target.value).toISOString(),
                        });
                      }
                    }}
                    disabled={killSwitchUpdateDisabled && isUpdate}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Overall Remarks
                  </Label>
                  <Textarea
                    placeholder="General terms and conditions..."
                    className="min-h-[100px]"
                    value={details.remarks || ""}
                    onChange={(e) => setDetails({ remarks: e.target.value })}
                    disabled={killSwitchUpdateDisabled && isUpdate}
                  />
                </div>
              </div>

              <div className="pt-4">
                {killSwitchUpdateDisabled && isUpdate ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      <strong>Kill Switch Active:</strong> Quotations cannot be
                      updated at this moment. This feature is coming soon.
                    </p>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-bold"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Processing..."
                      : isUpdate
                      ? "Update Quotation"
                      : "Submit Quotation"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
