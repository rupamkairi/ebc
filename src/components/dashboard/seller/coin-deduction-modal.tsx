"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletDetails } from "@/queries/walletQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { IndianRupee, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { REF_TYPE } from "@/types/activity";
import { useLeadPricing } from "@/queries/pricingQueries";

interface CoinDeductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadType: REF_TYPE;
  isProcessing?: boolean;
}

export function CoinDeductionModal({
  isOpen,
  onClose,
  onConfirm,
  leadType,
  isProcessing = false,
}: CoinDeductionModalProps) {
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading: isLoadingWallet } =
    useWalletDetails(entityId);
  const { data: pricing, isLoading: isLoadingPricing } =
    useLeadPricing(leadType);

  const balance = wallet?.balance ?? 0;
  const cost = pricing?.cost ?? 0;
  const hasInsufficientBalance = balance < cost;

  const isLoading = isLoadingWallet || isLoadingPricing;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic flex items-center gap-2">
            <IndianRupee className="text-amber-500" />
            Wallet Deduction
          </DialogTitle>
          <DialogDescription className="font-medium">
            This action requires coins from your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700/60">
                    Required Coins
                  </span>
                  <div className="text-2xl font-black text-amber-900 flex items-center gap-1">
                    {cost}
                    <span className="text-sm font-bold opacity-50">Coins</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-amber-200" />
                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700/60">
                    Your Balance
                  </span>
                  <div
                    className={`text-2xl font-black flex items-center justify-end gap-1 ${hasInsufficientBalance ? "text-rose-600" : "text-amber-900"}`}
                  >
                    {balance}
                    <span className="text-sm font-bold opacity-50">Coins</span>
                  </div>
                </div>
              </div>

              {hasInsufficientBalance ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle
                    className="text-rose-500 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-black text-rose-900 italic">
                      Insufficient Balance
                    </p>
                    <p className="text-xs font-medium text-rose-700 leading-relaxed">
                      You don&apos;t have enough coins to perform this action.
                      Please recharge your wallet to continue.
                    </p>
                    <Button
                      asChild
                      variant="link"
                      className="p-0 h-auto text-rose-800 font-black text-xs uppercase tracking-tighter"
                    >
                      <Link href="/seller-dashboard/wallet">
                        Recharge Now →
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-muted-foreground leading-relaxed text-center italic">
                  Coins will be deducted from your wallet once you confirm. This
                  action is irreversible.
                </p>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={onConfirm}
            disabled={hasInsufficientBalance || isLoading || isProcessing}
            className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-lg shadow-amber-200"
          >
            {isProcessing ? "Processing..." : "Confirm & Proceed"}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full h-12 font-bold text-muted-foreground rounded-xl"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
