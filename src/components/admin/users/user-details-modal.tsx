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
import { AdminUser } from "@/types/auth";
import { useVerifyEntityMutation } from "@/queries/entityQueries";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  XCircle,
  PauseCircle,
  Building2,
  User2,
  FileText,
  ExternalLink,
  Star,
  ShieldAlert,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { USER_ROLE_LABELS, ENTITY_TYPE_LABELS } from "@/constants/roles";
import { VERIFICATION_STATUS } from "@/constants/enums";
import { DocumentPreview } from "@/components/shared/document-preview";
import { useEntityReviewsFullQuery, useToggleHideReviewMutation } from "@/queries/reviewQueries";
import { useRestoreFakeEnquiryBlacklistMutation, useUpdateUserMutation } from "@/queries/adminQueries";

interface UserDetailsModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onOpenChange,
}: UserDetailsModalProps) {
  const verifyMutation = useVerifyEntityMutation();
  const toggleHideMutation = useToggleHideReviewMutation();
  const updateUserMutation = useUpdateUserMutation();
  const restoreFakeEnquiryMutation = useRestoreFakeEnquiryBlacklistMutation();

  const entity = user?.createdEntities?.[0] || user?.staffAt;
  const { data: reviews = [], isLoading: isLoadingReviews } = useEntityReviewsFullQuery(entity?.id || "");

  if (!user) return null;

  const fakeEnquiryBlacklistEndsAt = user.fakeEnquiryBlacklistedUntil
    ? new Date(user.fakeEnquiryBlacklistedUntil)
    : null;
  const isFakeEnquiryBlacklisted = fakeEnquiryBlacklistEndsAt
    ? fakeEnquiryBlacklistEndsAt.getTime() > Date.now()
    : false;

  const isPending = entity?.verificationStatus === "PENDING";

  const handleVerify = async (status: "APPROVED" | "REJECTED" | "PAUSED") => {
    if (!entity) return;

    const remark =
      status === "APPROVED"
        ? "Verified by Admin"
        : status === "PAUSED"
          ? "Business activity paused by Admin"
          : "Rejected by Admin";

    try {
      await verifyMutation.mutateAsync({
        id: entity.id,
        data: {
          status: status as VERIFICATION_STATUS,
          remark,
        },
      });

      const successMessage =
        status === "APPROVED"
          ? "Business approved successfully"
          : status === "PAUSED"
            ? "Business paused successfully"
            : "Business rejected successfully";

      toast.success(successMessage);
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : status === "PAUSED"
            ? "Failed to pause business"
            : "Failed to verify business";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-[80vh] w-full rounded-md border">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <User2 className="size-6" />
                User Details
              </DialogTitle>
              <Badge variant="outline" className=" font-mono">
                {user.role
                  ? USER_ROLE_LABELS[
                      user.role as keyof typeof USER_ROLE_LABELS
                    ] || user.role
                  : "Unknown"}
              </Badge>
            </div>
            <DialogDescription>
              Comprehensive information about the user and their associated
              business.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {/* Personal Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Full Name" value={user.name} />
                  <InfoItem label="Email" value={user.email || "N/A"} />
                  <InfoItem label="Phone" value={user.phone || "N/A"} />
                  <InfoItem
                    label="Joined"
                    value={format(new Date(user.createdAt), "PPP")}
                  />
                </div>
              </section>

              {/* Business/Entity Information */}
              {entity && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="size-5" />
                      Business Information
                    </h3>
                    <Badge
                      variant={
                        entity.verificationStatus === "APPROVED"
                          ? "default"
                          : entity.verificationStatus === "PAUSED"
                            ? "outline"
                            : entity.verificationStatus === "REJECTED"
                              ? "destructive"
                              : "secondary"
                      }
                      className={cn(
                        entity.verificationStatus === "APPROVED" &&
                          "bg-emerald-500 hover:bg-emerald-600 border-none",
                        entity.verificationStatus === "PAUSED" &&
                          "border-amber-500 text-amber-600 hover:bg-amber-50",
                      )}
                    >
                      {entity.verificationStatus}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem label="Business Name" value={entity.name} />
                    <InfoItem
                      label="Legal Name"
                      value={entity.legalName || "N/A"}
                    />
                    <InfoItem
                      label="Entity Type"
                      value={
                        entity.type
                          ? ENTITY_TYPE_LABELS[
                              entity.type as keyof typeof ENTITY_TYPE_LABELS
                            ] || entity.type
                          : "N/A"
                      }
                    />
                    <InfoItem label="Operating Type" value={entity.op_type} />
                    <div className="md:col-span-2">
                      <InfoItem
                        label="Description"
                        value={entity.description || "No description provided."}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                    <h4 className="text-sm font-bold   text-muted-foreground">
                      Contact & Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoItem
                        label="Contact Email"
                        value={entity.contactEmail || "N/A"}
                      />
                      <InfoItem
                        label="Support Email"
                        value={entity.supportEmail || "N/A"}
                      />
                      <InfoItem
                        label="Primary Phone"
                        value={entity.primaryContactNumber || "N/A"}
                      />
                      <InfoItem
                        label="Secondary Phone"
                        value={entity.secondaryContactNumber || "N/A"}
                      />
                    </div>
                    <div className="pt-2">
                      <Label className="text-muted-foreground text-xs ">
                        Address
                      </Label>
                      <p className="mt-1 text-sm">
                        {entity.addressLine1 ? (
                          <>
                            {entity.addressLine1}
                            {entity.addressLine2 && `, ${entity.addressLine2}`}
                            <br />
                            {entity.city && `${entity.city}, `}
                            {entity.pincode?.pincode ? (
                              `Pincode: ${entity.pincode.pincode}`
                            ) : entity.pincodeId ? (
                              `Pincode ID: ${entity.pincodeId}`
                            ) : null}
                          </>
                        ) : (
                          "No address provided."
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Verification Documents Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold   text-muted-foreground">
                      Verification Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {entity.entityAttachments &&
                      entity.entityAttachments.filter((a) => a.document)
                        .length > 0 ? (
                         entity.entityAttachments
                          .filter((a) => a.document)
                          .map((attachment, idx) => {
                            const doc = attachment.document;
                            if (!doc) return null;
                            const fileType = doc.mimeType?.split("/").pop() || "pdf";
                            const fileName =
                              doc.name ||
                              doc.key
                                .split("/")
                                .pop()
                                ?.split("-")
                                .slice(2)
                                .join("-") ||
                              doc.key.split("/").pop() ||
                              `Document ${idx + 1}`;
                            const sizeInKb = (
                              parseInt(doc.sizeBytes) / 1024
                            ).toFixed(1);

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
                                      <span className="text-xs font-medium truncate max-w-[180px]">
                                        {decodeURIComponent(fileName)}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {sizeInKb} KB
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
                            No verification documents uploaded.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {!entity && (
                <div className="p-8 text-center bg-muted/50 rounded-lg border-2 border-dashed">
                  <Building2 className="size-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">
                    No associated business entity found.
                  </p>
                </div>
              )}

              {/* Ratings & Reviews for Business */}
              {entity && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                    Ratings & Reviews Audit
                  </h3>
                  {isLoadingReviews ? (
                    <div className="flex items-center justify-center p-6 bg-muted/10 rounded-lg">
                      <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic bg-muted/20 p-4 rounded-lg text-center">
                      No ratings or reviews found for this business.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className={cn(
                            "p-4 border rounded-xl transition-all shadow-xs relative",
                            review.isHidden
                              ? "bg-amber-500/5 border-amber-500/20 text-muted-foreground"
                              : "bg-white border-black/5"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={cn(
                                        "size-3.5",
                                        s <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted/20"
                                      )}
                                    />
                                  ))}
                                </div>
                                {review.isVerified && (
                                  <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-none text-[8px] px-1.5 py-0">
                                    Verified
                                  </Badge>
                                )}
                                {review.isHidden && (
                                  <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-none text-[8px] px-1.5 py-0">
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                              {review.title && (
                                <h5 className="text-xs font-black tracking-tight mt-1">
                                  {review.title}
                                </h5>
                              )}
                              {review.description && (
                                <p className="text-xs text-muted-foreground leading-normal max-w-lg mt-0.5">
                                  {review.description}
                                </p>
                              )}
                              <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                                <span>By: {review.createdBy?.name || "Anonymous"}</span>
                                {review.createdBy?.phone && (
                                  <span className="opacity-60">({review.createdBy.phone})</span>
                                )}
                                <span className="opacity-40">•</span>
                                <span>{format(new Date(review.createdAt), "PPP")}</span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "rounded-xl text-[10px] font-black h-8 px-3 shrink-0 transition-colors",
                                review.isHidden
                                  ? "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                  : "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                              )}
                              disabled={toggleHideMutation.isPending}
                              onClick={async () => {
                                try {
                                  await toggleHideMutation.mutateAsync({
                                    reviewId: review.id,
                                    entityId: entity.id,
                                    isHidden: !review.isHidden,
                                  });
                                  toast.success(
                                    review.isHidden
                                      ? "Review restored and visible publicly"
                                      : "Review hidden from public view"
                                  );
                                } catch (error) {
                                  toast.error("Failed to update review status");
                                }
                              }}
                            >
                              {toggleHideMutation.isPending ? (
                                <Loader2 className="size-3 animate-spin mr-1" />
                              ) : review.isHidden ? (
                                "Restore"
                              ) : (
                                "Hide Review"
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Spam Moderation for Buyers */}
              {user.role === "USER_BUYER_ADMIN" && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                    <Building2 className="size-5 text-amber-500" />
                    Account Safety & Compliance
                  </h3>
                  <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-amber-800">
                        Review Restriction (Spam Guard)
                      </h4>
                      <p className="text-xs text-amber-700 font-medium leading-relaxed max-w-md">
                        {user.username === "review_banned"
                          ? "This buyer is currently restricted from leaving reviews and ratings on product listings or service providers."
                          : "Restrict this buyer from leaving review ratings on product listings or service providers if they are flagged for posting spam."}
                      </p>
                    </div>

                    <Button
                      variant={user.username === "review_banned" ? "emerald" as any : "destructive"}
                      className={cn(
                        "rounded-xl text-xs font-black h-9 px-4 shrink-0 transition-colors",
                        user.username === "review_banned"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-rose-600 hover:bg-rose-700 text-white"
                      )}
                      disabled={updateUserMutation.isPending}
                      onClick={async () => {
                        const isCurrentlyBanned = user.username === "review_banned";
                        try {
                          await updateUserMutation.mutateAsync({
                            id: user.id,
                            data: {
                              username: isCurrentlyBanned ? null : "review_banned",
                            },
                          });
                          toast.success(
                            isCurrentlyBanned
                              ? "Buyer's review privilege restored successfully."
                              : "Buyer restricted from posting reviews successfully."
                          );
                        } catch (error) {
                          toast.error("Failed to update buyer restriction status.");
                        }
                      }}
                    >
                      {updateUserMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin mr-1" />
                      ) : user.username === "review_banned" ? (
                        "Restore Access"
                      ) : (
                        "Restrict Reviews"
                      )}
                    </Button>
                  </div>

                  <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-rose-800 flex items-center gap-2">
                        <ShieldAlert className="size-4" />
                        Fake Enquiry Blacklist
                      </h4>
                      <p className="text-xs text-rose-700 font-medium leading-relaxed max-w-md">
                        {isFakeEnquiryBlacklisted
                          ? `Buyer is blacklisted until ${format(fakeEnquiryBlacklistEndsAt!, "PPP")}.`
                          : fakeEnquiryBlacklistEndsAt
                            ? "Blacklist expired. Record can be cleared if needed."
                            : "No fake-enquiry blacklist active for this buyer."}
                      </p>
                    </div>

                    {isFakeEnquiryBlacklisted && (
                      <Button
                        variant="destructive"
                        className="rounded-xl text-xs font-black h-9 px-4 shrink-0"
                        disabled={restoreFakeEnquiryMutation.isPending}
                        onClick={async () => {
                          try {
                            await restoreFakeEnquiryMutation.mutateAsync(user.id);
                            toast.success("Buyer blacklist restored successfully.");
                            onOpenChange(false);
                          } catch (error) {
                            toast.error("Failed to restore buyer blacklist.");
                          }
                        }}
                      >
                        {restoreFakeEnquiryMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin mr-1" />
                        ) : (
                          "Restore Blacklist"
                        )}
                      </Button>
                    )}
                  </div>
                </section>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 border-t bg-muted/5">
            {entity ? (
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {entity.verificationStatus !== "REJECTED" && (
                  <Button
                    variant="destructive"
                    className="flex-1 sm:flex-none"
                    disabled={verifyMutation.isPending}
                    onClick={() => handleVerify("REJECTED")}
                  >
                    {verifyMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="size-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                )}
                {entity.verificationStatus !== "PAUSED" && (
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white border-none"
                    disabled={verifyMutation.isPending}
                    onClick={() => handleVerify("PAUSED")}
                  >
                    {verifyMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <PauseCircle className="size-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                )}
                {entity.verificationStatus !== "APPROVED" && (
                  <Button
                    variant="default"
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700"
                    disabled={verifyMutation.isPending}
                    onClick={() => handleVerify("APPROVED")}
                  >
                    {verifyMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="size-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                )}
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground text-xs  tracking-tight">
        {label}
      </Label>
      <p className="font-medium text-sm leading-snug">{value}</p>
    </div>
  );
}
