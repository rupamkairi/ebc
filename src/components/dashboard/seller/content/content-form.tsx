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
import { toast } from "sonner";
import { Loader2, Save, X, File } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Content,
  CreateContentRequest,
  UpdateContentRequest,
} from "@/types/conference-hall";

interface ContentFormProps {
  initialData?: Content;
  entityId: string;
}

export function ContentForm({ initialData, entityId }: ContentFormProps) {
  const router = useRouter();
  const createContentMutation = useCreateContentMutation();
  const updateContentMutation = useUpdateContentMutation();

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      attachmentIds: [] as { mediaId?: string; documentId?: string }[],
    },
    onSubmit: async ({ value }) => {
      try {
        if (initialData) {
          await updateContentMutation.mutateAsync({
            id: initialData.id,
            data: {
              name: value.name,
              description: value.description,
              isActive: value.isActive,
            } as UpdateContentRequest,
          });
          toast.success("Content updated successfully!");
        } else {
          await createContentMutation.mutateAsync({
            ...(value as CreateContentRequest),
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
      <form.Subscribe selector={(state) => [state.values.isActive]}>
        {() => {
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
                          <div className="space-y-2 pt-2 border-t">
                            <Label>Media / Video</Label>
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
