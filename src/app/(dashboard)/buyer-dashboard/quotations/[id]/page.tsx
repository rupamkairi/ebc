"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useQuotationQuery,
  useAcceptQuotationMutation,
  useCompleteEnquiryMutation,
  useRequestRevisionMutation,
} from "@/queries/activityQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  Clock,
  Package,
  MapPin,
  Calendar,
  User,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ReviewSnapshot } from "@/components/shared/reviews";

export default function QuotationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: q, isLoading } = useQuotationQuery(id);
  const acceptMutation = useAcceptQuotationMutation();
  const completeMutation = useCompleteEnquiryMutation();
  const requestRevisionMutation = useRequestRevisionMutation(); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl font-bold">Quotation not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const isAccepted = q.status === "ACCEPTED";
  const isEnquiryCompleted = q.enquiry?.status === "COMPLETED";
  const isNegotiable = q.quotationLineItems?.some((li) => li.isNegotiable) && !q.hasBeenRevised;
  const isDiscountRequested = q.requestedRevision;
  
  const totalAmount = q.quotationLineItems?.reduce(
    (sum, li) => sum + (li.amount || 0),
    0
  ) || 0;

  const handleAcceptFlow = async () => {
    try {
      // 1. Accept Quotation
      await acceptMutation.mutateAsync(q.id);
      
      // 2. Mark Enquiry as Complete (as requested by user)
      if (q.enquiryId) {
        await completeMutation.mutateAsync(q.enquiryId);
      }
      
      toast.success("Quotation accepted and enquiry marked as complete!");
      router.push(`/buyer-dashboard/enquiries/${q.enquiryId}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const handleRequestRevisionFlow = async () => {
    try {
      // 1. Sent seller / service provider a request for revision
      await requestRevisionMutation.mutateAsync(q.id);

      toast.success("Revision request sent successfully!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {q.hasBeenRevised && (
        <div className="bg-violet-50 border border-violet-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shrink-0">
                 <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-black text-violet-900">Quotation Reconsidered</h4>
                 <p className="text-sm text-violet-700 font-medium">
                    The seller has reviewed your revision request and updated the proposal. 
                    {q.priceChangeType === "DECREASED" && " They have specially reduced the price for you!"}
                 </p>
              </div>
           </div>
        </div>
      )}

      {q.requestedRevision && !q.hasBeenRevised && (
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-pulse">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shrink-0">
                 <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-black text-orange-900">Revision Pending</h4>
                 <p className="text-sm text-orange-700 font-medium">
                    Your request for a price reconsideration has been sent. We are awaiting the seller&apos;s response.
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* Navigation and Title */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest bg-muted uppercase">
                QUO#{q.id.slice(-8).toUpperCase()}
              </Badge>
              {isAccepted && (
                <Badge className="bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest">
                  Accepted
                </Badge>
              )}
              {q.hasBeenRevised && (
                <Badge className="bg-violet-600 text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-1.5 px-3">
                  {q.priceChangeType === "DECREASED" && <TrendingDown className="h-3 w-3" />}
                  {q.priceChangeType === "INCREASED" && <TrendingUp className="h-3 w-3" />}
                  {q.priceChangeType === "MAINTAINED" && <RefreshCw className="h-3 w-3" />}
                  Revised {q.priceChangeType === "DECREASED" ? "(Price Reduced)" : q.priceChangeType === "INCREASED" ? "(Price Updated)" : ""}
                </Badge>
              )}
              {q.requestedRevision && !q.hasBeenRevised && (
                <Badge className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest px-3">
                  Revision Requested
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary">
              Quotation Details
            </h1>
            <p className="text-muted-foreground font-medium">
              Submitted by <span className="text-foreground font-bold">{q.createdBy?.staffAt?.name || q.createdBy?.name}</span>
            </p>
          </div>

          {!isAccepted && !isEnquiryCompleted && (
            <Button
              onClick={handleAcceptFlow}
              disabled={acceptMutation.isPending || completeMutation.isPending}
              className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-10 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 gap-3"
            >
              {acceptMutation.isPending || completeMutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-white" />
              )}
              Accept this Offer
            </Button>
          )}

          {!isAccepted && !isEnquiryCompleted && isNegotiable && !isDiscountRequested && (
            <Button
              onClick={handleRequestRevisionFlow}
              className="bg-orange-400 hover:bg-orange-500 text-white font-black px-10 text-lg shadow-xl shadow-orange-400/20 transition-all hover:scale-[1.02] active:scale-95 gap-3"
            >
              Ask for Discount
            </Button>
          )}

          {(isAccepted || isEnquiryCompleted) && (
            <div className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl border",
              isAccepted 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" 
                : "bg-amber-500/10 border-amber-500/30 text-amber-700"
            )}>
              {isAccepted ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
              <span className="font-black">{isAccepted ? "Offer Accepted" : "Enquiry Closed"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        {li.isNegotiable && !q.hasBeenRevised && (
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
                <div className="flex items-center text-3xl font-black text-primary tracking-tighter">
                  <IndianRupee className="h-6 w-6" />
                  {totalAmount.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <Link href={`/buyer-dashboard/enquiries/${q.enquiryId}`}>
                      View Full Enquiry
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
