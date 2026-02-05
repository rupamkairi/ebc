"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ConferenceHallEvent,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { useVerifyEventMutation } from "@/queries/conferenceHallQueries";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  ExternalLink,
  Calendar,
  MapPin,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventVerificationModalProps {
  event: ConferenceHallEvent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventVerificationModal({
  event,
  isOpen,
  onOpenChange,
}: EventVerificationModalProps) {
  const verifyMutation = useVerifyEventMutation();
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<VERIFICATION_STATUS | null>(null);

  if (!event) return null;

  const handleVerify = async () => {
    if (!event || !status) return;

    try {
      await verifyMutation.mutateAsync({
        id: event.id,
        data: {
          status: status,
          remarks: remarks || undefined,
        },
      });
      toast.success(`Event ${status.toLowerCase()} successfully`);
      onOpenChange(false);
      setRemarks("");
      setStatus(null);
    } catch {
      toast.error("Failed to verify event");
    }
  };

  const isAlreadyVerified =
    event.verificationStatus &&
    event.verificationStatus !== VERIFICATION_STATUS.PENDING;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-[80vh] w-full rounded-md border">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="size-6" />
                Event Verification
              </DialogTitle>
              <Badge
                variant={
                  event.verificationStatus === VERIFICATION_STATUS.APPROVED
                    ? "default"
                    : event.verificationStatus === VERIFICATION_STATUS.REJECTED
                      ? "destructive"
                      : "outline"
                }
              >
                {event.verificationStatus || "PENDING"}
              </Badge>
            </div>
            <DialogDescription>
              Review event details, schedule, and attachments before
              verification.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {/* Event Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Event Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem label="Name" value={event.name} />
                  <InfoItem label="Description" value={event.description} />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Type" value={event.type} />
                    <InfoItem label="Created By" value={event.entity?.name} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Start Date"
                      value={
                        event.startDate
                          ? format(new Date(event.startDate), "PPP p")
                          : "N/A"
                      }
                    />
                    <InfoItem
                      label="End Date"
                      value={
                        event.endDate
                          ? format(new Date(event.endDate), "PPP p")
                          : "N/A"
                      }
                    />
                  </div>

                  {event.isPhysical && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <InfoItem label="Location" value={event.location} />
                    </div>
                  )}

                  {event.isRemote && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-muted-foreground text-xs uppercase tracking-tight">
                          Meeting Link
                        </Label>
                      </div>
                      <p className="font-medium text-sm leading-snug break-all">
                        {event.meetingUrl || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Attachments Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Attachments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.attachments && event.attachments.length > 0 ? (
                    event.attachments.map((attachment, idx) => {
                      const doc = attachment.document || attachment.media;
                      if (!doc) return null;

                      const fileName = doc.name || `Attachment ${idx + 1}`;

                      return (
                        <a
                          key={attachment.id}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="size-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium truncate max-w-[180px]">
                                {decodeURIComponent(fileName)}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="size-3 text-muted-foreground group-hover:text-primary" />
                        </a>
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
              {event.verificationRemark && (
                <div className="bg-muted p-4 rounded-md">
                  <Label className="text-muted-foreground text-xs uppercase">
                    Previous Remarks
                  </Label>
                  <p className="text-sm mt-1">{event.verificationRemark}</p>
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
