"use client";

import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
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
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import {
  ConferenceHallEvent,
  CreateEventRequest,
  EventAudience,
  UpdateEventRequest,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { PincodeRecord } from "@/types/region";
import { useForm } from "@tanstack/react-form";
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle,
  FileText,
  FileVideo,
  Globe,
  Loader2,
  MapPin,
  Plus,
  Save,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { StateSearchAutocomplete } from "@/components/autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "@/components/autocompletes/district-search-autocomplete";
import { cn } from "@/lib/utils";

interface EventFormProps {
  initialData?: ConferenceHallEvent;
  entityId: string;
}

export function EventForm({ initialData, entityId }: EventFormProps) {
  const router = useRouter();
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const publishEventMutation = usePublishEventMutation();

  const form = useForm({
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
      regions: (initialData?.eventRegions || []).map((r) => ({
        state: r.state || undefined,
        wholeState: r.wholeState,
        district: r.district || undefined,
        wholeDistrict: r.wholeDistrict,
        pincodeId: r.pincodeId || undefined,
      })) as EventAudience[],
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
            const payload = isApproved
              ? { isPublic: value.isPublic, isActive: initialData.isActive }
              : value;

            await updateEventMutation.mutateAsync({
              id: initialData.id,
              data: payload as UpdateEventRequest,
            });
            toast.success("Event updated successfully!");
          }
        } else {
          await createEventMutation.mutateAsync({
            ...(value as CreateEventRequest),
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
        ]}
      >
        {([type, isPhysical, isRemote]) => {
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
                    <RegionSelector
                      regions={form.getFieldValue("regions") || []}
                      onUpdate={(regions) => form.setFieldValue("regions", regions)}
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
                          500 Coins
                        </span>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-[10px] text-yellow-800">
                        By publishing, you agree that 500 coins will be deducted
                        from your entity wallet.
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

function RegionSelector({
  regions,
  onUpdate,
}: {
  regions: EventAudience[];
  onUpdate: (regions: EventAudience[]) => void;
}) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincodeSearch, setPincodeSearch] = useState("");

  const { data: records, isLoading } = usePincodeRecordsQuery({
    state: selectedState,
    district: selectedDistrict,
    pincode: pincodeSearch.length >= 3 ? pincodeSearch : undefined,
  });

  const addRegion = (record: PincodeRecord) => {
    // Check if already added
    if (regions.some((r) => r.pincodeId === record.id)) return;
    onUpdate([...regions, { pincodeId: record.id }]);
  };

  const addDistrict = () => {
    if (!selectedDistrict || !selectedState) return;
    if (
      regions.some(
        (r) => r.district === selectedDistrict && r.wholeDistrict === true
      )
    )
      return;
    onUpdate([
      ...regions,
      { state: selectedState, district: selectedDistrict, wholeDistrict: true },
    ]);
  };

  const addState = () => {
    if (!selectedState) return;
    if (regions.some((r) => r.state === selectedState && r.wholeState === true))
      return;
    onUpdate([...regions, { state: selectedState, wholeState: true }]);
  };

  const removeRegion = (index: number) => {
    onUpdate(regions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Step 1: Select State</Label>
          <div className="flex gap-2">
            <StateSearchAutocomplete
              value={selectedState}
              onValueChange={(val) => {
                setSelectedState(val);
                setSelectedDistrict("");
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!selectedState}
              onClick={addState}
              title="Target Whole State"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">
            Step 2: Select District (Optional)
          </Label>
          <div className="flex gap-2">
            <DistrictSearchAutocomplete
              state={selectedState}
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
              disabled={!selectedState}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!selectedDistrict}
              onClick={addDistrict}
              title="Target Whole District"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs font-semibold">
            Step 3: Search Pincode (Optional)
          </Label>
          <div className="relative">
            <Input
              placeholder="Start typing pincode (min 3 digits)..."
              value={pincodeSearch}
              onChange={(e) => setPincodeSearch(e.target.value)}
              disabled={!selectedState}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {records && records.length > 0 && selectedState && (
        <div className="border rounded-md max-h-40 overflow-y-auto bg-background">
          <div className="grid grid-cols-1 divide-y">
            {records.map((r) => {
              const isSelected = regions.some((reg) => reg.pincodeId === r.id);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2 px-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => !isSelected && addRegion(r)}
                >
                  <div className="text-sm">
                    <span className="font-bold">{r.pincode}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      {r.district}, {r.state}
                    </span>
                  </div>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground opacity-30" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Regions List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold flex items-center gap-2">
          Selected Targets ({regions.length})
        </h4>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-4 border rounded-lg bg-card">
          {regions.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No regions selected. This event will be visible generally.
            </p>
          )}
          {regions.map((region, idx) => (
            <Badge key={idx} variant="secondary" className="pl-3 pr-1 py-1 gap-2 border-primary/20 bg-primary/5">
              <span className="text-xs">
                {region.wholeState ? (
                  <>
                    <span className="font-bold text-[10px] text-emerald-600 mr-1 uppercase">Whole State:</span>
                    {region.state}
                  </>
                ) : region.wholeDistrict ? (
                  <>
                    <span className="font-bold text-[10px] text-blue-600 mr-1 uppercase">Whole District:</span>
                    {region.district} ({region.state})
                  </>
                ) : (
                  <>
                    <span className="font-bold text-[10px] text-primary/60 mr-1 uppercase">Pincode:</span>
                    {region.pincodeId?.substring(0, 8)}...
                  </>
                )}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-destructive/20 hover:text-destructive text-muted-foreground"
                onClick={() => removeRegion(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
