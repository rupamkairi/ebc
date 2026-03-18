"use client";

import { useParams, useRouter } from "next/navigation";
import { TFunction } from "i18next";
import { useEnquiryQuery, useQuotationsQuery } from "@/queries/activityQueries";
import { Quotation, EnquiryLineItem } from "@/types/activity";
import { ReviewForm, ReviewSnapshot } from "@/components/shared/reviews";
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
  ArrowRight,
  CheckCircle2,
  FileText,
  PartyPopper,
  Star,
  IndianRupee,
  Clock,
  ChevronRight,
  MessageSquare,
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

  // Use the MOST RECENTLY accepted quotation as the canonical one for reviews.
  // Sort by updatedAt desc — when a quotation is accepted, updatedAt changes,
  // so the highest updatedAt among ACCEPTED quotations = buyer's last acceptance action.
  const acceptedQuotations = (quotations ?? []).filter(
    (q: Quotation) => q.status === "ACCEPTED",
  );
  const acceptedQuotation =
    acceptedQuotations.length > 0
      ? [...acceptedQuotations].sort(
          (a: Quotation, b: Quotation) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0]
      : null;
  const isCompleted = enquiry?.status === "COMPLETED";

  const acceptedEntityId =
    acceptedQuotation?.createdBy?.staffAtEntityId ||
    acceptedQuotation?.createdBy?.createdEntities?.[0]?.id ||
    "";
  const acceptedSellerName =
    acceptedQuotation?.createdBy?.staffAt?.name ||
    acceptedQuotation?.createdBy?.createdEntities?.[0]?.name ||
    acceptedQuotation?.createdBy?.name ||
    "the seller";

  // Check if buyer already left a review for this specific enquiry
  const existingReview = useEnquiryReviewQuery(acceptedEntityId, id);
  const hasReviewed = !!existingReview;

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
              {t("enquiry_details")}
            </h1>
          </div>
        </div>
      </div>

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
                      <h4 className="font-bold text-base md:text-lg truncate">
                        {item.item?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground italic">
                        {item.remarks || t("no_specific_remarks")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl md:text-2xl font-black">
                        {item.quantity}
                      </div>
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

          {/* Quotations / Activity Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2 pt-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                {enquiry.status === "COMPLETED"
                  ? "Successful Deal"
                  : "Quotations Received"}
              </h3>
              <Button
                asChild
                variant="ghost"
                className="text-primary font-black group/link h-9 px-4 rounded-xl border border-primary/10 hover:bg-primary/5"
              >
                <Link
                  href="/buyer-dashboard/quotations"
                  className="flex items-center gap-2"
                >
                  View All Quotations
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {isCompleted ? (
                acceptedQuotation ? (
                  <QuotationListItem
                    key={acceptedQuotation.id}
                    q={acceptedQuotation}
                    t={t}
                    isEnquiryClosed={true}
                  />
                ) : (
                  <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-emerald-50 overflow-hidden group">
                    <CardContent className="p-8 md:p-12 text-center space-y-6">
                      <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <PartyPopper className="h-10 w-10" />
                      </div>
                      <div className="space-y-2 max-w-md mx-auto">
                        <h4 className="text-2xl font-black text-emerald-900 tracking-tight">
                          Requirement Satisfied!
                        </h4>
                        <p className="text-emerald-700/80 font-medium leading-relaxed">
                          This enquiry has been marked as complete. You can view
                          all received quotations in the quotations list.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              ) : (quotations ?? []).length > 0 ? (
                [...(quotations ?? [])]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((q) => (
                    <QuotationListItem
                      key={q.id}
                      q={q}
                      t={t}
                      isEnquiryClosed={false}
                    />
                  ))
              ) : (
                <Card className="rounded-3xl border-2 border-dashed border-primary/20 bg-muted/30">
                  <CardContent className="p-10 text-center space-y-4">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <FileText className="h-8 w-8 text-primary/40" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-primary">
                        Awaiting Best Offers
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
                        Once sellers submit their quotations, they will appear
                        here for your comparison and selection.
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white font-black rounded-xl px-8 h-11 transition-all"
                    >
                      <Link href="/buyer-dashboard/quotations">
                        Check Quotations Dashboard
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {isCompleted && (
              <section className="pt-6">
                <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-emerald-50 overflow-hidden group">
                  <CardContent className="p-8 md:p-10 text-center space-y-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <PartyPopper className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h4 className="text-xl font-black text-emerald-900 tracking-tight">
                        Deal Comparison Complete!
                      </h4>
                      <p className="text-sm text-emerald-700/80 font-medium leading-relaxed">
                        Your requirement has been satisfied.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                      <div className="w-full sm:w-auto">
                        {hasReviewed ? (
                          <div className="flex items-center gap-3 px-6 h-12 rounded-xl bg-emerald-100/50 text-emerald-700 font-bold border border-emerald-200/50">
                            <CheckCircle2 className="h-4 w-4" />
                            Feedback Submitted
                          </div>
                        ) : (
                          <ReviewForm
                            enquiryId={enquiry.id}
                            entityId={acceptedEntityId || undefined}
                            isVerified={true}
                            onSuccess={() => {
                              toast.success("Thank you for your review!");
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
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
                <Calendar
                  className={cn(
                    "h-5 w-5 mt-1",
                    isCompleted && acceptedQuotation
                      ? "text-emerald-600"
                      : "text-primary",
                  )}
                />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isCompleted && acceptedQuotation
                      ? "Promised Delivery"
                      : t("expected_date_field")}
                  </p>
                  <p
                    className={cn(
                      "font-bold text-sm",
                      isCompleted && acceptedQuotation
                        ? "text-emerald-600"
                        : "text-foreground",
                    )}
                  >
                    {isCompleted && acceptedQuotation
                      ? acceptedQuotation.quotationDetails?.[0]?.expectedDate
                        ? format(
                            new Date(
                              acceptedQuotation.quotationDetails[0]
                                .expectedDate,
                            ),
                            "PPP",
                          )
                        : "Not Specified"
                      : enquiry.enquiryDetails?.[0]?.expectedDate
                        ? format(
                            new Date(enquiry.enquiryDetails[0].expectedDate),
                            "PPP",
                          )
                        : t("flexible_date")}
                  </p>
                </div>
              </div>

              {isCompleted &&
                acceptedQuotation?.quotationDetails?.[0]?.remarks && (
                  <div className="flex items-start gap-3 pt-4 border-t border-emerald-100/50">
                    <FileText className="h-5 w-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">
                        Seller Remarks
                      </p>
                      <p className="text-xs font-medium text-emerald-800 leading-relaxed italic">
                        &quot;{acceptedQuotation.quotationDetails[0].remarks}
                        &quot;
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuotationListItem({
  q,
  t,
  isEnquiryClosed,
}: {
  q: Quotation;
  t: TFunction;
  isEnquiryClosed: boolean;
}) {
  const total =
    q.quotationLineItems?.reduce((sum, li) => sum + (li.amount || 0), 0) ?? 0;
  const mainItem = q.quotationLineItems?.[0]?.item?.name || t("multiple_items");
  const itemCount = q.quotationLineItems?.length ?? 0;
  const isAccepted = q.status === "ACCEPTED";
  const isNegotiable =
    q.quotationLineItems?.some((li) => li.isNegotiable) && !q.hasBeenRevised;

  return (
    <Card className="overflow-hidden border border-primary/5 shadow-sm hover:shadow-md transition-all bg-white rounded-2xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div
            className={cn(
              "w-full md:w-1.5 h-1.5 md:h-auto",
              isAccepted
                ? "bg-emerald-500"
                : isEnquiryClosed
                  ? "bg-zinc-300"
                  : "bg-amber-400",
            )}
          />
          <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {q.id.slice(-8).toUpperCase()}
                  </span>
                  <Badge
                    className={cn(
                      "text-[10px] font-black uppercase tracking-wide border-none",
                      isAccepted
                        ? "bg-emerald-100 text-emerald-700"
                        : isEnquiryClosed
                          ? "bg-zinc-100 text-zinc-600"
                          : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {isAccepted
                      ? t("accepted_label")
                      : isEnquiryClosed
                        ? t("enquiry_closed")
                        : t("pending_label")}
                  </Badge>
                  {isNegotiable && !isAccepted && !isEnquiryClosed && (
                    <Badge className="text-[10px] font-black uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white border-none px-2.5 py-1 gap-1.5 shadow-md shadow-orange-200 animate-pulse">
                      <MessageSquare className="h-2.5 w-2.5 fill-white/20" />
                      {t("negotiable_price")}
                    </Badge>
                  )}
                  {q.requestedRevision && !q.hasBeenRevised && (
                    <Badge className="text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white border-none px-2.5 py-1 shadow-md shadow-violet-200">
                      {t("revision_requested_label", "Revision Requested")}
                    </Badge>
                  )}
                </div>
                <p className="font-black text-sm">
                  {itemCount > 1
                    ? `${mainItem} (${t("more_items", { count: itemCount - 1 })})`
                    : mainItem}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(q.createdAt), "dd MMM yyyy")}
                </p>
                <div className="pt-2">
                  <ReviewSnapshot
                    entityId={
                      q.createdBy?.staffAtEntityId ||
                      q.createdBy?.createdEntities?.[0]?.id ||
                      ""
                    }
                    entityName={
                      q.createdBy?.staffAt?.name ||
                      q.createdBy?.createdEntities?.[0]?.name ||
                      q.createdBy?.name
                    }
                    className="scale-90 origin-left"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {t("total_label")}
                </p>
                <div className="flex items-center justify-end font-black text-primary text-xl">
                  <IndianRupee className="h-4 w-4" />
                  {total.toLocaleString("en-IN")}
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-black rounded-xl h-10 px-5 transition-all group/btn"
              >
                <Link href={`/buyer-dashboard/quotations/${q.id}`}>
                  Details
                  <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border w-full", className)} />;
}
