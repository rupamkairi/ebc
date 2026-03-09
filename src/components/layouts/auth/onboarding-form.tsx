"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { useAuthStore } from "@/store/authStore";
import {
  USER_ROLE,
  ENTITY_TYPE,
  ITEM_TYPE,
  ENTITY_TYPE_LABELS,
} from "@/constants/enums";
import { useCreateEntityMutation } from "@/queries/entityQueries";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Building2 } from "lucide-react";
import { CreateEntityRequest } from "@/types/entity";
import Container from "@/components/ui/containers";
import { useLanguage } from "@/hooks/useLanguage";

export function OnboardingForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const createEntityMutation = useCreateEntityMutation();
  const { t } = useLanguage();

  const role = user?.role?.toUpperCase();
  const isProductSeller = role === USER_ROLE.USER_PRODUCT_SELLER_ADMIN;
  const isServiceProvider = role === USER_ROLE.USER_SERVICE_PROVIDER_ADMIN;

  const form = useForm({
    defaultValues: {
      name: "",
      legalName: "",
      description: "",
      primaryContactNumber:
        ((user as { phoneNumber?: string })?.phoneNumber || "").replace(/^\+91/, ""),
      secondaryContactNumber: "",
      contactEmail: user?.email || "",
      supportEmail: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      pincodeId: "",
      type: (isServiceProvider
        ? ENTITY_TYPE.SERVICE_PROVIDER
        : undefined) as CreateEntityRequest["type"],
      op_type: (isServiceProvider
        ? ITEM_TYPE.SERVICE
        : ITEM_TYPE.PRODUCT) as CreateEntityRequest["op_type"],
    },
    onSubmit: async ({ value }) => {
      try {
        await createEntityMutation.mutateAsync({
          ...value,
          primaryContactNumber: value.primaryContactNumber ? `+91${value.primaryContactNumber}` : "",
          secondaryContactNumber: value.secondaryContactNumber ? `+91${value.secondaryContactNumber}` : "",
        });
        toast.success("Business profile created successfully!");
        router.push("/seller-dashboard");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create business profile";
        toast.error(errorMessage);
      }
    },
  });

  return (
    <Container size="md" className="py-16">
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("complete_business_profile")}
        </h1>
        <p className="text-muted-foreground">
          {t("business_identity_description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t("business_details")}</CardTitle>
          </div>
          <CardDescription>
            {t("business_identification_info")}
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
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">{t("identity")}</h3>

              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? t("business_name_required") : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>{t("display_name")} *</FieldLabel>
                    <Input
                      placeholder="e.g. Skyline Constructions"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError
                      errors={[
                        { message: field.state.meta.errors[0]?.toString() },
                      ]}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="legalName">
                {(field) => (
                  <Field>
                    <FieldLabel>{t("legal_name")}</FieldLabel>
                    <Input
                      placeholder="e.g. Skyline Pvt Ltd"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="type"
                validators={{
                  onChange: ({ value }) =>
                    !value ? t("business_type_required") : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>{t("business_type")} *</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as CreateEntityRequest["type"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("select_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={ENTITY_TYPE.MANUFACTURER}
                          disabled={isServiceProvider}
                        >
                          {ENTITY_TYPE_LABELS[ENTITY_TYPE.MANUFACTURER]}
                        </SelectItem>
                        <SelectItem
                          value={ENTITY_TYPE.WHOLESALER}
                          disabled={isServiceProvider}
                        >
                          {ENTITY_TYPE_LABELS[ENTITY_TYPE.WHOLESALER]}
                        </SelectItem>
                        <SelectItem
                          value={ENTITY_TYPE.RETAILER}
                          disabled={isServiceProvider}
                        >
                          {ENTITY_TYPE_LABELS[ENTITY_TYPE.RETAILER]}
                        </SelectItem>
                        <SelectItem
                          value={ENTITY_TYPE.SERVICE_PROVIDER}
                          disabled={isProductSeller}
                        >
                          {ENTITY_TYPE_LABELS[ENTITY_TYPE.SERVICE_PROVIDER]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={[
                        { message: field.state.meta.errors[0]?.toString() },
                      ]}
                    />
                    <FieldDescription>
                      {t("cannot_change_later")}
                    </FieldDescription>
                  </Field>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel>{t("about_business")}</FieldLabel>
                    <Textarea
                      placeholder="Describe your services or products..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">
                {t("contact_location")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="primaryContactNumber">
                  {(field) => (
                    <Field>
                      <FieldLabel>{t("primary_phone")}</FieldLabel>
                      <div className="flex gap-0 w-full">
                        <span className="flex items-center px-4 rounded-l-md text-sm font-medium border bg-muted text-muted-foreground shrink-0">
                          +91
                        </span>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={field.state.value.replace(/\D/g, "").slice(0, 10)}
                          onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="rounded-l-none"
                        />
                      </div>
                      <FieldDescription>
                        Enter 10-digit mobile number (digits only)
                      </FieldDescription>
                    </Field>
                  )}
                </form.Field>
                <form.Field name="secondaryContactNumber">
                  {(field) => (
                    <Field>
                      <FieldLabel>{t("secondary_phone")}</FieldLabel>
                      <div className="flex gap-0 w-full">
                        <span className="flex items-center px-4 rounded-l-md text-sm font-medium border bg-muted text-muted-foreground shrink-0">
                          +91
                        </span>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={field.state.value.replace(/\D/g, "").slice(0, 10)}
                          onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="rounded-l-none"
                        />
                      </div>
                      <FieldDescription>
                        Enter 10-digit mobile number (digits only)
                      </FieldDescription>
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field name="contactEmail">
                {(field) => (
                  <Field>
                    <FieldLabel>{t("contact_email")}</FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="pincodeId"
                validators={{
                  onChange: ({ value }) =>
                    !value ? t("location_required") : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>{t("area_pincode")} *</FieldLabel>
                    <PincodeSearchAutocomplete
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val as string)}
                    />
                    <FieldError
                      errors={[
                        { message: field.state.meta.errors[0]?.toString() },
                      ]}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="addressLine1">
                {(field) => (
                  <Field>
                    <FieldLabel>{t("street_address")}</FieldLabel>
                    <Input
                      placeholder="Bldg No, Street Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="city">
                {(field) => (
                  <Field>
                    <FieldLabel>{t("city")}</FieldLabel>
                    <Input
                      placeholder="e.g. Mumbai"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="pt-4 flex flex-col items-center gap-4">
              <Button
                type="submit"
                disabled={createEntityMutation.isPending}
                className="w-full"
              >
                {createEntityMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    {t("launch_business")}
                    <CheckCircle2 className="ml-2" size={18} />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t("provider_terms_agreement")}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
