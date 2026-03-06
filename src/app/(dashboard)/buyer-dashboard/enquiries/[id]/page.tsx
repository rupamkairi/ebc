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
  ReviewSnapshot,
} from "@/components/shared/reviews";
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
          <ReviewForm
            entityId={
              acceptedQuotation?.createdBy?.staffAtEntityId ||
              acceptedQuotation?.createdBy?.createdEntities?.[0]?.id
            }
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
                {quotations.map((q: Quotation) => (
                  <div
                    key={q.id}
                    className="space-y-6 md:space-y-8 p-4 md:p-8 rounded-2xl md:rounded-4xl bg-white border shadow-xl shadow-black/5 overflow-hidden"
                  >
                    {/* Header row: who proposed + badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          {t("proposed_by")}
                        </p>
                        <h4 className="text-lg md:text-2xl font-black tracking-tight">
                          {q.createdBy?.staffAt?.name || q.createdBy?.name}
                        </h4>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black tracking-widest shrink-0 mt-1">
                        {t("proposal_label")}
                      </Badge>
                    </div>

                    {/* Main content: line items + price/action */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                      <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                          {q.quotationLineItems.map((li: QuotationLineItem) => (
                            <div
                              key={li.id}
                              className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-muted/50 border"
                            >
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 truncate">
                                {li.item?.name}
                              </p>
                              <div className="text-base md:text-xl font-black tracking-tight">
                                ₹{li.rate} /{" "}
                                {
                                  UNIT_TYPE_LABELS[
                                    (enquiry?.enquiryLineItems?.find(
                                      (eli: EnquiryLineItem) =>
                                        eli.itemId === li.itemId,
                                    )?.unitType || "NUM") as UnitType
                                  ]
                                }
                              </div>
                              <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-tighter">
                                {li.isNegotiable ? t("negotiable_price") : t("fixed_price_label")}
                              </p>
                            </div>
                          ))}
                        </div>

                        {q.quotationDetails?.[0]?.remarks && (
                          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10 italic text-sm">
                            &quot;{q.quotationDetails[0].remarks}&quot;
                          </div>
                        )}
                      </div>

                      {/* Price + accept */}
                      <div className="w-full md:w-56 space-y-4 shrink-0">
                        <div className="p-4 md:p-6 rounded-2xl md:rounded-4xl bg-primary text-primary-foreground text-center space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                            {t("final_proposal")}
                          </p>
                          <div className="text-2xl md:text-3xl font-black">
                            ₹
                            {q.quotationLineItems.reduce(
                              (acc: number, li: QuotationLineItem) =>
                                acc + (li.amount || 0),
                              0,
                            )}
                          </div>
                        </div>

                        <ReviewSnapshot
                          entityId={
                            q.createdBy?.staffAtEntityId ||
                            q.createdBy?.createdEntities?.[0]?.id ||
                            ""
                          }
                          entityName={
                            q.createdBy?.staffAt?.name ||
                            q.createdBy?.createdEntities?.[0]?.name
                          }
                        />

                        {q.status === "ACCEPTED" ? (
                          <Button
                            className="w-full h-12 md:h-14 rounded-2xl md:rounded-3xl bg-emerald-500 hover:bg-emerald-600 font-black gap-2"
                            disabled
                          >
                            <CheckCircle2 className="h-5 w-5" />
                            {t("accepted_status")}
                          </Button>
                        ) : (
                          <Button
                            className="w-full h-12 md:h-14 rounded-2xl md:rounded-3xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                            onClick={() => handleAccept(q.id)}
                            disabled={acceptMutation.isPending || isCompleted}
                          >
                            {acceptMutation.isPending ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              t("accept_proposal_btn")
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Reputation Section */}
                    <div className="pt-6 md:pt-10 border-t border-dashed">
                      <ReputationSection
                        entityId={
                          q.createdBy?.staffAtEntityId ||
                          q.createdBy?.createdEntities?.[0]?.id ||
                          ""
                        }
                        entityName={
                          q.createdBy?.staffAt?.name ||
                          q.createdBy?.createdEntities?.[0]?.name
                        }
                        canReview={q.status === "ACCEPTED"}
                      />
                    </div>
                  </div>
                ))}
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
