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
import {
  useUpdateEntityMutation,
  useEntitiesQuery,
} from "@/queries/entityQueries";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/upload/media-uploader";
import { toast } from "sonner";
import { Loader2, Save, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UpdateEntityRequest } from "@/types/entity";

export function EntitySettingsForm() {
  const { data: entities = [], isLoading: isLoadingEntity } =
    useEntitiesQuery();
  const updateEntityMutation = useUpdateEntityMutation();
  const entity = entities[0];

  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

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
      verificationDocuments: [] as string[],
    },
    onSubmit: async ({ value }) => {
      if (!entity) return;
      try {
        await updateEntityMutation.mutateAsync({
          id: entity.id,
          data: {
            ...value,
            verificationDocuments: uploadedDocs,
          } as UpdateEntityRequest,
        });
        toast.success("Business profile updated successfully!");
      } catch {
        toast.error("Failed to update business profile");
      }
    },
  });

  useEffect(() => {
    if (entity) {
      const docs = entity.verificationDocuments || [];
      setUploadedDocs(docs);
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
        verificationDocuments: docs,
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
                        onValueChange={field.handleChange}
                        placeholder="Search pincode..."
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-semibold">
                  Verification Documents
                </h3>
                <FileUploader
                  type="document"
                  variant="multiple"
                  label="Add Documents"
                  onUploadSuccess={(newFiles: FileUploadResponse[]) => {
                    const newIds = newFiles.map((f) => f.id);
                    setUploadedDocs((prev) => [...prev, ...newIds]);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {uploadedDocs.length === 0 ? (
                  <div className="col-span-full py-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
                    <FileText className="size-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No verification documents uploaded yet.
                    </p>
                  </div>
                ) : (
                  uploadedDocs.map((docId) => (
                    <div
                      key={docId}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="size-4 shrink-0 text-primary" />
                        <span className="text-xs font-medium truncate">
                          Document ID: {docId}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive"
                        onClick={() =>
                          setUploadedDocs((prev) =>
                            prev.filter((id) => id !== docId)
                          )
                        }
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Upload business registration, tax certificates, and other
                verification materials.
              </p>
            </div>
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
