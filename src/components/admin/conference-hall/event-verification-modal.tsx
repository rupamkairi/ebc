"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  FileText,
  Loader2,
  Building2,
} from "lucide-react";
import { useEventQuery, useVerifyEventMutation } from "@/queries/conferenceHallQueries";
import { ConferenceHallEvent, VERIFICATION_STATUS } from "@/types/conference-hall";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentPreview } from "@/components/shared/document-preview";
import { cn } from "@/lib/utils";

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
  const { data: detailedEvent, isLoading: isLoadingDetails } = useEventQuery(
    event?.id || "",
  );
  const activeEvent = detailedEvent ?? event;
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<VERIFICATION_STATUS | null>(null);

  if (!activeEvent) return null;

  const verificationStatus =
    activeEvent.verificationStatus || VERIFICATION_STATUS.PENDING;
  const isAlreadyVerified =
    verificationStatus && verificationStatus !== VERIFICATION_STATUS.PENDING;

  const handleVerify = async () => {
    if (!activeEvent || !status) return;

    try {
      await verifyMutation.mutateAsync({
        id: activeEvent.id,
        data: {
          status,
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

  const entity = activeEvent.entity;
  const attachments = activeEvent.attachments || [];
  const targetRegions = activeEvent.targetRegions || [];
  const isHybrid = activeEvent.isRemote && activeEvent.isPhysical;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-[80vh] w-full rounded-md border">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="size-6" />
                  Event Verification
                </DialogTitle>
                <DialogDescription>
                  Review the event, seller details, timing, venue, and target audience before verification.
                </DialogDescription>
              </div>
              <Badge
                variant={
                  verificationStatus === VERIFICATION_STATUS.APPROVED
                    ? "default"
                    : verificationStatus === VERIFICATION_STATUS.REJECTED
                      ? "destructive"
                      : "outline"
                }
              >
                {verificationStatus}
              </Badge>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Event Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem label="Name" value={activeEvent.name} />
                  <InfoItem label="Description" value={activeEvent.description} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem label="Type" value={activeEvent.type} />
                    <InfoItem
                      label="Mode"
                      value={
                        isHybrid
                          ? "Hybrid"
                          : activeEvent.isRemote
                            ? "Remote"
                            : activeEvent.isPhysical
                              ? "Physical"
                              : "Unspecified"
                      }
                    />
                    <InfoItem
                      label="Visibility"
                      value={activeEvent.isPublic ? "Public" : "Private"}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem
                      label="Start Date"
                      value={
                        activeEvent.startDate
                          ? format(new Date(activeEvent.startDate), "PPP p")
                          : "N/A"
                      }
                    />
                    <InfoItem
                      label="End Date"
                      value={
                        activeEvent.endDate
                          ? format(new Date(activeEvent.endDate), "PPP p")
                          : "N/A"
                      }
                    />
                    <InfoItem
                      label="Status"
                      value={activeEvent.isActive ? "Active" : "Inactive"}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                      label="Created At"
                      value={format(new Date(activeEvent.createdAt), "PPP p")}
                    />
                    <InfoItem
                      label="Updated At"
                      value={format(new Date(activeEvent.updatedAt), "PPP p")}
                    />
                  </div>
                  {isLoadingDetails && (
                    <p className="text-xs text-muted-foreground">
                      Loading full event details...
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Building2 className="size-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">
                    Seller / Entity Information
                  </h3>
                </div>
                {entity ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Entity Name" value={entity.name} />
                    <InfoItem
                      label="Legal Name"
                      value={entity.legalName || "N/A"}
                    />
                    <InfoItem
                      label="Primary Phone"
                      value={entity.primaryContactNumber || "N/A"}
                    />
                    <InfoItem
                      label="Secondary Phone"
                      value={entity.secondaryContactNumber || "N/A"}
                    />
                    <InfoItem
                      label="Contact Email"
                      value={entity.contactEmail || "N/A"}
                    />
                    <InfoItem
                      label="Support Email"
                      value={entity.supportEmail || "N/A"}
                    />
                    <div className="md:col-span-2">
                      <InfoItem
                        label="Address"
                        value={formatEntityAddress(entity)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Seller details are not available on this record.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Location / Online Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    label="Physical Location"
                    value={
                      activeEvent.isPhysical
                        ? activeEvent.location || "N/A"
                        : "Not a physical event"
                    }
                  />
                  <InfoItem
                    label="Meeting Link"
                    value={
                      activeEvent.isRemote
                        ? activeEvent.meetingUrl || "N/A"
                        : "Not a remote event"
                    }
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Target Regions
                </h3>
                {targetRegions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {targetRegions.map((region, index) => (
                      <Badge key={region.id || `${region.pincodeId}-${index}`} variant="outline">
                        {formatRegion(region)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    No target regions configured.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attachments.length > 0 ? (
                    attachments.map((attachment, idx) => {
                      const doc = attachment.document || attachment.media;
                      if (!doc) return null;

                      const fileName = doc.name || `Attachment ${idx + 1}`;
                      const fileType =
                        "mimeType" in doc && doc.mimeType
                          ? doc.mimeType.split("/").pop() || "file"
                          : "pdf";

                      return (
                        <DocumentPreview
                          key={attachment.id}
                          url={doc.url}
                          name={fileName}
                          fileType={fileType}
                        >
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="size-4 text-primary shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-xs font-medium truncate max-w-[220px]">
                                  {decodeURIComponent(fileName)}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[220px]">
                                  {doc.url}
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="size-3 text-muted-foreground group-hover:text-primary" />
                          </a>
                        </DocumentPreview>
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
              </section>

              {activeEvent.verificationRemark && (
                <div className="bg-muted p-4 rounded-md">
                  <Label className="text-muted-foreground text-xs">
                    Previous Remarks
                  </Label>
                  <p className="text-sm mt-1">{activeEvent.verificationRemark}</p>
                </div>
              )}

              {!isAlreadyVerified && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">
                      Verification Decision
                    </h3>
                  </div>
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
                          <SelectItem value={VERIFICATION_STATUS.MISINFORMATION}>
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

function formatRegion(region: {
  scopeType?: string | null;
  pincodeId?: string | null;
  pincode?: {
    pincode?: string | null;
    district?: string | null;
    state?: string | null;
  } | null;
  state?: string | null;
  district?: string | null;
}) {
  const scope = region.scopeType || "PINCODE";
  const parts = [
    region.pincode?.pincode,
    region.pincode?.district,
    region.pincode?.state,
    region.district,
    region.state,
    region.pincodeId,
  ].filter(Boolean);

  return `${scope}: ${parts.join(" • ") || "N/A"}`;
}

function formatEntityAddress(entity: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  pincode?: { pincode?: string | null; district?: string | null; state?: string | null } | null;
  pincodeId?: string | null;
}) {
  const lines = [entity.addressLine1, entity.addressLine2].filter(Boolean).join(", ");
  const location = [entity.city, entity.pincode?.pincode || entity.pincodeId]
    .filter(Boolean)
    .join(" • ");
  const region = [entity.pincode?.district, entity.pincode?.state]
    .filter(Boolean)
    .join(", ");

  return [lines, location, region].filter(Boolean).join(" | ") || "N/A";
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
      <Label className="text-muted-foreground text-xs tracking-tight">
        {label}
      </Label>
      <p className="font-medium text-sm leading-snug whitespace-pre-wrap">
        {value || "N/A"}
      </p>
    </div>
  );
}
