"use client";

import { FileUploader } from "@/components/shared/upload/media-uploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEventMutation,
  usePublishEventMutation,
  useUpdateEventMutation,
} from "@/queries/conferenceHallQueries";
import { UnifiedRegionSelector } from "@/components/shared/region/unified-region-selector";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import {
  ConferenceHallEvent,
  UpdateEventRequest,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { TargetRegion } from "@/types/region";
import { useForm, formOptions } from "@tanstack/react-form";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  FileText,
  FileVideo,
  Globe,
  Loader2,
  MapPin,
  Save,
  Video,
  X,
} from "lucide-react";
import { useLeadPricing } from "@/queries/pricingQueries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EventFormProps {
  initialData?: ConferenceHallEvent;
  entityId: string;
}

export function EventForm({ initialData, entityId }: EventFormProps) {
  const router = useRouter();
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const publishEventMutation = usePublishEventMutation();

  const { data: pricingData, isLoading: isLoadingPricing } =
    useLeadPricing("EVENT");
  const publishingFee = pricingData?.cost ?? 0;

  const form = useForm(
    formOptions({
      defaultValues: {
        name: initialData?.name || "",
        description: initialData?.description || "",
        type: (initialData?.type || "RECORDED") as "LIVE" | "RECORDED",
        isPublic: initialData?.isPublic ?? false,
        isPhysical: initialData?.isPhysical ?? false,
        isRemote: initialData?.isRemote ?? false,
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
        location: initialData?.location || "",
        meetingUrl: initialData?.meetingUrl || "",
        pincodeId: initialData?.pincodeId || "",
        attachmentIds: [] as { mediaId?: string; documentId?: string }[],
        targetRegions: (initialData?.targetRegions || []) as TargetRegion[],
      },
      onSubmit: async ({ value }) => {
        try {
          if (initialData) {
            const isApproved =
              initialData.verificationStatus === VERIFICATION_STATUS.APPROVED;

            // If transitioning to public for the first time after approval, use publish mutation (charges coins)
            if (isApproved && !initialData.isPublic && value.isPublic) {
              await publishEventMutation.mutateAsync(initialData.id);
              toast.success("Event published successfully!");
            } else {
              // Otherwise use update mutation, but filter fields if approved to avoid backend errors
              const { targetRegions, ...restValue } = value;
              const payload = isApproved
                ? { isPublic: value.isPublic, isActive: initialData.isActive }
                : {
                    ...restValue,
                    targetRegions: targetRegions.map((r) => ({
                      pincodeId: r.pincodeId,
                    })),
                  };

              await updateEventMutation.mutateAsync({
                id: initialData.id,
                data: payload as UpdateEventRequest,
              });
              toast.success("Event updated successfully!");
            }
          } else {
            const { targetRegions, ...restValue } = value;
            await createEventMutation.mutateAsync({
              ...restValue,
              targetRegions: targetRegions.map((r) => ({
                pincodeId: r.pincodeId,
              })),
              entityId,
            });
            const isLive = value.type === "LIVE";
            toast.success(
              isLive
                ? "Event created and sent for admin approval!"
                : "Event created successfully! Coins deducted from wallet.",
            );
          }
          router.push("/seller-dashboard/conference-hall/events");
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to save event";
          toast.error(message);
        }
      },
    }),
  );

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
              : "mb-6"
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
                This event is approved. You can only change its active
                status/mode or delete it.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      <form.Subscribe
        selector={(state) => [
          state.values.type,
          state.values.isPhysical,
          state.values.isRemote,
          state.values.targetRegions,
        ]}
      >
        {([type, isPhysical, isRemote, targetRegions]) => {
          const isLive = type === "LIVE";
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                {isLive &&
                  (!initialData ||
                    initialData.verificationStatus !==
                      VERIFICATION_STATUS.APPROVED) && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">
                        Admin Approval Required
                      </AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Live events must be verified and approved by an admin
                        before they can be made public.
                      </AlertDescription>
                    </Alert>
                  )}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                    <CardDescription>
                      Provide the basic details of your event.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form.Field name="name">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Event Title</Label>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Modern Architecture Webinar"
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
                            placeholder="What is this event about?"
                            className="min-h-[120px]"
                          />
                        </div>
                      )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4">
                      <form.Field name="type">
                        {(field) => (
                          <div className="space-y-2">
                            <Label>Event Nature</Label>
                            <Select
                              value={field.state.value}
                              onValueChange={(val: "LIVE" | "RECORDED") =>
                                field.handleChange(val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LIVE">
                                  Live Session
                                </SelectItem>
                                <SelectItem value="RECORDED">
                                  Recorded Session
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="isPublic">
                        {(field) => (
                          <div className="flex items-center justify-between p-2 border rounded-md h-full">
                            <div className="space-y-0.5">
                              <Label>Public Event</Label>
                              <p className="text-[10px] text-muted-foreground">
                                Visible to everyone
                              </p>
                            </div>
                            <Switch
                              checked={field.state.value}
                              onCheckedChange={field.handleChange}
                              disabled={
                                isLive &&
                                initialData?.verificationStatus !==
                                  VERIFICATION_STATUS.APPROVED
                              }
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </CardContent>
                </Card>

                {/* Logistics (Only if Live) */}
                {isLive && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Logistics & Schedule
                      </CardTitle>
                      <CardDescription>
                        Setup how people will attend your live event.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <form.Field name="startDate">
                          {(field) => (
                            <div className="space-y-2">
                              <Label>Start Date & Time</Label>
                              <Input
                                type="datetime-local"
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="endDate">
                          {(field) => (
                            <div className="space-y-2">
                              <Label>End Date & Time</Label>
                              <Input
                                type="datetime-local"
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            </div>
                          )}
                        </form.Field>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                        <form.Field name="isRemote">
                          {(field) => (
                            <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                              <div className="flex items-center gap-3">
                                <Video className="h-5 w-5 text-blue-500" />
                                <div className="space-y-0.5">
                                  <Label>Remote (Online)</Label>
                                  <p className="text-[10px] text-muted-foreground">
                                    Generates Google Meet link
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={field.state.value}
                                onCheckedChange={field.handleChange}
                                disabled={
                                  initialData?.verificationStatus ===
                                  VERIFICATION_STATUS.APPROVED
                                }
                              />
                            </div>
                          )}
                        </form.Field>

                        <form.Field name="isPhysical">
                          {(field) => (
                            <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                              <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-green-500" />
                                <div className="space-y-0.5">
                                  <Label>Physical (In-person)</Label>
                                  <p className="text-[10px] text-muted-foreground">
                                    Held at a specific location
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={field.state.value}
                                onCheckedChange={field.handleChange}
                                disabled={
                                  initialData?.verificationStatus ===
                                  VERIFICATION_STATUS.APPROVED
                                }
                              />
                            </div>
                          )}
                        </form.Field>
                      </div>

                      {/* Conditional Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isPhysical && (
                          <>
                            <form.Field name="location">
                              {(field) => (
                                <div className="space-y-2">
                                  <Label>Venue Address</Label>
                                  <Input
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    placeholder="e.g. Ground Floor, EBC Center"
                                  />
                                </div>
                              )}
                            </form.Field>
                            <form.Field name="pincodeId">
                              {(field) => (
                                <div className="space-y-2">
                                  <Label>City / Pincode</Label>
                                  <PincodeSearchAutocomplete
                                    value={field.state.value}
                                    onValueChange={field.handleChange}
                                    placeholder="Search location..."
                                  />
                                </div>
                              )}
                            </form.Field>
                          </>
                        )}
                      </div>

                      {isRemote && (
                        <div className="space-y-4">
                          <form.Field name="meetingUrl">
                            {(field) => (
                              <div className="space-y-2">
                                <Label htmlFor={field.name}>
                                  Meeting Link (Google Meet / Zoom / Teams)
                                </Label>
                                <Input
                                  id={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="https://meet.google.com/..."
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                  {field.state.value
                                    ? "You have provided a custom link. Buyers will see this upon joining."
                                    : "Leave blank to automatically generate a Google Meet link (requires Start/End time)."}
                                </p>
                              </div>
                            )}
                          </form.Field>
                          {!form.getFieldValue("meetingUrl") && (
                            <div className="p-3 border border-blue-100 bg-blue-50 rounded-md text-xs text-blue-700">
                              Choosing &quot;Remote&quot; without a custom link
                              will automatically sync this event with Google
                              Calendar and generate a Meeting Link once
                              published.
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Audience Targeting Section */}
                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-emerald-600" />
                      Target Audience Regions
                    </CardTitle>
                    <CardDescription>
                      Select specific areas where your event should be promoted.
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
                    <CardTitle>Event Assets</CardTitle>
                    <CardDescription>
                      Upload brochures, videos, or session recordings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form.Field name="attachmentIds">
                      {(field) => (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Recorded Session / Video</Label>
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
                          </div>
                          <div className="space-y-2 pt-2 border-t">
                            <Label>Brochure / Presentation</Label>
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
                                    {asset.mediaId ? (
                                      <FileVideo className="h-3 w-3" />
                                    ) : (
                                      <FileText className="h-3 w-3" />
                                    )}
                                    <span>Asset {idx + 1}</span>
                                  </div>
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
                            {initialData
                              ? "Update Event"
                              : isLive
                                ? "Save & Request Approval"
                                : "Publish Event"}
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
