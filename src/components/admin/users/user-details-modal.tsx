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
  Building2,
  User2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  if (!user) return null;

  const entity = user.createdEntities?.[0] || user.staffAt;
  const isPending = entity?.verificationStatus === "PENDING";

  const handleVerify = async (status: "APPROVED" | "REJECTED") => {
    if (!entity) return;

    try {
      await verifyMutation.mutateAsync({
        id: entity.id,
        data: {
          status,
          remark:
            status === "APPROVED" ? "Verified by Admin" : "Rejected by Admin",
        },
      });
      toast.success(`Business ${status.toLowerCase()} successfully`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to verify business");
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
              <Badge variant="outline" className="uppercase font-mono">
                {user.role?.replace("USER_", "").replace("_ADMIN", "")}
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
                          : entity.verificationStatus === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                      className={cn(
                        entity.verificationStatus === "APPROVED" &&
                          "bg-emerald-500 hover:bg-emerald-600 border-none"
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
                      value={entity.type || "N/A"}
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
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
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
                      <Label className="text-muted-foreground text-xs uppercase">
                        Address
                      </Label>
                      <p className="mt-1 text-sm">
                        {entity.addressLine1 ? (
                          <>
                            {entity.addressLine1}
                            {entity.addressLine2 && `, ${entity.addressLine2}`}
                            <br />
                            {entity.city && `${entity.city}, `}
                            {entity.pincodeId &&
                              `Pincode ID: ${entity.pincodeId}`}
                          </>
                        ) : (
                          "No address provided."
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Verification Documents Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Verification Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {entity.documents && entity.documents.length > 0 ? (
                        entity.documents.map((docId, idx) => (
                          <a
                            key={docId}
                            href={`${
                              process.env.NEXT_PUBLIC_API_URL ||
                              "http://localhost:10000/api"
                            }/attachment/document/url/${docId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="size-4 text-primary shrink-0" />
                              <span className="text-xs font-medium truncate">
                                Document {idx + 1}
                              </span>
                            </div>
                            <ExternalLink className="size-3 text-muted-foreground group-hover:text-primary" />
                          </a>
                        ))
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
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 border-t bg-muted/5">
            {isPending ? (
              <div className="flex gap-3 w-full sm:w-auto">
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
      <Label className="text-muted-foreground text-xs uppercase tracking-tight">
        {label}
      </Label>
      <p className="font-medium text-sm leading-snug">{value}</p>
    </div>
  );
}
