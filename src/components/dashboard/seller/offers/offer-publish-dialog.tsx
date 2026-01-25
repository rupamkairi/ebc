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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const publishMutation = usePublishOfferMutation();

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
          <AlertDialogDescription>
            This action will make the offer live and visible to everyone. This
            may deduct coins from your wallet.
            <br />
            Once published, you cannot edit relation or region details.
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
