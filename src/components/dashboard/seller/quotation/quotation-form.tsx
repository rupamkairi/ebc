"use client";

import { useQuotationStore, QuotationState } from "@/store/quotationStore";
import {
  CreateQuotationRequest,
  Enquiry,
  Quotation,
} from "@/types/activity";
import { QUOTATION_STATUS, REF_TYPE } from "@/constants/enums";
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
import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useItemListingsQuery } from "@/queries/catalogQueries";
import {
  Package,
  MapPin,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  Phone,
  Mail,
  Lock,
  Coins,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { UNIT_TYPE_LABELS } from "@/constants/quantities";
import { useAcceptQuotationMutation } from "@/queries/activityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import { RechargeModal } from "../../seller/recharge-modal";
import { toast } from "sonner";
import { useLeadPricing } from "@/queries/pricingQueries";

interface QuotationFormProps {
  enquiry: Enquiry;
  quotation?: Quotation;
  isUpdate?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  killSwitchUpdateDisabled?: boolean;
  onSubmit: (data: CreateQuotationRequest) => void;
  initialData?: Pick<QuotationState, "lineItems" | "details"> | null;
}

export function QuotationForm({
  enquiry,
  quotation,
  isUpdate = false,
  killSwitchUpdateDisabled = false,
  onSubmit,
  isLoading,
  disabled = false,
  initialData,
}: QuotationFormProps) {
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
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

  const { data: wallet } = useWalletDetails(sellerEntityId);
  const { data: leadPricing } = useLeadPricing(REF_TYPE.QUOTATION);
  const { mutate: acceptQuotation, isPending: isAccepting } =
    useAcceptQuotationMutation();

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
        // Pull default rate and negotiable status if listing exists
        const defaultRate = exactListing?.itemRates?.[0]?.rate || 0;
        const defaultNegotiable = exactListing?.itemRates?.[0]?.isNegotiable ?? false;

        return {
          itemId: eli.itemId,
          itemListingId: exactListing?.id || "",
          rate: defaultRate,
          amount: defaultRate * eli.quantity,
          isNegotiable: defaultNegotiable,
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
    if ((killSwitchUpdateDisabled && isUpdate) || disabled) return;

    // Validate that all items have a listing selected
    const missingListing = lineItems.some((item) => !item.itemListingId);
    if (missingListing) {
      alert("Please select a product listing for all items.");
      return;
    }

    onSubmit({
      enquiryId: enquiry.id,
      lineItems: lineItems.map(({ quantity: _q, ...rest }) => ({
        ...rest,
        // Send itemListingId to link the selected listing with the quotation item
      })),
      details,
    });
  };

  const totalAmount = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  }, [lineItems]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          {isUpdate ? "Update Quotation" : "Create Quotation"}
        </h1>
        <p className="text-primary/60 font-medium text-sm">
          Provide your best pricing for the buyer&apos;s requirement.
        </p>
      </div>

      {isUpdate && quotation && !quotation.isActive && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-4xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                <Lock size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                  Lead Locked
                </h4>
                <p className="text-sm font-bold opacity-70 italic max-w-md leading-relaxed">
                  Accept this lead to reveal the buyer&apos;s contact details.
                  This will deduct{" "}
                  <span className="text-amber-600 font-extrabold">
                    {leadPricing?.cost || 50} coins
                  </span>{" "}
                  from your wallet.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">
                  Your Balance
                </p>
                <p className="text-2xl font-black text-amber-600 italic flex items-center justify-end gap-1.5">
                  <Coins size={20} />
                  {wallet?.balance || 0}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  if ((wallet?.balance || 0) < (leadPricing?.cost || 50)) {
                    setIsRechargeModalOpen(true);
                    return;
                  }
                  acceptQuotation(quotation.id, {
                    onSuccess: () =>
                      toast.success("Lead accepted! Contact details revealed."),
                    onError: (err: Error) =>
                      toast.error(err.message || "Failed to accept lead."),
                  });
                }}
                disabled={isAccepting}
                className="rounded-3xl h-16 px-10 bg-amber-600 hover:bg-amber-700 text-white font-black italic shadow-xl shadow-amber-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isAccepting ? (
                  <Loader2 className="animate-spin mr-3" size={24} />
                ) : (
                  <Coins size={22} className="mr-3" />
                )}
                Accept Lead
                <ArrowRight size={22} className="ml-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Enquiry Information Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-black text-primary flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package className="h-5 w-5 text-primary" />
              Enquiry Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Buyer */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Buyer</span>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary text-sm">
                    {enquiry.createdBy?.name || "Anonymous"}
                  </span>
                </div>
              </div>
              {/* Contact Details */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Contact Details</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className={`font-medium text-sm text-primary ${quotation && !quotation.isActive ? "blur-md select-none" : ""}`}>
                      {quotation?.isActive ? enquiry.createdBy?.phone : "+91 ••••• •••••"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className={`font-medium text-sm text-primary ${quotation && !quotation.isActive ? "blur-md select-none" : ""}`}>
                      {quotation?.isActive ? enquiry.createdBy?.email || "No email" : "••••••••@••••.com"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Location */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Location</span>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm text-primary line-clamp-1">
                    {enquiry.enquiryDetails?.[0]?.address || "N/A"}
                  </span>
                </div>
              </div>
              {/* Expected Delivery Date */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Expected Delivery</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-primary">
                    {enquiry.enquiryDetails?.[0]?.expectedDate 
                      ? format(new Date(enquiry.enquiryDetails[0].expectedDate), "dd MMM yyyy") 
                      : "Not Specified"}
                  </span>
                </div>
              </div>
              {/* Remarks */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Remarks</span>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm text-primary line-clamp-1">
                    {enquiry.enquiryDetails?.[0]?.remarks || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-primary px-1">
              Items to quote
            </h2>
            {enquiry.enquiryLineItems.map((eli, index) => {
              const currentLineItem = lineItems[index];
              return (
                <div
                  key={eli.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Item header */}
                  <div className="px-5 py-4 border-b border-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-black text-secondary text-base">{eli.item?.name}</p>
                        <p className="text-sm text-gray-400 font-medium mt-0.5">
                          Requested {eli.quantity} {UNIT_TYPE_LABELS[eli.unitType]}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {enquiry.enquiryDetails?.[0]?.expectedDate && (
                          <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black tracking-wide whitespace-nowrap">
                            Deliver Within 7 days
                          </span>
                        )}
                        {eli.flexibleWithBrands && (
                          <span className="px-3 py-1 rounded-full bg-secondary text-white text-[10px] font-black tracking-wide whitespace-nowrap">
                            Flexible with brands
                          </span>
                        )}
                      </div>
                    </div>
                    {eli.remarks && (
                      <div className="mt-3 flex items-start gap-2 text-xs text-gray-400 italic">
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        &quot;{eli.remarks}&quot;
                      </div>
                    )}
                  </div>

                  {/* Item form fields */}
                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                          Select Your Matching Listing
                        </Label>
                        {sellerEntityId ? (
                          <ItemListingAutocomplete
                            entityId={sellerEntityId}
                            categoryId={eli.item?.categoryId}
                            brandId={eli.item?.brandId}
                            specificationId={eli.item?.specificationId}
                            flexibleWithBrands={eli.flexibleWithBrands}
                            value={currentLineItem?.itemListingId}
                            placeholder={`Select ${eli.item?.name}...`}
                            onValueChange={(val) => {
                              const selectedListing = listings?.find((l) => l.id === val);
                              const listingRate = selectedListing?.itemRates?.[0]?.rate || 0;
                              const listingNegotiable = selectedListing?.itemRates?.[0]?.isNegotiable ?? false;
                              
                              updateLineItem(index, {
                                itemListingId: val,
                                itemId: selectedListing?.itemId || eli.itemId,
                                rate: listingRate,
                                amount: listingRate * eli.quantity,
                                isNegotiable: listingNegotiable,
                              });
                            }}
                            disabled={(killSwitchUpdateDisabled && isUpdate) || disabled}
                          />
                        ) : (
                          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-bold">
                              <AlertCircle className="h-5 w-5" />
                              <span>Business Identity Missing</span>
                            </div>
                            <p className="text-xs">
                              We couldn&apos;t find a business entity associated with your account ({entities?.length || 0} found).
                              You must have an approved business profile to respond to enquiries.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                            Rate (Per {UNIT_TYPE_LABELS[eli.unitType]})
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm font-bold">₹</span>
                            <Input
                              type="number"
                              className="pl-7 border-primary/15 focus:border-primary focus:ring-primary/10 rounded-xl"
                              placeholder=""
                              value={currentLineItem?.rate || ""}
                              onChange={(e) => updateLineItem(index, { rate: parseFloat(e.target.value) || 0 })}
                              disabled={(killSwitchUpdateDisabled && isUpdate) || disabled}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                            Total Amount
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm font-bold">₹</span>
                            <Input
                              type="number"
                              className="pl-7 bg-gray-50 font-bold rounded-xl"
                              value={currentLineItem?.amount || 0}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                      <div className="space-y-1.5 flex-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                          Item Specific Remarks (Optional)
                        </Label>
                        <Input
                          placeholder="e.g. Write Delivery Included, Brand Specifics, etc."
                          className="border-primary/15 focus:border-primary rounded-xl"
                          value={currentLineItem?.remarks || ""}
                          onChange={(e) => updateLineItem(index, { remarks: e.target.value })}
                          disabled={(killSwitchUpdateDisabled && isUpdate) || disabled}
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-2 md:pt-5">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                          Negotiable?
                        </Label>
                        <Switch 
                          checked={currentLineItem?.isNegotiable || false}
                          onCheckedChange={(val) => updateLineItem(index, { isNegotiable: val })}
                          disabled={(killSwitchUpdateDisabled && isUpdate) || disabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary sidebar — dark blue gradient */}
        <div className="space-y-4">
          <div
            className="sticky top-24 rounded-2xl overflow-hidden bg-linear-to-br from-primary to-primary/80"
          >
            <div className="px-6 py-5 border-b border-white/10">
              <h3 className="text-white font-black text-lg">Quotation Summary</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Item rows */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-white/40">
                  <span>Total Items</span>
                  <span>Quantity</span>
                </div>
                {enquiry.enquiryLineItems.map((eli, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white/80 font-medium">{eli.item?.name}</span>
                    <span className="text-white font-black">{String(eli.quantity).padStart(2, "0")}</span>
                  </div>
                ))}
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-white font-black text-base">Grand Total</span>
                  <span className="text-white font-black text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Expected Delivery */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Expected Delivery
                </Label>
                <Input
                  type="date"
                  className="bg-white/10 border-white/20 text-white placeholder-white/30 rounded-xl focus:border-secondary focus:ring-secondary/20 scheme-dark"
                  value={details.expectedDate ? format(new Date(details.expectedDate), "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    if (e.target.value) setDetails({ expectedDate: new Date(e.target.value).toISOString() });
                  }}
                  disabled={(killSwitchUpdateDisabled && isUpdate) || disabled}
                />
              </div>

              {/* Overall Remarks */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3" /> Overall Remarks
                </Label>
                <Textarea
                  placeholder="Write Something..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 rounded-xl min-h-[100px] resize-none focus:ring-secondary/20 focus:border-secondary"
                  value={details.remarks || ""}
                  onChange={(e) => setDetails({ remarks: e.target.value })}
                  disabled={(killSwitchUpdateDisabled && isUpdate) || disabled}
                />
              </div>

              {/* Submit / Kill switch */}
              {disabled ? (
                <div className="p-4 bg-white/10 border border-white/20 rounded-xl flex items-start gap-3">
                  <Lock className="h-5 w-5 text-white shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80">
                    <strong className="text-white block mb-1 uppercase tracking-widest text-[10px]">Editing Not Allowed</strong>
                    {quotation?.status === QUOTATION_STATUS.REVISED && "This quotation has already been revised. You cannot edit it again unless the buyer requests another revision."}
                    {quotation?.status === QUOTATION_STATUS.ACCEPTED && "This quotation has been accepted by the buyer and is now locked for processing."}
                    {quotation?.status === QUOTATION_STATUS.REJECTED && "This quotation was rejected by the buyer."}
                    {quotation?.status === QUOTATION_STATUS.CANCELLED && "This quotation or its associated enquiry has been cancelled."}
                    {quotation?.status === QUOTATION_STATUS.EXPIRED && "This quotation has expired and can no longer be updated."}
                    {!!quotation?.quotationDetails?.[0]?.requestedRevision && !quotation?.quotationDetails?.[0]?.hasBeenRevised && "A revision has been requested. Use the 'Review & Respond' flow on the Enquiry page to submit your update."}
                  </p>
                </div>
              ) : killSwitchUpdateDisabled && isUpdate ? (
                <div className="p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-200">
                    <strong>Kill Switch Active:</strong> Quotations cannot be updated at this moment.
                  </p>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-12 bg-secondary hover:bg-secondary/90 active:scale-95 text-white font-black text-base rounded-xl border-0 shadow-lg shadow-orange-300/20 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isUpdate ? "Update Quotation" : "Submit Quotation"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
      />
    </form>
  );
}
