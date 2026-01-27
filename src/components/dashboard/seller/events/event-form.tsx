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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import {
  FileUploader,
} from "@/components/shared/upload/media-uploader";
import { useCreateEventMutation, useUpdateEventMutation } from "@/queries/conferenceHallQueries";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  Video, 
  MapPin, 
  Calendar, 
  FileVideo, 
  FileText, 
  X 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ConferenceHallEvent, CreateEventRequest, UpdateEventRequest } from "@/types/conference-hall";

interface EventFormProps {
  initialData?: ConferenceHallEvent;
  entityId: string;
}

export function EventForm({ initialData, entityId }: EventFormProps) {
  const router = useRouter();
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();

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
    },
    onSubmit: async ({ value }) => {
      try {
        if (initialData) {
          await updateEventMutation.mutateAsync({
            id: initialData.id,
            data: value as UpdateEventRequest,
          });
          toast.success("Event updated successfully!");
        } else {
          await createEventMutation.mutateAsync({
            ...(value as CreateEventRequest),
            entityId,
          });
          toast.success("Event created successfully! Coins deducted from wallet.");
        }
        router.push("/seller-dashboard/conference-hall/events");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save event";
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
                                <SelectItem value="LIVE">Live Session</SelectItem>
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
                                <Label htmlFor={field.name}>Meeting Link (Google Meet / Zoom / Teams)</Label>
                                <Input
                                  id={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  placeholder="https://meet.google.com/..."
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                  {field.state.value ? "You have provided a custom link. Buyers will see this upon joining." : "Leave blank to automatically generate a Google Meet link (requires Start/End time)."}
                                </p>
                              </div>
                            )}
                          </form.Field>
                          {!form.getFieldValue("meetingUrl") && (
                            <div className="p-3 border border-blue-100 bg-blue-50 rounded-md text-xs text-blue-700">
                              Choosing &quot;Remote&quot; without a custom link will automatically sync
                              this event with Google Calendar and generate a Meeting
                              Link once published.
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
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
                            {initialData ? "Update Event" : "Publish Event"}
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
