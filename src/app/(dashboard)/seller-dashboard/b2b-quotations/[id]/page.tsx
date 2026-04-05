"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useQuotationQuery,
  useAcceptQuotationMutation,
  useCompleteEnquiryMutation,
  useRequestRevisionMutation,
} from "@/queries/activityQueries";
import { QUOTATION_STATUS, ENQUIRY_STATUS } from "@/constants/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle2,
  IndianRupee,
  Clock,
  Package,
  MapPin,
  Calendar,
  User,
  ExternalLink,
  FileText as FileTextIcon,
  Download,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { ReviewSnapshot } from "@/components/shared/reviews";

import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";

export default function SellerQuotationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const { data: q, isLoading } = useQuotationQuery(id);
  const acceptMutation = useAcceptQuotationMutation();
  const completeMutation = useCompleteEnquiryMutation();
  const requestRevisionMutation = useRequestRevisionMutation(); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xl font-bold">{t("quotation_not_found", "Quotation not found")}</p>
        <Button onClick={() => router.back()}>{t("go_back", "Go Back")}</Button>
      </div>
    );
  }

  const isAccepted = q.status === QUOTATION_STATUS.ACCEPTED;
  const isEnquiryCompleted = q.enquiry?.status === ENQUIRY_STATUS.COMPLETED;
  const isNegotiable = q.quotationLineItems?.some((li) => li.isNegotiable) && !q.quotationDetails?.[0]?.hasBeenRevised;
  const isDiscountRequested = !!q.quotationDetails?.[0]?.requestedRevision;
  
  const totalAmount = q.quotationLineItems?.reduce(
    (sum, li) => sum + (li.amount || 0),
    0
  ) || 0;

  const handleAcceptFlow = async () => {
    try {
      await acceptMutation.mutateAsync(q.id);
      if (q.enquiryId) {
        await completeMutation.mutateAsync(q.enquiryId);
      }
      toast.success("Quotation accepted and enquiry marked as complete!");
      router.push(`/seller-dashboard/b2b-enquiries/${q.enquiryId}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const handleRequestRevisionFlow = async () => {
    try {
      await requestRevisionMutation.mutateAsync(q.id);
      toast.success("Revision request sent successfully!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <PageBackButton href="/seller-dashboard/b2b-quotations" />
          <div>
            <h1 className="text-2xl font-black text-primary tracking-tight">
              {t("quotation_details")}
            </h1>
            <p className="text-sm text-primary/60 font-medium lowercase">
              {`Submitted by ${q.createdBy?.staffAt?.name || q.createdBy?.name}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-between bg-white p-6 rounded-2xl border border-primary/5 shadow-xs">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="font-mono text-[10px] tracking-widest bg-muted uppercase">
                QUO#{q.id.slice(-8).toUpperCase()}
              </Badge>
              {isAccepted && (
                <Badge className="bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest px-3">
                  Accepted
                </Badge>
              )}
              {q.quotationDetails?.[0]?.hasBeenRevised && (
                <Badge className="bg-violet-600 text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-1.5 px-3">
                  Revised 
                </Badge>
              )}
          </div>

          <div className="flex items-center gap-3">
            {!isAccepted && !isEnquiryCompleted && (
              <Button
                onClick={handleAcceptFlow}
                disabled={acceptMutation.isPending || completeMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {acceptMutation.isPending || completeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                {t("accept_offer")}
              </Button>
            )}

            {!isAccepted && !isEnquiryCompleted && isNegotiable && !isDiscountRequested && (
              <Button
                onClick={handleRequestRevisionFlow}
                variant="outline"
                className="border-orange-400 text-orange-600 hover:bg-orange-50 font-black px-8 h-11 rounded-xl"
              >
                {t("ask_for_discount")}
              </Button>
            )}

            {(isAccepted || isEnquiryCompleted) && (
              <div className={cn(
                "flex items-center gap-3 px-6 h-11 rounded-xl border font-black text-xs uppercase tracking-widest",
                isAccepted 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" 
                  : "bg-amber-500/10 border-amber-500/30 text-amber-700"
              )}>
                {isAccepted ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                <span>{isAccepted ? t("offer_accepted") : t("enquiry_closed")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Quotation Items */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Proposed Items & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-dashed">
                {q.quotationLineItems?.map((li) => {
                  const unitLabel = li.item?.acceptableUnitTypes?.[0] || "Nos";
                  return (
                    <div key={li.id} className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 group hover:bg-muted/10 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-primary">{li.item?.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium">HSN: {li.item?.HSNCode}</p>
                          </div>
                        </div>
                        {li.remarks && (
                          <div className="ml-13 p-3 rounded-xl bg-amber-50 text-[11px] font-medium text-amber-800 border border-amber-200/50">
                            <b>Note:</b> {li.remarks}
                          </div>
                        )}

                        {li.itemListing?.attachments && li.itemListing.attachments.length > 0 && (
                          <div className="ml-13 mt-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">Attached Media & Documents</p>
                            <div className="flex flex-wrap gap-3">
                              {li.itemListing.attachments.map((att: { id: string; media?: { url: string }; document?: { url: string; name?: string; fileType?: string } }) => {
                                if (att.media) {
                                  return (
                                    <a key={att.id} href={att.media.url} target="_blank" rel="noreferrer" className="group relative h-16 w-16 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-muted/30">
                                      <Image src={att.media.url} alt="Attachment" fill className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ExternalLink className="h-4 w-4 text-white" />
                                      </div>
                                    </a>
                                  );
                                }
                                if (att.document) {
                                  return (
                                    <a key={att.id} href={att.document.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 max-w-[200px] p-2 pr-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileTextIcon className="h-4 w-4 text-primary" />
                                      </div>
                                      <div className="truncate flex-1">
                                        <p className="text-xs font-bold text-primary truncate" title={att.document.name || "Document"}>{att.document.name || "Document"}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{att.document.fileType || "PDF"}</p>
                                      </div>
                                      <Download className="h-3 w-3 text-muted-foreground shrink-0" />
                                    </a>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Proposed Rate</p>
                          <div className="flex items-center text-2xl font-black text-primary">
                            <IndianRupee className="h-5 w-5" />
                            {li.rate?.toLocaleString()}
                            <span className="text-xs text-muted-foreground font-medium ml-1">/{unitLabel}</span>
                          </div>
                        </div>
                        {li.isNegotiable && !q.quotationDetails?.[0]?.hasBeenRevised && !isAccepted && !isEnquiryCompleted && (
                          <Badge variant="outline" className="text-[9px] font-black uppercase text-secondary border-secondary/20 bg-secondary/5">
                            Negotiable
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Footer */}
              <div className="p-6 md:p-8 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-widest text-primary/60">Total Quotation Value</p>
                  <p className="text-xs text-muted-foreground font-medium">Inclusive of basic charges</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-3xl font-black text-primary tracking-tighter">
                    <IndianRupee className="h-6 w-6" />
                    {totalAmount.toLocaleString()}
                  </div>
                  {q.originalTotalAmount && q.originalTotalAmount !== totalAmount && (
                    <p className="text-[11px] font-bold text-muted-foreground mt-1">
                      Original: ₹{q.originalTotalAmount.toLocaleString()} | 
                      <span className={cn(
                        "ml-1",
                        q.priceChangeType === "DECREASED" ? "text-teal-600" : "text-amber-600"
                      )}>
                        {q.priceChangeType === "DECREASED" ? "Saved" : "Changed by"} ₹{Math.abs(q.priceDifference || 0).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller's Commitment */}
          {(q.quotationDetails?.[0]?.expectedDate || q.quotationDetails?.[0]?.remarks) && (
            <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Seller&apos;s Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.quotationDetails[0].expectedDate && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expected Delivery</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-black text-primary">
                          {format(new Date(q.quotationDetails[0].expectedDate), "PPP")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {q.quotationDetails[0].remarks && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Seller Remarks</p>
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 text-sm font-medium text-primary italic leading-relaxed">
                      &quot;{q.quotationDetails[0].remarks}&quot;
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Seller Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2 px-2">
              <User className="h-5 w-5 text-primary" />
              Seller Profile
            </h3>
            <Card className="rounded-3xl border-none shadow-lg bg-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                    {(q.createdBy?.staffAt?.name || q.createdBy?.name || "S").charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-primary">
                       {q.createdBy?.staffAt?.name || q.createdBy?.name}
                    </h4>
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
                      className="justify-center md:justify-start"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                   <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Experience</p>
                      <p className="font-black text-primary">5+ Years</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Response</p>
                      <p className="font-black text-primary">&lt; 2 hrs</p>
                   </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Content: Enquiry Context */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <h3 className="text-lg font-black flex items-center gap-2 px-2 mb-4">
              <ExternalLink className="h-5 w-5 text-primary" />
              Original Enquiry
            </h3>
            <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-linear-to-b from-primary/5 to-white overflow-hidden">
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Delivery Location</p>
                        <p className="text-sm font-bold leading-relaxed">
                          {q.enquiry?.enquiryDetails?.[0]?.address || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Requested Date</p>
                        <p className="text-sm font-bold">
                          {q.enquiry?.enquiryDetails?.[0]?.expectedDate
                            ? format(new Date(q.enquiry.enquiryDetails[0].expectedDate), "PPP")
                            : "Flexible"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Requirements</p>
                    <div className="space-y-2">
                      {q.enquiry?.enquiryLineItems?.map((eli) => (
                        <div key={eli.id} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-muted-foreground">{eli.item?.name}</span>
                          <span className="font-black text-primary">x {eli.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full h-12 rounded-xl mt-4 font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all">
                    <Link href={`/seller-dashboard/b2b-enquiries/${q.enquiryId}`}>
                      {t("view_full_enquiry")}
                    </Link>
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="h-px bg-muted w-full" />;
}
