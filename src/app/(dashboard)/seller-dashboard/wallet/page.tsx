"use client";

import { useState } from "react";
import { 
  History,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet as WalletIcon,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import { RechargeModal } from "@/components/dashboard/seller/recharge-modal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuthStore } from "@/store/authStore";
import { isServiceBusiness } from "@/constants/roles";
import { reportService } from "@/services/reportService";
import { toast } from "sonner";
import { downloadWalletReceipt } from "@/lib/wallet-receipt";

export default function WalletPage() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null);
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading } = useWalletDetails(entityId);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const isService = isServiceBusiness(user?.role);
      const reportEndpoint = isService
        ? "/service-provider/wallet-transactions"
        : "/product-seller/wallet-transactions";
      const filename = isService
        ? "provider-wallet-transactions.csv"
        : "seller-wallet-transactions.csv";

      const response = await reportService.fetchReport(
        reportEndpoint,
        filename,
        "2000-01-01",
        "2099-12-31"
      );

      if (response.rows.length === 0) {
        toast.info("No transactions found to download.");
        return;
      }

      reportService.downloadRows(response.rows, response.filename, response.columns);
      toast.success("Wallet transactions report downloaded successfully!");
    } catch (err: unknown) {
      console.error("Failed to download wallet report:", err);
      toast.error(err instanceof Error ? err.message : "Failed to download wallet report.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4 md:p-8">
        <div className="h-48 w-full bg-muted rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 w-full bg-muted rounded-2xl" />
            <div className="h-32 w-full bg-muted rounded-2xl" />
            <div className="h-32 w-full bg-muted rounded-2xl" />
          </div>
          <div className="h-96 w-full bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const transactions = wallet?.transactions ?? [];

  const REASON_LABELS: Record<string, string> = {
    VISIT_SUBMIT: "SITE VISIT LEADS UNLOCK",
    QUOTATION_SUMBIT: "PRODUCT LEADS UNLOCK",
    WALLET_TOPUP: "WALLET RECHARGE",
    MANUAL_ADJUSTMENT: "MANUAL WALLET ADJUSTMENT",
    REFUND: "REFUNDED COINS",
    BONUS: "BONUS COINS",
    OFFER_PUBLISH: "OFFER PUBLISH COST",
    EVENT_PUBLISH: "EVENT PUBLISH COST",
    EVENT_JOIN: "EVENT JOIN COST",
    CONTENT_PUBLISH: "CONTENT PUBLISH COST",
  };

  const REF_TYPE_LABELS: Record<string, string> = {
    ENQUIRY: "Enquiry",
    QUOTATION: "Quotation",
    APPOINTMENT: "Appointment",
    OFFER: "Offer",
    EVENT: "Event",
    EVENT_PARTICIPANT: "Event Participant",
    VISIT: "Site Visit",
    CONTENT: "Content",
  };

  const handleDownloadReceipt = async (txn: (typeof transactions)[number]) => {
    try {
      setDownloadingReceiptId(txn.id);
      await downloadWalletReceipt({
        transaction: txn,
        purpose: REASON_LABELS[txn.reason] || txn.reason.replace(/_/g, " "),
      });
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Failed to download receipt:", error);
      toast.error("Failed to download receipt.");
    } finally {
      setDownloadingReceiptId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      <RechargeModal 
        isOpen={isRechargeOpen} 
        onClose={() => setIsRechargeOpen(false)} 
      />

      {/* Header Balance Card - Blue Theme */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 md:p-10 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="bg-white/10 p-4 rounded-xl">
            <WalletIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-100">{t("coin_balance")}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight">{balance.toLocaleString()}</span>
              <span className="text-base font-medium text-blue-100">{t("coins")}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            variant="outline"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-lg px-6 h-11 font-semibold shadow-sm"
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Report
          </Button>
          <Button 
            onClick={() => setIsRechargeOpen(true)}
            className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white border-0 rounded-lg px-6 h-11 font-semibold shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("add_coins")}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Transaction History */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-primary">{t("transaction_history")}</h3>
              </div>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="py-20 text-center opacity-30">
                    <History size={48} className="mx-auto mb-4" />
                    <p className="font-bold">{t("no_transactions_found")}</p>
                  </div>
                ) : (
                  <>
                    <div 
                      className={cn(
                        "space-y-3 pr-1 transition-all duration-300",
                        showAll ? "max-h-[480px] overflow-y-auto" : ""
                      )}
                    >
                      {(showAll ? transactions : transactions.slice(0, 5)).map((txn) => {
                        const isTopup = txn.type === 'CREDIT';
                        return (
                          <div 
                            key={txn.id} 
                            className="border border-gray-100 rounded-xl p-3 sm:p-4 transition-all duration-300 flex items-start sm:items-center justify-between gap-3 hover:border-accent hover:bg-accent/10 shadow-xs"
                          >
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                              <div className={cn(
                                "size-9 sm:size-11 rounded-lg flex items-center justify-center shrink-0 border",
                                isTopup 
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                  : "bg-rose-50 border-rose-100 text-rose-600"
                              )}>
                                {isTopup ? <ArrowUpRight size={16} className="sm:size-5" /> : <ArrowDownLeft size={16} className="sm:size-5" />}
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  <h4 className="font-bold text-primary text-xs sm:text-sm md:text-base leading-snug truncate max-w-[160px] sm:max-w-none">
                                    {REASON_LABELS[txn.reason] || txn.reason.replace(/_/g, ' ')}
                                  </h4>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                                      isTopup 
                                        ? txn.reason === 'REFUND'
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : txn.reason === 'BONUS'
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                    )}
                                  >
                                    {isTopup 
                                      ? txn.reason === 'REFUND' 
                                        ? "Refund" 
                                        : txn.reason === 'BONUS' 
                                          ? "Bonus" 
                                          : "Recharge" 
                                      : "Deduction"}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-1 text-[10px] sm:text-xs text-muted-foreground">
                                  <span className="font-semibold text-[9px] sm:text-[11px] bg-slate-100 px-1 sm:px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-tighter">
                                    ID: {txn.id.slice(0, 8)}
                                  </span>
                                  {txn.refId && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase">
                                        Ref: {REF_TYPE_LABELS[txn.refType || ''] || txn.refType || 'ID'} ({txn.refId.slice(0, 8)})
                                      </span>
                                    </>
                                  )}
                                  <span className="text-slate-300">•</span>
                                  <span className="font-medium flex items-center gap-1 shrink-0">
                                    <Clock className="size-2.5 sm:size-3 text-muted-foreground/75" />
                                    {format(new Date(txn.createdAt), "dd MMM yyyy • hh:mm a")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex flex-col items-end gap-0.5 self-start sm:self-center">
                              <div className={cn(
                                "text-sm sm:text-base md:text-lg font-extrabold tracking-tight",
                                isTopup ? "text-emerald-600" : "text-rose-600"
                              )}>
                                {isTopup ? '+' : '-'}{txn.cost.toLocaleString()} {t("coins")}
                              </div>
                              {isTopup && txn.amountInInr !== undefined && txn.amountInInr !== null && (
                                <div className="text-[9px] sm:text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-1.5 sm:px-2 py-0.5 rounded-md mt-0.5">
                                  Paid: ₹{txn.amountInInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadReceipt(txn)}
                                disabled={downloadingReceiptId === txn.id}
                                className="mt-1 h-7 gap-1 px-1.5 text-[10px] font-semibold text-primary hover:bg-primary/5 hover:text-primary"
                              >
                                {downloadingReceiptId === txn.id ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <Download className="size-3" />
                                )}
                                {t("download_receipt", "Receipt")}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {transactions.length > 5 && (
                      <div className="flex justify-center pt-2 border-t border-gray-50 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAll(!showAll)}
                          className="font-bold text-xs text-primary hover:text-primary/80 hover:bg-primary/5 gap-1 rounded-lg h-9 px-4"
                        >
                          {showAll ? (
                            <>
                              Show Less <ChevronUp className="h-3.5 w-3.5" />
                            </>
                          ) : (
                            <>
                              Show More ({transactions.length - 5} more) <ChevronDown className="h-3.5 w-3.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Why EBC Coins Section */}
        <div className="lg:col-span-5">
          <Card className="bg-gradient-to-b from-primary to-primary/60 rounded-2xl p-6 text-white overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <WalletIcon className="h-6 w-6 text-secondary" />
                <h3 className="text-xl font-bold">{t("why_ebc_coins")}</h3>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                {t("secure_coin_system_faster_unlocks")}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  t("unlock_quotations_priority"),
                  t("priority_site_visit_requests"),
                  t("featured_search_visibility"),
                  t("exclusive_seller_deals")
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-secondary shrink-0" />
                    <span className="text-sm font-medium text-blue-50">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
