"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/shared/upload/media-uploader";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
} from "@/queries/conferenceHallQueries";
import { UnifiedRegionSelector } from "@/components/shared/region/unified-region-selector";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLeadPricing } from "@/queries/pricingQueries";
import {
  Loader2,
  Save,
  X,
  File,
  AlertTriangle,
  CheckCircle,
  Globe,
} from "lucide-react";
import {
  Content,
  CreateContentRequest,
  UpdateContentRequest,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { TargetRegion } from "@/types/region";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ContentFormProps {
  initialData?: Content;
  entityId: string;
}

export function ContentForm({ initialData, entityId }: ContentFormProps) {
  const router = useRouter();
  const createContentMutation = useCreateContentMutation();
  const updateContentMutation = useUpdateContentMutation();

  const { data: pricingData, isLoading: isLoadingPricing } =
    useLeadPricing("CONTENT");
  const publishingFee = pricingData?.cost ?? 0;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      attachmentIds: [] as { mediaId?: string; documentId?: string }[],
      targetRegions: (initialData?.targetRegions || []) as TargetRegion[],
    },
    onSubmit: async ({ value }) => {
      try {
        if (initialData) {
          const { targetRegions, ...restValue } = value;
          await updateContentMutation.mutateAsync({
            id: initialData.id,
            data: {
              ...restValue,
              targetRegions: targetRegions.map((r) => ({
                pincodeId: r.pincodeId,
              })),
            } as UpdateContentRequest,
          });
          toast.success("Content updated successfully!");
        } else {
          const { targetRegions, ...restValue } = value;
          await createContentMutation.mutateAsync({
            ...(restValue as CreateContentRequest),
            targetRegions: targetRegions.map((r) => ({
              pincodeId: r.pincodeId,
            })),
            entityId,
          });
          toast.success("Content created successfully!");
        }
        router.push("/seller-dashboard/conference-hall/content");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to save content";
        toast.error(message);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {initialData?.verificationStatus && (
        <Alert
          variant={
            initialData.verificationStatus === VERIFICATION_STATUS.REJECTED
              ? "destructive"
              : "default"
          }
          className={
            initialData.verificationStatus === VERIFICATION_STATUS.APPROVED
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
              : ""
          }
        >
          {initialData.verificationStatus === VERIFICATION_STATUS.APPROVED ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle className="mb-1 flex items-center gap-2">
            Verification Status:
            <Badge variant="outline" className="uppercase">
              {initialData.verificationStatus}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            {initialData.verificationRemark ? (
              <span>
                <strong>Remarks:</strong> {initialData.verificationRemark}
              </span>
            ) : (
              "No remarks provided."
            )}
            {initialData.verificationStatus ===
              VERIFICATION_STATUS.APPROVED && (
              <div className="mt-2 text-xs opacity-90">
                This content is approved. You can only change its active status
                or delete it.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form.Subscribe
        selector={(state) => [
          state.values.isActive,
          state.values.targetRegions,
        ]}
      >
        {([, targetRegions]) => {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Information</CardTitle>
                    <CardDescription>
                      Provide the details of your content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form.Field name="name">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Content Title</Label>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Q1 Architecture Trends Whitepaper"
                            disabled={
                              initialData?.verificationStatus ===
                              VERIFICATION_STATUS.APPROVED
                            }
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="description">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Description</Label>
                          <Textarea
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Briefly describe what this content is about..."
                            className="min-h-[120px]"
                            disabled={
                              initialData?.verificationStatus ===
                              VERIFICATION_STATUS.APPROVED
                            }
                          />
                        </div>
                      )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4">
                      <form.Field name="isActive">
                        {(field) => (
                          <div className="flex items-center justify-between p-2 border rounded-md h-full">
                            <div className="space-y-0.5">
                              <Label>Active Status</Label>
                              <p className="text-[10px] text-muted-foreground">
                                Enable or disable this content
                              </p>
                            </div>
                            <Switch
                              checked={field.state.value}
                              onCheckedChange={field.handleChange}
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </CardContent>
                </Card>

                {/* Audience Targeting Section */}
                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-emerald-600" />
                      Target Audience Regions
                    </CardTitle>
                    <CardDescription>
                      Select specific areas where your content should be
                      promoted.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <UnifiedRegionSelector
                      selectedRegions={(targetRegions as TargetRegion[]) || []}
                      onUpdate={(regions) =>
                        form.setFieldValue("targetRegions", regions)
                      }
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Assets & Publish */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Assets</CardTitle>
                    <CardDescription>
                      Upload documents or media files.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form.Field name="attachmentIds">
                      {(field) => (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Document / File</Label>
                            {initialData?.verificationStatus !==
                              VERIFICATION_STATUS.APPROVED && (
                              <FileUploader
                                type="document"
                                entityId={entityId}
                                onUploadSuccess={(files) => {
                                  const newIds = files.map((f) => ({
                                    documentId: f.id,
                                  }));
                                  field.handleChange([
                                    ...field.state.value,
                                    ...newIds,
                                  ]);
                                }}
                              />
                            )}
                          </div>
                          <div className="space-y-2 pt-2 border-t">
                            <Label>Media / Video</Label>
                            {initialData?.verificationStatus !==
                              VERIFICATION_STATUS.APPROVED && (
                              <FileUploader
                                type="media"
                                entityId={entityId}
                                onUploadSuccess={(files) => {
                                  const newIds = files.map((f) => ({
                                    mediaId: f.id,
                                  }));
                                  field.handleChange([
                                    ...field.state.value,
                                    ...newIds,
                                  ]);
                                }}
                              />
                            )}
                          </div>

                          {/* Preview selected assets */}
                          {field.state.value.length > 0 && (
                            <div className="grid grid-cols-1 gap-2 mt-4">
                              {field.state.value.map((asset, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 border rounded text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <File className="h-3 w-3" />
                                    <span>Asset {idx + 1}</span>
                                  </div>
                                  {initialData?.verificationStatus !==
                                    VERIFICATION_STATUS.APPROVED && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => {
                                        field.handleChange(
                                          field.state.value.filter(
                                            (_, i) => i !== idx,
                                          ),
                                        );
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Publishing Fee
                        </span>
                        <span className="font-semibold text-primary">
                          {isLoadingPricing ? (
                            <Loader2 className="h-4 w-4 animate-spin inline-block" />
                          ) : (
                            publishingFee
                          )}{" "}
                          Coins
                        </span>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-[10px] text-yellow-800">
                        By publishing, you agree that{" "}
                        {isLoadingPricing ? "the applicable" : publishingFee}{" "}
                        coins will be deducted from your entity wallet.
                      </div>
                      <form.Subscribe
                        selector={(state) => [
                          state.canSubmit,
                          state.isSubmitting,
                        ]}
                      >
                        {([canSubmit, isSubmitting]) => (
                          <Button
                            type="submit"
                            className="w-full gap-2"
                            disabled={!canSubmit || isSubmitting}
                            size="lg"
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            {initialData ? "Update Content" : "Create Content"}
                          </Button>
                        )}
                      </form.Subscribe>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
