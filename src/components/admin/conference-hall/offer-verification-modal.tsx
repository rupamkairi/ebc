"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Tag,
} from "lucide-react";
import { useOfferQuery, useVerifyOfferMutation } from "@/queries/conferenceHallQueries";
import { Offer, VERIFICATION_STATUS } from "@/types/conference-hall";
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
import { normalizeOfferForAdmin } from "./offer-display";
import { formatConferenceHallRegion } from "@/lib/conference-hall-region-label";
import { TargetRegion } from "@/types/region";

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
  const { data: detailedOffer, isLoading: isLoadingDetails } = useOfferQuery(
    offer?.id || "",
  );
  const activeOffer = detailedOffer ?? offer;
  const { details, targetRegions, offerRelations } =
    normalizeOfferForAdmin(activeOffer);
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<VERIFICATION_STATUS | null>(null);

  if (!activeOffer) return null;

  const verificationStatus =
    activeOffer.verificationStatus || VERIFICATION_STATUS.PENDING;
  const isAlreadyVerified =
    verificationStatus && verificationStatus !== VERIFICATION_STATUS.PENDING;

  const handleVerify = async () => {
    if (!activeOffer || !status) return;

    try {
      await verifyMutation.mutateAsync({
        id: activeOffer.id,
        data: {
          status,
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

  const entity = activeOffer.entity;
  const attachments = details?.attachments || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-[80vh] w-full rounded-md border">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Tag className="size-6" />
                  Offer Verification
                </DialogTitle>
                <DialogDescription>
                  Review the offer, seller details, applicable relations, regions, and attached files before verification.
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
                  Offer Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem label="Name" value={activeOffer.name} />
                  <InfoItem label="Description" value={activeOffer.description} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem
                      label="Availability"
                      value={activeOffer.isActive ? "Active" : "Inactive"}
                    />
                    <InfoItem
                      label="Visibility"
                      value={details?.isPublic ? "Public" : "Private"}
                    />
                    <InfoItem
                      label="Created At"
                      value={format(new Date(activeOffer.createdAt), "PPP p")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      label="Published At"
                      value={
                        details?.publishedAt
                          ? format(new Date(details.publishedAt), "PPP p")
                          : "Not published"
                      }
                    />
                  </div>
                  {isLoadingDetails && (
                    <p className="text-xs text-muted-foreground">
                      Loading full offer details...
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
                  Applicable Regions
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
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">
                    Applicable Relations
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {offerRelations.length} relation{offerRelations.length === 1 ? "" : "s"}
                  </span>
                </div>
                {offerRelations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {offerRelations.map((relation) => (
                      <RelationCard key={relation.id} relation={relation} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    No targeted product or seller relations configured.
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
                      const mimeType =
                        "mimeType" in doc &&
                        typeof doc.mimeType === "string"
                          ? doc.mimeType
                          : null;
                      const fileType =
                        mimeType?.split("/").pop() || "pdf";

                      if (!doc.url) {
                        return (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground"
                          >
                            <FileText className="size-4 shrink-0" />
                            {fileName} — unavailable
                          </div>
                        );
                      }

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

              {activeOffer.verificationRemark && (
                <div className="bg-muted p-4 rounded-md">
                  <Label className="text-muted-foreground text-xs">
                    Previous Remarks
                  </Label>
                  <p className="text-sm mt-1">{activeOffer.verificationRemark}</p>
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

function RelationCard({
  relation,
}: {
  relation: Offer["offerRelations"][number];
}) {
  switch (relation.relationType) {
    case "CATEGORY":
      return (
        <RelationShell title="Category" subtitle={relation.category?.name || relation.relationId}>
          <InfoItem label="Type" value={relation.category?.type || "N/A"} />
          <InfoItem
            label="Parent Category"
            value={relation.category?.parentCategory?.name || "N/A"}
          />
        </RelationShell>
      );
    case "BRAND":
      return (
        <RelationShell title="Brand" subtitle={relation.brand?.name || relation.relationId}>
          <InfoItem label="Brand Name" value={relation.brand?.name || "N/A"} />
        </RelationShell>
      );
    case "SPECIFICATION":
      return (
        <RelationShell
          title="Specification"
          subtitle={relation.specification?.name || relation.relationId}
        >
          <InfoItem
            label="Description"
            value={relation.specification?.description || "N/A"}
          />
        </RelationShell>
      );
    case "ITEM":
      return (
        <RelationShell title="Item" subtitle={relation.item?.name || relation.relationId}>
          <InfoItem label="Description" value={relation.item?.description || "N/A"} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Category" value={relation.item?.category?.name || "N/A"} />
            <InfoItem label="Brand" value={relation.item?.brand?.name || "N/A"} />
            <InfoItem
              label="Specification"
              value={relation.item?.specification?.name || "N/A"}
            />
            <InfoItem label="HSN Code" value={relation.item?.HSNCode || "N/A"} />
          </div>
          <InfoItem
            label="GST / Units"
            value={[
              relation.item?.GSTPercentage !== undefined
                ? `${relation.item.GSTPercentage}% GST`
                : null,
              relation.item?.acceptableUnitTypes?.length
                ? `Units: ${relation.item.acceptableUnitTypes.join(", ")}`
                : null,
            ]
              .filter(Boolean)
              .join(" | ")}
          />
        </RelationShell>
      );
    case "ITEM_LISTING":
      return (
        <RelationShell
          title="Item Listing"
          subtitle={
            relation.itemListing?.item?.name ||
            relation.itemListing?.entity?.name ||
            relation.relationId
          }
        >
          <InfoItem
            label="Listing ID"
            value={relation.itemListing?.id || relation.relationId}
          />
          <InfoItem
            label="Seller"
            value={relation.itemListing?.entity?.name || "N/A"}
          />
          <InfoItem
            label="Item"
            value={relation.itemListing?.item?.name || "N/A"}
          />
          <InfoItem
            label="Listing Status"
            value={relation.itemListing?.isActive ? "Active" : "Inactive"}
          />
          <InfoItem
            label="Rates"
            value={
              relation.itemListing?.itemRates?.length
                ? relation.itemListing.itemRates
                    .map((rate) =>
                      `${rate.minQuantity} ${rate.unitType} @ ${rate.rate}${rate.isNegotiable ? " negotiable" : ""}`,
                    )
                    .join(" • ")
                : "N/A"
            }
          />
          <InfoItem
            label="Regions"
            value={
              relation.itemListing?.itemRegions?.length
                ? relation.itemListing.itemRegions
                    .map((region) => formatListingRegion(region))
                    .join(" • ")
                : "N/A"
            }
          />
          <InfoItem
            label="Attachments"
            value={
              relation.itemListing?.attachments?.length
                ? `${relation.itemListing.attachments.length} file(s)`
                : "None"
            }
          />
        </RelationShell>
      );
    default:
      return (
        <RelationShell title="Relation" subtitle={relation.relationId}>
          <InfoItem label="Relation Type" value={relation.relationType} />
        </RelationShell>
      );
  }
}

function RelationShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-muted/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="font-semibold">{subtitle}</p>
        </div>
        <CheckCircle2 className="size-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
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
  pincodeDirectory?: {
    pincode?: string | null;
    district?: string | null;
    state?: string | null;
  } | null;
  state?: string | null;
  district?: string | null;
}) {
  return formatConferenceHallRegion(region as TargetRegion);
}

function formatListingRegion(region: {
  scopeType?: string | null;
  state?: string | null;
  district?: string | null;
  pincodeId?: string | null;
  pincode?: string | { pincode?: string | null; district?: string | null; state?: string | null };
}) {
  if (typeof region.pincode === "string") return region.pincode;
  return formatRegion(region as {
    scopeType?: string | null;
    pincodeId?: string | null;
    pincode?: {
      pincode?: string | null;
      district?: string | null;
      state?: string | null;
    } | null;
    state?: string | null;
    district?: string | null;
  });
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
