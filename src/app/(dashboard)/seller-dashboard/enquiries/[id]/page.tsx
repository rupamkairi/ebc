"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Calendar,
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
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useEnquiryQuery, useQuotationsQuery } from "@/queries/activityQueries";
import { BuyerInfoCard } from "@/components/dashboard/seller/activity-shared/buyer-info-card";
import { ActivityActionCard } from "@/components/dashboard/seller/activity-shared/activity-action-card";
import { ActivityTipCard } from "@/components/dashboard/seller/activity-shared/activity-tip-card";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";

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
  const isActiveQuotation = !!sellerEntity?.id && (quotations ?? []).some(
    (q) => q.enquiryId === id && ( // Ensure it belongs to this specific enquiry
           q.createdBy?.staffAtEntityId === sellerEntity.id || 
           q.createdBy?.createdEntities?.some(e => e.id === sellerEntity.id)
    ) && q.isActive
  );

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

  // Global Enqury Status
  const isClosed = enquiry.status === "ACCEPTED" || enquiry.status === "COMPLETED";
  const isPendingEnquiry = enquiry.status === "PENDING" || enquiry.status === "RESPONDED";

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
                    className={`px-4 py-1 rounded-full text-xs font-black tracking-wide text-white ${
                      isPendingEnquiry ? "bg-primary" : "bg-green-600"
                    }`}
                  >
                    {enquiry.status}
                  </span>
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
                <p className="text-sm text-gray-500 font-medium pl-6">
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
                    ? `${t("not_specified")} / ${format(new Date(details.expectedDate), "dd/MM/yyyy")}`
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
          <ActivityActionCard
            isPending={!isClosed && !hasResponded}
            actionLabel={t("submit_quotation")}
            actionHref={`/seller-dashboard/quotations/create?enquiryId=${enquiry.id}`}
            actionIcon={<FileText className="h-4 w-4" />}
            actionDescription={t("ready_fulfil_requirement_send_price")}
            respondedLabel={hasResponded ? t("quotation_submitted") : t("enquiry_closed")}
            respondedDescription={hasResponded ? t("already_responded_enquiry") : t("this_enquiry_is_closed")}
            backHref="/seller-dashboard/enquiries"
            backLabel={t("back_to_enquiries")}
            disabled={!isApproved}
          />

          {/* Tip card */}
          <ActivityTipCard tipText={t("tip_providing_quick_response")} />
        </div>
      </div>
    </div>
  );
}
