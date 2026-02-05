"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useVerifyOfferMutation } from "@/queries/conferenceHallQueries";
import { Offer, VERIFICATION_STATUS } from "@/types/conference-hall";
import { format } from "date-fns";
import { FileText, Loader2, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OfferVerificationModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OfferVerificationModal({
  offer,
  isOpen,
  onOpenChange,
}: OfferVerificationModalProps) {
  const verifyMutation = useVerifyOfferMutation();
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<VERIFICATION_STATUS | null>(null);

  if (!offer) return null;

  const handleVerify = async () => {
    if (!offer || !status) return;

    try {
      await verifyMutation.mutateAsync({
        id: offer.id,
        data: {
          status: status,
          remarks: remarks || undefined,
        },
      });
      toast.success(`Offer ${status.toLowerCase()} successfully`);
      onOpenChange(false);
      setRemarks("");
      setStatus(null);
    } catch {
      toast.error("Failed to verify offer");
    }
  };

  const isAlreadyVerified =
    offer.verificationStatus &&
    offer.verificationStatus !== VERIFICATION_STATUS.PENDING;
  const details = offer.offerDetails?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-[80vh] w-full rounded-md border">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Tag className="size-6" />
                Offer Verification
              </DialogTitle>
              <Badge
                variant={
                  offer.verificationStatus === VERIFICATION_STATUS.APPROVED
                    ? "default"
                    : offer.verificationStatus === VERIFICATION_STATUS.REJECTED
                      ? "destructive"
                      : "outline"
                }
              >
                {offer.verificationStatus || "PENDING"}
              </Badge>
            </div>
            <DialogDescription>
              Review offer details, validity, and attachments.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {/* Offer Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Offer Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem label="Name" value={offer.name} />
                  <InfoItem label="Description" value={offer.description} />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Start Date"
                      value={
                        details?.startDate
                          ? format(new Date(details.startDate), "PPP")
                          : "N/A"
                      }
                    />
                    <InfoItem
                      label="End Date"
                      value={
                        details?.endDate
                          ? format(new Date(details.endDate), "PPP")
                          : "N/A"
                      }
                    />
                    <InfoItem
                      label="Status"
                      value={offer.isActive ? "Active" : "Inactive"}
                    />
                    <InfoItem
                      label="Created At"
                      value={format(new Date(offer.createdAt), "PPP p")}
                    />
                  </div>
                </div>
              </section>

              {/* Applied Relations */}
              <section className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Applied To
                </h4>
                <div className="flex flex-wrap gap-2">
                  {offer.offerRelations?.map((rel, i) => (
                    <Badge key={i} variant="secondary">
                      {rel.relationType}:{" "}
                      {rel.category?.name ||
                        rel.brand?.name ||
                        rel.specification?.name ||
                        rel.item?.name ||
                        rel.itemListing?.item?.name ||
                        rel.relationId}
                    </Badge>
                  ))}
                  {(!offer.offerRelations ||
                    offer.offerRelations.length === 0) && (
                    <span className="text-sm text-muted-foreground">
                      No specific relations (General Offer)
                    </span>
                  )}
                </div>
              </section>

              {/* Regions */}
              <section className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Regions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {offer.offerRegions?.map((reg, i) => (
                    <Badge key={i} variant="outline">
                      {reg.pincode
                        ? `${reg.pincode.pincode} (${reg.pincode.district})`
                        : reg.pincodeId}
                    </Badge>
                  ))}
                  {(!offer.offerRegions || offer.offerRegions.length === 0) && (
                    <span className="text-sm text-muted-foreground">
                      No specific regions
                    </span>
                  )}
                </div>
              </section>

              {/* Attachments Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Attachments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details?.attachments && details.attachments.length > 0 ? (
                    details.attachments.map((attUrl, idx) => {
                      // attachments here are just strings (URLs) based on existing type,
                      // or ids? Type definition says specifics might vary, but let's assume URLs from backend for now or ids if just stored
                      // Actually type says string[], lets assume they are media Ids or urls.
                      // If they are IDs we can't show much unless we fetch them or if they are full urls.
                      // Based on OfferDetail interface: attachments?: string[];
                      // In real app we might need to resolve these.
                      // For now displaying as ID/Link

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="size-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium truncate max-w-[180px]">
                                Attachment {idx + 1}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {attUrl}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full p-4 text-center border border-dashed rounded-lg bg-muted/20">
                      <p className="text-xs text-muted-foreground italic">
                        No attachments uploaded.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Remarks if any */}
              {offer.verificationRemark && (
                <div className="bg-muted p-4 rounded-md">
                  <Label className="text-muted-foreground text-xs uppercase">
                    Previous Remarks
                  </Label>
                  <p className="text-sm mt-1">{offer.verificationRemark}</p>
                </div>
              )}

              {/* Verification Actions */}
              {!isAlreadyVerified && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">
                    Verification Decision
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        onValueChange={(val) =>
                          setStatus(val as VERIFICATION_STATUS)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={VERIFICATION_STATUS.APPROVED}>
                            Approve
                          </SelectItem>
                          <SelectItem value={VERIFICATION_STATUS.REJECTED}>
                            Reject
                          </SelectItem>
                          <SelectItem value={VERIFICATION_STATUS.REVISE}>
                            Request Revision
                          </SelectItem>
                          <SelectItem
                            value={VERIFICATION_STATUS.MISINFORMATION}
                          >
                            Misinformation
                          </SelectItem>
                          <SelectItem value={VERIFICATION_STATUS.INAPPROPRIATE}>
                            Inappropriate
                          </SelectItem>
                          <SelectItem value={VERIFICATION_STATUS.OTHER}>
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Remarks</Label>
                      <Textarea
                        placeholder="Add remarks for the seller..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 border-t bg-muted/5">
            <div className="flex justify-end gap-3 w-full">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {!isAlreadyVerified && (
                <Button
                  disabled={!status || verifyMutation.isPending}
                  onClick={handleVerify}
                  className={cn(
                    status === VERIFICATION_STATUS.APPROVED &&
                      "bg-emerald-600 hover:bg-emerald-700",
                    status === VERIFICATION_STATUS.REJECTED &&
                      "bg-destructive hover:bg-destructive/90",
                  )}
                >
                  {verifyMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Decision
                </Button>
              )}
            </div>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground text-xs uppercase tracking-tight">
        {label}
      </Label>
      <p className="font-medium text-sm leading-snug">{value || "N/A"}</p>
    </div>
  );
}
