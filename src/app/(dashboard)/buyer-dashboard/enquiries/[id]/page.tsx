"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useEnquiryQuery,
  useQuotationsQuery,
  useAcceptQuotationMutation,
  useCompleteEnquiryMutation,
} from "@/queries/activityQueries";
import {
  Quotation,
  EnquiryLineItem,
  QuotationLineItem,
} from "@/types/activity";
import {
  ReputationSection,
  ReviewForm,
} from "@/components/shared/reviews";
import { useEnquiryReviewQuery } from "@/queries/reviewQueries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Package,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  PartyPopper,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export default function BuyerEnquiryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const { data: enquiry, isLoading: loadingEnquiry } = useEnquiryQuery(id);
  const { data: quotations, isLoading: loadingQuotations } = useQuotationsQuery(
    { enquiryId: id },
  );
  const acceptMutation = useAcceptQuotationMutation();
  const completeMutation = useCompleteEnquiryMutation();

  const acceptedQuotation = quotations?.find(
    (q: Quotation) => q.status === "ACCEPTED",
  );
  const isCompleted = enquiry?.status === "COMPLETED";

  const acceptedEntityId =
    acceptedQuotation?.createdBy?.staffAtEntityId ||
    acceptedQuotation?.createdBy?.createdEntities?.[0]?.id ||
    "";

  // Check if buyer already left a review for this specific enquiry
  const existingReview = useEnquiryReviewQuery(acceptedEntityId, id);
  const hasReviewed = !!existingReview;

  const handleAccept = async (quotationId: string) => {
    try {
      await acceptMutation.mutateAsync(quotationId);
      toast.success(t("quotation_accepted_msg"));
    } catch (error: any) {
      toast.error(error.message || t("quotation_failed_msg"));
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(id);
      toast.success(t("enquiry_delivered_msg"));
    } catch (error: any) {
      toast.error(error.message || t("status_update_failed_msg"));
    }
  };

  if (loadingEnquiry || loadingQuotations) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xl font-bold">{t("enquiry_not_found_text")}</p>
        <Button onClick={() => router.back()}>{t("go_back_btn")}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 space-y-8 md:space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/buyer-dashboard/enquiries"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_enquiries_link")}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest bg-muted uppercase"
              >
                ID: {enquiry.id.slice(0, 8)}
              </Badge>
              <Badge
                className={cn(
                  "uppercase text-[10px] font-black tracking-widest",
                  enquiry.status === "Approved"
                    ? "bg-emerald-500"
                    : enquiry.status === "COMPLETED"
                      ? "bg-blue-600"
                      : "bg-amber-500",
                )}
              >
                {enquiry.status}
              </Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">
              {t("requirement_details")}
            </h1>
          </div>

          {acceptedQuotation && !isCompleted && (
            <Button
              onClick={handleComplete}
              disabled={completeMutation.isPending}
              className="h-14 rounded-3xl bg-blue-600 hover:bg-blue-700 font-black gap-2 px-8 shadow-xl shadow-blue-500/20"
            >
              {completeMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              {t("mark_as_delivered")}
            </Button>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="p-5 md:p-8 rounded-2xl md:rounded-[3rem] bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="h-20 w-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <PartyPopper className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {t("order_completed")}
              </h2>
              <p className="text-muted-foreground font-medium max-w-sm">
                {t("how_was_experience_with")}{" "}
                <b>
                  {acceptedQuotation?.createdBy?.staffAt?.name ||
                    acceptedQuotation?.createdBy?.name}
                </b>
                ?
              </p>
            </div>
          </div>
          {hasReviewed ? (
            <div className="flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-sm">
                {t("review_submitted") || "Review Submitted — Thank you!"}
              </span>
            </div>
          ) : (
            <ReviewForm
              entityId={acceptedEntityId || undefined}
              enquiryId={id}
              isVerified={true}
              trigger={
                <Button
                  size="lg"
                  className="h-16 rounded-full px-10 bg-emerald-500 hover:bg-emerald-600 font-black gap-3 text-lg shadow-xl shadow-emerald-500/20 group"
                >
                  <Star className="h-6 w-6 fill-current group-hover:rotate-12 transition-transform" />
                  {t("rate_your_experience")}
                </Button>
              }
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Left Side: Enquiry Info */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {t("items_requested")}
            </h3>
            <div className="grid gap-3 md:gap-4">
              {enquiry.enquiryLineItems?.map((item: EnquiryLineItem) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-none shadow-sm bg-muted/30"
                >
                  <CardContent className="p-4 md:p-6 flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-base md:text-lg truncate">{item.item?.name}</h4>
                      <p className="text-sm text-muted-foreground italic">
                        {item.remarks || t("no_specific_remarks")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl md:text-2xl font-black">{item.quantity}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {UNIT_TYPE_LABELS[item.unitType as UnitType]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* Quotations Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                {t("seller_quotations")}
              </h3>
              <Badge variant="secondary" className="font-bold">
                {quotations?.length || 0} {t("proposals_count")}
              </Badge>
            </div>

            {!quotations || quotations.length === 0 ? (
              <div className="p-8 md:p-12 text-center bg-muted/20 border border-dashed rounded-2xl md:rounded-3xl">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">
                  {t("no_quotations_received_yet")}
                </p>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-10">
                {enquiry?.enquiryLineItems?.map((eli: EnquiryLineItem) => {
                  const unitLabel = UNIT_TYPE_LABELS[(eli.unitType || "NUM") as UnitType];
                  const quotesForItem = quotations.filter(q =>
                    q.quotationLineItems.some(qli => qli.itemId === eli.itemId)
                  );

                  if (quotesForItem.length === 0) return null;

                  return (
                    <div key={eli.id} className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-black tracking-tight">
                          {eli.item?.name}
                        </h4>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
                          {eli.quantity} {unitLabel}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {quotesForItem.map((q: Quotation) => {
                          const li = q.quotationLineItems.find(
                            (qli: QuotationLineItem) => qli.itemId === eli.itemId,
                          );
                          if (!li) return null; // Should not happen due to filter above, but for type safety

                          const isAcceptedQuote = q.status === "ACCEPTED";

                          return (
                            <div
                              key={q.id}
                              className={cn(
                                "p-4 md:p-6 rounded-2xl md:rounded-3xl border space-y-4",
                                isAcceptedQuote
                                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                                  : "bg-white shadow-sm"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                    {t("proposed_by")}
                                  </p>
                                  <h5 className="text-base font-black tracking-tight">
                                    {q.createdBy?.staffAt?.name || q.createdBy?.name}
                                  </h5>
                                </div>
                                <Badge
                                  className={cn(
                                    "uppercase text-[10px] font-black tracking-widest shrink-0 mt-1",
                                    isAcceptedQuote
                                      ? "bg-emerald-500 text-white"
                                      : "bg-primary/10 text-primary border-primary/20"
                                  )}
                                >
                                  {isAcceptedQuote ? t("accepted_status") : t("proposal_label")}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-end justify-between gap-2">
                                  <div className="text-xl md:text-2xl font-black tracking-tight">
                                    ₹{li.rate}{" "}
                                    <span className="text-sm font-medium text-muted-foreground">
                                      / {unitLabel}
                                    </span>
                                  </div>
                                  {li.amount > 0 && (
                                    <p className="text-xs text-muted-foreground text-right">
                                      Total:{" "}
                                      <span className="font-bold text-foreground">₹{li.amount}</span>
                                    </p>
                                  )}
                                </div>
                                <p className={cn(
                                  "text-[10px] font-black uppercase tracking-tighter",
                                  li.isNegotiable ? "text-amber-600" : "text-primary",
                                )}>
                                  {li.isNegotiable ? t("negotiable_price") : t("fixed_price_label")}
                                </p>
                                {li.remarks && (
                                  <p className="text-xs italic text-muted-foreground border-t pt-2">
                                    {li.remarks}
                                  </p>
                                )}
                              </div>

                              {/* Accept button — only on non-completed enquiries */}
                              {!isCompleted && (
                                q.status === "ACCEPTED" ? (
                                  <Button
                                    className="w-full h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black gap-2 text-sm"
                                    disabled
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {t("accepted_status")}
                                  </Button>
                                ) : (
                                  <Button
                                    className="w-full h-10 rounded-2xl font-black shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform text-sm"
                                    onClick={() => handleAccept(q.id)}
                                    disabled={acceptMutation.isPending}
                                  >
                                    {acceptMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      t("accept_proposal_btn")
                                    )}
                                  </Button>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Reputation Section — only for the accepted seller, shown once at the bottom */}
                {acceptedQuotation && (
                  <div className="pt-6 md:pt-10 border-t border-dashed">
                    <ReputationSection
                      entityId={acceptedEntityId}
                      entityName={
                        acceptedQuotation.createdBy?.staffAt?.name ||
                        acceptedQuotation.createdBy?.createdEntities?.[0]?.name
                      }
                      canReview={isCompleted && !hasReviewed}
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Quick Specs */}
        <div className="space-y-6">
          <Card className="rounded-4xl border-none shadow-lg shadow-black/5 bg-linear-to-b from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-black tracking-tight">
                {t("order_logics")}
              </CardTitle>
              <CardDescription>{t("delivery_schedule_info")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {t("location_field")}
                  </p>
                  <p className="font-bold text-sm leading-relaxed">
                    {enquiry.enquiryDetails?.[0]?.address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {t("expected_date_field")}
                  </p>
                  <p className="font-bold text-sm">
                    {enquiry.enquiryDetails?.[0]?.expectedDate
                      ? format(
                          new Date(enquiry.enquiryDetails[0].expectedDate),
                          "PPP",
                        )
                      : t("flexible_date")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border w-full", className)} />;
}
