"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdjustWalletMutation } from "@/queries/walletQueries";
import { toast } from "sonner";
import { Wallet } from "@/types/wallet";
import { TRANSACTION_REASON } from "@/constants/enums";

const adjustmentSchema = z.object({
  type: z.enum(["CREDIT", "DEBIT"]),
  cost: z.number().positive("Amount must be positive"),
  reason: z.nativeEnum(TRANSACTION_REASON),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

interface WalletAdjustmentModalProps {
  wallet: Wallet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletAdjustmentModal({
  wallet,
  open,
  onOpenChange,
}: WalletAdjustmentModalProps) {
  const adjustWallet = useAdjustWalletMutation();

  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: "CREDIT",
      cost: 1,
      reason: TRANSACTION_REASON.MANUAL_ADJUSTMENT,
    },
  });

  const onSubmit = (values: AdjustmentFormValues) => {
    if (!wallet) return;

    adjustWallet.mutate(
      {
        walletId: wallet.id,
        ...values,
      },
      {
        onSuccess: () => {
          toast.success("Wallet balance adjusted successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to adjust wallet balance");
          console.error("Adjustment error:", error);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Wallet Balance</DialogTitle>
          <DialogDescription>
            Account: {wallet?.entity?.name || "Unknown"} ({wallet?.owner?.name})
            <br />
            Current Balance: {wallet?.balance} coins
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CREDIT">Credit (Add Coins)</SelectItem>
                      <SelectItem value="DEBIT">
                        Debit (Remove Coins)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (Coins)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TRANSACTION_REASON).map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adjustWallet.isPending}>
                {adjustWallet.isPending ? "Adjusting..." : "Confirm Adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
