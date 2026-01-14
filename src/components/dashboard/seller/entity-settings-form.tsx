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
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { PincodeRecord } from "@/types/region";
import {
  useUpdateEntityMutation,
  useEntitiesQuery,
  entityKeys,
} from "@/queries/entityQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { toast } from "sonner";
import { Loader2, Save, FileText, X } from "lucide-react";
import { useEffect } from "react";
import { UpdateEntityRequest } from "@/types/entity";

export function EntitySettingsForm() {
  const { data: entities = [], isLoading: isLoadingEntity } =
    useEntitiesQuery();
  const updateEntityMutation = useUpdateEntityMutation();
  const queryClient = useQueryClient();
  const entity = entities[0];

  const form = useForm({
    defaultValues: {
      name: "",
      legalName: "",
      description: "",
      primaryContactNumber: "",
      secondaryContactNumber: "",
      contactEmail: "",
      supportEmail: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      pincodeId: "",
      documents: [] as string[],
    },
    onSubmit: async ({ value }) => {
      if (!entity) return;
      try {
        await updateEntityMutation.mutateAsync({
          id: entity.id,
          data: value as UpdateEntityRequest,
        });
        toast.success("Business profile updated successfully!");
      } catch {
        toast.error("Failed to update business profile");
      }
    },
  });

  useEffect(() => {
    if (entity) {
      form.reset({
        name: entity.name || "",
        legalName: entity.legalName || "",
        description: entity.description || "",
        primaryContactNumber: entity.primaryContactNumber || "",
        secondaryContactNumber: entity.secondaryContactNumber || "",
        contactEmail: entity.contactEmail || "",
        supportEmail: entity.supportEmail || "",
        addressLine1: entity.addressLine1 || "",
        addressLine2: entity.addressLine2 || "",
        city: entity.city || "",
        pincodeId: entity.pincodeId || "",
        documents: [
          ...((entity.documents as string[]) || []),
          ...(entity.entityAttachments?.map((a) => a.document.id) || []),
        ].filter((id, index, self) => self.indexOf(id) === index),
      });
    }
  }, [entity, form]);

  if (isLoadingEntity) {
    return (
      <Card className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (!entity) {
    return (
      <Card className="p-12 text-center text-muted-foreground">
        No business entity found for your account.
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Details</CardTitle>
        <CardDescription>
          Update your business information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Display Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="legalName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Legal Business Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Acme Services Pvt Ltd"
                  />
                </div>
              )}
            </form.Field>

            <div className="md:col-span-2">
              <form.Field name="description">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Business Description</Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Tell customers about your business..."
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="contactEmail">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Contact Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="contact@business.com"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="supportEmail">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Support Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="support@business.com"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="primaryContactNumber">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Primary Phone</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="+91"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="secondaryContactNumber">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Secondary Phone</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="+91"
                  />
                </div>
              )}
            </form.Field>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">
                Business Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="addressLine1">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Address Line 1</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="addressLine2">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Address Line 2</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="city">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>City</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="pincodeId">
                  {(field) => (
                    <div className="space-y-2 text-left">
                      <Label htmlFor={field.name}>Pincode</Label>
                      <PincodeSearchAutocomplete
                        value={field.state.value}
                        initialRecord={entity.pincode as PincodeRecord}
                        onValueChange={field.handleChange}
                        placeholder="Search pincode..."
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <form.Field name="documents">
              {(field) => (
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-sm font-semibold">
                      Verification Documents
                    </h3>
                    <FileUploader
                      type="document"
                      variant="multiple"
                      label="Add Documents"
                      entityId={entity.id}
                      onUploadSuccess={(newFiles: FileUploadResponse[]) => {
                        const newIds = newFiles.map((f) => f.id);
                        field.handleChange([
                          ...(field.state.value || []),
                          ...newIds,
                        ]);
                        // Invalidate query to get updated attachments from backend
                        queryClient.invalidateQueries({
                          queryKey: entityKeys.all,
                        });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!field.state.value || field.state.value.length === 0 ? (
                      <div className="col-span-full py-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
                        <FileText className="size-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No verification documents uploaded yet.
                        </p>
                      </div>
                    ) : (
                      (field.state.value as string[]).map((docId, idx) => (
                        <div
                          key={docId}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="size-4 shrink-0 text-primary" />
                            <div className="flex flex-col">
                              {(() => {
                                const attachment =
                                  entity.entityAttachments?.find(
                                    (a) => a.document.id === docId
                                  );
                                const doc = attachment?.document;
                                const fileName =
                                  doc?.name ||
                                  doc?.key
                                    .split("/")
                                    .pop()
                                    ?.split("-")
                                    .slice(2)
                                    .join("-") ||
                                  doc?.key.split("/").pop() ||
                                  `Document ${idx + 1}`;

                                return (
                                  <>
                                    <span className="text-xs font-semibold truncate text-primary">
                                      {decodeURIComponent(fileName)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground truncate">
                                      {doc
                                        ? `${(
                                            parseInt(doc.sizeBytes) / 1024
                                          ).toFixed(1)} KB`
                                        : `ID: ${docId}`}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => {
                                const attachment =
                                  entity.entityAttachments?.find(
                                    (a) => a.document.id === docId
                                  );
                                const downloadUrl =
                                  attachment?.document.url ||
                                  `${
                                    process.env.NEXT_PUBLIC_API_URL ||
                                    "http://localhost:10000/api"
                                  }/attachment/document/url/${docId}`;

                                window.open(downloadUrl, "_blank");
                              }}
                            >
                              <FileText className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() =>
                                field.handleChange(
                                  (field.state.value as string[]).filter(
                                    (id) => id !== docId
                                  )
                                )
                              }
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Upload business registration, tax certificates, and other
                    verification materials.
                  </p>
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex justify-end pt-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Entity Details
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
