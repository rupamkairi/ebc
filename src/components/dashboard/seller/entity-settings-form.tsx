"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
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
    <Card className="border-[#445EB4] border-2 bg-[#F8F9FE] shadow-sm rounded-xl overflow-hidden p-6 md:p-10">
      <CardContent className="p-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-12"
        >
          {/* User Details Section */}
          <div className="space-y-6">
            <div className="border-b-2 border-[#FFA500]/30 pb-2 inline-block">
               <h2 className="text-2xl font-bold text-[#FFA500]">User Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Display Name</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="legalName">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Legal Business Name</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Acme Services Pvt Ltd"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <div className="md:col-span-2">
                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Business Description</Label>
                      <Textarea
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Tell customers about your business..."
                        className="min-h-[120px] border-[#173072]/30 focus-visible:ring-[#173072] resize-none bg-white"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="contactEmail">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Contact E-Mail</Label>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="contact@business.com"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="supportEmail">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Support E-Mail</Label>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="support@business.com"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="primaryContactNumber">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Phone Number</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="1234567890"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="secondaryContactNumber">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Secondary Phone Number</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="1234567890"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="space-y-6 pt-4">
            <div className="border-b-2 border-[#FFA500]/30 pb-2 inline-block">
               <h2 className="text-2xl font-bold text-[#FFA500]">Business Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <form.Field name="addressLine1">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Address</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Company Address"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="addressLine2">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">Landmark (Line 2)</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Nearby landmark"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="city">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide">City</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="City"
                      className="border-[#173072]/30 focus-visible:ring-[#173072] h-12 bg-white"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="pincodeId">
                {(field) => (
                  <div className="space-y-2 text-left flex flex-col justify-end">
                    <Label htmlFor={field.name} className="text-[#173072] text-xs font-bold uppercase tracking-wide mb-1">Pincode</Label>
                    <div className="border-[#173072]/30 rounded-md focus-within:ring-2 focus-within:ring-[#173072] bg-white w-full">
                       <PincodeSearchAutocomplete
                         value={field.state.value}
                         initialRecord={entity.pincode as PincodeRecord}
                         onValueChange={field.handleChange}
                         placeholder="123456"
                       />
                    </div>
                  </div>
                )}
              </form.Field>
            </div>
            
            {/* File Uploads inline */}
            <form.Field name="documents">
              {(field) => (
                <div className="mt-8">
                  <div className="flex justify-end mb-4">
                    <FileUploader
                      type="document"
                      variant="multiple"
                      label="Upload Files"
                      entityId={entity.id}
                      onUploadSuccess={(newFiles: FileUploadResponse[]) => {
                        const newIds = newFiles.map((f) => f.id);
                        field.handleChange([
                          ...(field.state.value || []),
                          ...newIds,
                        ]);
                        queryClient.invalidateQueries({
                          queryKey: entityKeys.all,
                        });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!field.state.value || field.state.value.length === 0 ? (
                      <div className="col-span-full py-12 text-center border-2 border-dashed border-[#445EB4]/50 rounded-xl bg-white/50 flex flex-col items-center justify-center">
                        <FileText className="size-10 mx-auto text-[#445EB4] opacity-80 mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-semibold text-[#445EB4]">
                          No Files Uploaded Yet
                        </p>
                      </div>
                    ) : (
                      (field.state.value as string[]).map((docId, idx) => (
                        <div
                          key={docId}
                          className="flex items-center justify-between p-4 border border-[#445EB4]/30 rounded-lg bg-white group shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-5 shrink-0 text-[#173072]" />
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
                                    <span className="text-sm font-semibold truncate text-[#173072]">
                                      {decodeURIComponent(fileName)}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground truncate">
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
                              className="size-8"
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
                              <FileText className="size-4 text-[#173072]" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10"
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
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex justify-end pt-8">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="bg-[#445EB4] hover:bg-[#2A3B7D] text-white px-8 h-12 text-sm font-semibold rounded-md shadow-md"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
