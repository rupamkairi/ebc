"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  PackageCheck,
} from "lucide-react";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { ENQUIRY_STATUS, QUOTATION_STATUS, ENQUIRY_STATUS_LABELS } from "@/constants/enums";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useEnquiryQuery, useQuotationsQuery, useUpdateQuotationMutation } from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BuyerInfoCard } from "@/components/dashboard/seller/activity-shared/buyer-info-card";
import { ActivityActionCard } from "@/components/dashboard/seller/activity-shared/activity-action-card";
import { ActivityTipCard } from "@/components/dashboard/seller/activity-shared/activity-tip-card";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";
import { cn } from "@/lib/utils";

export default function EnquiryDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const { data: enquiry, isLoading: loadingEnquiry } = useEnquiryQuery(id);

  // Fetch seller entity to identify current seller
  const { data: entities, isLoading: loadingEntities } = useEntitiesQuery();
  const sellerEntity = entities?.[0];
  const isApproved = sellerEntity?.verificationStatus === "APPROVED";

  // Fetch quotations related to this enquiry
  const { data: quotations, isLoading: loadingQuotations } = useQuotationsQuery({ enquiryId: id });

  // Check if there's an active quotation from THIS seller for THIS specific enquiry
  const myQuotation = (quotations ?? []).find(
    (q) => q.enquiryId === id && ( // Ensure it belongs to this specific enquiry
           q.createdBy?.staffAtEntityId === sellerEntity?.id || 
           q.createdBy?.createdEntities?.some(e => e.id === sellerEntity?.id)
    )
  );
  
  const { mutate: updateQuotation, isPending: isUpdatingQuotation } = useUpdateQuotationMutation();
  const router = useRouter();
  const { data: session } = useSessionQuery();

  // Redirect if this is the seller's own enquiry (B2B Sourcing)
  // They should be in /seller-dashboard/b2b-enquiries/[id] instead
  React.useEffect(() => {
    if (enquiry && sellerEntity && 
        (enquiry.createdBy?.staffAtEntityId === sellerEntity.id || 
         enquiry.createdById === session?.user?.id)) {
      router.replace(`/seller-dashboard/b2b-enquiries/${enquiry.id}`);
    }
  }, [enquiry, sellerEntity, router, session]);

  const isActiveQuotation = !!myQuotation && myQuotation.status !== QUOTATION_STATUS.REJECTED && myQuotation.isActive;
  const isRevisionRequested = !!myQuotation && !!myQuotation.quotationDetails?.[0]?.requestedRevision && !myQuotation.quotationDetails?.[0]?.hasBeenRevised;
  const isRevised = !!myQuotation && !!myQuotation.quotationDetails?.[0]?.hasBeenRevised;

  if (loadingEnquiry || loadingEntities || loadingQuotations) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">{t("enquiry_not_found")}</p>
        <Button asChild variant="outline">
          <Link href="/seller-dashboard/enquiries">
            {t("back_to_enquiries")}
          </Link>
        </Button>
      </div>
    );
  }

  const details = enquiry.enquiryDetails?.[0];
  
  // Scoped Responded check: Did WE (this entity) respond to THIS specific enquiry?
  // We check both the entity ID link AND the current user ID as a fallback/reinforcement.
  const hasResponded = !!sellerEntity?.id && (quotations ?? []).some(
    (q) => q.enquiryId === id && (
           q.createdBy?.staffAtEntityId === sellerEntity.id || 
           q.createdBy?.createdEntities?.some(e => e.id === sellerEntity.id)
    )
  );

  // Global Enquiry Status
  const isClosed = enquiry.status === ENQUIRY_STATUS.COMPLETED || enquiry.status === ENQUIRY_STATUS.CANCELLED;
  const isAcceptedLocally = !!myQuotation && myQuotation.status === QUOTATION_STATUS.ACCEPTED;
  const hasActionNeeded = (!hasResponded || isRevisionRequested) && !isClosed;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <PageBackButton href="/seller-dashboard/enquiries" />
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            {t("active_enquiries")}
          </h1>
          <p className="text-sm text-primary/60 font-medium">
            {hasResponded
              ? t("already_responded_enquiry")
              : !isClosed
              ? t("manage_respond_enquiries_buyer")
              : t("this_enquiry_is_closed")}
          </p>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Requirements ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-3">
                <h2 className="text-xl font-black text-primary">
                  {t("buyer_requirements")}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full border-2 border-secondary text-secondary text-xs font-black tracking-wide">
                    ID: {enquiry.id.slice(0, 8)}
                  </span>
                  <span
                    className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white",
                      enquiry.status === ENQUIRY_STATUS.PENDING && "bg-amber-500",
                      enquiry.status === ENQUIRY_STATUS.APPROVED && "bg-sky-500 shadow-sm shadow-sky-200",
                      enquiry.status === ENQUIRY_STATUS.COMPLETED && "bg-emerald-600",
                      enquiry.status === ENQUIRY_STATUS.CANCELLED && "bg-gray-500",
                      enquiry.status === ENQUIRY_STATUS.REJECTED && "bg-red-500",
                    )}
                  >
                    {enquiry.status === ENQUIRY_STATUS.APPROVED
                      ? t("active_status_label", "Active")
                      : ENQUIRY_STATUS_LABELS[enquiry.status as ENQUIRY_STATUS] ||
                        enquiry.status}
                  </span>
                  {isAcceptedLocally && (
                    <span className="px-4 py-1 rounded-full text-xs font-black tracking-wide bg-emerald-600 text-white flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3" />
                      {t("offer_accepted", "Offer Accepted")}
                    </span>
                  )}
                  {isRevisionRequested && (
                    <span className="px-4 py-1 rounded-full text-xs font-black tracking-wide bg-orange-500 text-white animate-pulse">
                      {t("revision_requested", "Requested Revision")}
                    </span>
                  )}
                  {isRevised && (
                    <div className="flex flex-col gap-1">
                      <span className="px-4 py-1 rounded-full text-xs font-black tracking-wide bg-violet-600 text-white w-fit">
                        {t("revised", "Revised")}
                      </span>
                      {myQuotation.priceChangeType && (
                        <p className="text-[11px] font-bold text-violet-700 ml-1">
                          {myQuotation.priceChangeType === "DECREASED" ? "Price Reduced by" : "Price Changed by"} ₹{Math.abs(myQuotation.priceDifference || 0).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-xs text-gray-400 font-semibold">
                  {t("submitted_on")}
                </p>
                <p className="text-sm font-black text-primary">
                  {format(new Date(enquiry.createdAt), "MMMM do, yyyy")}
                </p>
              </div>
            </div>

            {isRevisionRequested && myQuotation?.quotationDetails?.[0]?.revisionRemarks && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-black text-orange-800 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  {t("buyer_feedback", "Buyer Feedback")}
                </h4>
                <p className="text-sm text-orange-900 font-medium italic">
                   &quot;{myQuotation.quotationDetails[0].revisionRemarks}&quot;
                </p>
              </div>
            )}

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <h3 className="font-black text-primary flex items-center gap-2 text-base">
                <PackageCheck className="h-5 w-5 text-secondary" />
                {t("products_requested")}
              </h3>
              <div className="space-y-3">
                {enquiry.enquiryLineItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="font-black text-secondary">
                          {item.item?.name || "Unknown Item"}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          {item.quantity}{" "}
                          {UNIT_TYPE_LABELS[item.unitType as UnitType]}
                        </p>
                        {item.remarks && (
                          <p className="text-xs italic text-gray-400 mt-1">
                            {item.remarks}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {details?.expectedDate && (
                          <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black tracking-wide whitespace-nowrap">
                            Deliver Within 7 days
                          </span>
                        )}
                        {item.flexibleWithBrands && (
                          <span className="px-3 py-1 rounded-full bg-secondary text-white text-[10px] font-black tracking-wide whitespace-nowrap">
                            Flexible with brands
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Delivery info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t("delivery_location")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6 break-all">
                  {details?.address || t("not_specified")}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-primary flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("expected_delivery_date")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {details?.expectedDate
                    ? format(new Date(details.expectedDate), "dd/MM/yyyy")
                    : t("not_specified")}
                </p>
              </div>
            </div>

            {/* Additional remarks */}
            <div className="space-y-2">
              <h4 className="text-sm font-black text-primary flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("additional_remarks")}
              </h4>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 min-h-[60px]">
                {details?.remarks ? (
                  <p className="text-sm text-gray-600">{details.remarks}</p>
                ) : (
                  <p className="text-sm text-gray-300 italic">
                    {t("write_something")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Buyer Info — orange card */}
          <BuyerInfoCard
            buyer={enquiry.createdBy}
            isContactRevealed={!!isActiveQuotation}
          />

          {/* Submit Quotation / Responded — action card */}
          {isRevisionRequested ? (
            <div className="rounded-2xl p-5 space-y-4 bg-linear-to-br from-violet-600 to-violet-800 text-white shadow-lg">
              <div>
                <h3 className="font-black text-lg">{t("action_required", "Action Required")}</h3>
                <p className="text-white/70 text-xs font-medium mt-1">
                  {t("buyer_requested_revision_desc", "Buyer has requested a price reconsideration. You can update your rates or maintain current pricing.")}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  asChild
                  className="w-full bg-white text-violet-700 hover:bg-gray-100 font-black text-xs rounded-xl h-11 border-0"
                >
                  <Link href={`/seller-dashboard/quotations/create?enquiryId=${enquiry.id}&revisionId=${myQuotation.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t("update_quotation", "Update Quotation")}
                  </Link>
                </Button>

                <Button 
                  variant="outline"
                  className="w-full bg-violet-700/30 border-white/20 text-white hover:bg-violet-700/50 font-black text-xs rounded-xl h-11"
                  disabled={isUpdatingQuotation}
                  onClick={async () => {
                    const originalData = {
                      lineItems: myQuotation.quotationLineItems.map(li => ({
                        id: li.id,
                        itemId: li.itemId,
                        rate: li.rate || 0,
                        amount: li.amount || 0,
                        isNegotiable: li.isNegotiable,
                      })),
                      details: {
                        expectedDate: myQuotation.quotationDetails?.[0]?.expectedDate || undefined,
                        remarks: myQuotation.quotationDetails?.[0]?.remarks || undefined,
                      }
                    };

                    updateQuotation({ 
                      id: myQuotation.id, 
                      data: { 
                        ...originalData,
                        details: {
                          ...originalData.details,
                          hasBeenRevised: true,
                        },
                        priceChangeType: "MAINTAINED"
                      } 
                    }, {
                      onSuccess: () => {
                        toast.success(t("price_maintained_success", "Price maintained. Revision request resolved."));
                      },
                      onError: (err) => {
                        toast.error(err.message || t("failed_to_maintain_price", "Failed to maintain price."));
                      }
                    });
                  }}
                >
                  {isUpdatingQuotation ? <Loader2 className="h-4 w-4 animate-spin" /> : t("maintain_price", "Maintain Original Price")}
                </Button>
              </div>
            </div>
          ) : (
            <ActivityActionCard
              isPending={hasActionNeeded}
              actionLabel={t("submit_quotation")}
              actionHref={`/seller-dashboard/quotations/create?enquiryId=${enquiry.id}`}
              actionIcon={<FileText className="h-4 w-4" />}
              actionDescription={t("ready_fulfil_requirement_send_price")}
              respondedLabel={isAcceptedLocally ? t("offer_accepted", "Offer Accepted") : hasResponded ? t("quotation_submitted") : t("enquiry_closed")}
              respondedDescription={isAcceptedLocally ? t("congratulations_offer_accepted", "Congratulations! Your offer has been accepted by the buyer.") : hasResponded ? t("already_responded_enquiry") : t("this_enquiry_is_closed")}
              backHref="/seller-dashboard/enquiries"
              backLabel={t("back_to_enquiries")}
              disabled={!isApproved}
            />
          )}

          {/* Tip card */}
          <ActivityTipCard tipText={t("tip_providing_quick_response")} />
        </div>
      </div>
    </div>
  );
}
