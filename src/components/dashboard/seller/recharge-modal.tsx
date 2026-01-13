"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletPackages, useCreateRechargeOrder, useVerifyPayment } from "@/queries/walletQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { IndianRupee, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: packages, isLoading: isLoadingPackages } = useWalletPackages();
  const createOrderMutation = useCreateRechargeOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = async (packageId: string) => {
    if (!entityId) return;

    try {
      setIsProcessing(true);
      const orderData = await createOrderMutation.mutateAsync({ packageId, entityId });

      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "E-CON Building Centre",
        description: "Coin Recharge",
        order_id: orderData.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Coins added to your wallet.");
            onClose();
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: entities?.[0]?.name,
          contact: "", // Could get from user details
        },
        theme: {
          color: "#D97706", // amber-600
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Recharge error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic flex items-center gap-2">
              <IndianRupee className="text-amber-500" />
              Recharge Your Wallet
            </DialogTitle>
            <DialogDescription className="font-medium">
              Choose a coin package to continue. Coins are credited instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {isLoadingPackages ? (
              <div className="flex flex-col items-center py-8 gap-4">
                <Loader2 className="animate-spin text-amber-500" size={32} />
                <p className="text-sm font-bold text-muted-foreground italic">Fetching best deals for you...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packages?.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handleRecharge(pkg.id)}
                    disabled={isProcessing}
                    className="p-4 rounded-2xl border-2 border-border hover:border-amber-500 hover:bg-amber-50 transition-all text-left flex flex-col gap-2 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                      <IndianRupee size={40} className="text-amber-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{pkg.name}</span>
                    <div className="text-2xl font-black text-foreground flex items-center gap-1">
                      {pkg.coins}
                      <span className="text-sm font-bold opacity-50">Coins</span>
                    </div>
                    <div className="mt-auto pt-2 border-t border-dashed border-border flex items-center justify-between">
                      <span className="text-lg font-black text-amber-600">₹{pkg.priceInInr}</span>
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <CheckCircle2 size={14} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <div className="flex items-start gap-2 text-[10px] font-bold text-muted-foreground italic">
              <AlertCircle size={12} className="mt-0.5 shrink-0" />
              By continuing, you agree to our terms of payment and coin usage policy. Coins are non-refundable.
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
