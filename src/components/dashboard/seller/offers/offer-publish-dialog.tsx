import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePublishOfferMutation } from "@/queries/conferenceHallQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import { AlertCircle, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OfferPublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerId: string | null;
  onSuccess?: () => void;
}

export function OfferPublishDialog({
  open,
  onOpenChange,
  offerId,
  onSuccess,
}: OfferPublishDialogProps) {
  const { data: entities } = useEntitiesQuery();
  const entityId = entities?.[0]?.id;
  const { data: wallet, isLoading: isLoadingWallet } =
    useWalletDetails(entityId);
  const publishMutation = usePublishOfferMutation();

  const balance = wallet?.balance ?? 0;

  const handlePublish = () => {
    if (!offerId) return;

    publishMutation.mutate(offerId, {
      onSuccess: () => {
        toast.success("Offer published successfully");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to publish offer");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish Offer?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm font-medium">
                  Wallet Balance:{" "}
                  {isLoadingWallet ? (
                    <Skeleton className="h-4 w-12 inline-block align-middle" />
                  ) : (
                    <span
                      className={cn(
                        balance < 0 ? "text-destructive" : "text-foreground",
                      )}
                    >
                      {balance.toLocaleString()} Coins
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 text-amber-600 dark:text-amber-500 text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold px-0">Finalize Details</p>
                  <p className="opacity-90">
                    Once published, <strong>Targets (Relations)</strong> and{" "}
                    <strong>Regions</strong> cannot be changed. This action will
                    deduct coins from your wallet.
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Are you sure you want to make this offer live?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={publishMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handlePublish();
            }}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Publish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
