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
import { USER_ROLE } from "@/constants/auth";
import { useCreateEntityMutation } from "@/queries/entityQueries";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Building2 } from "lucide-react";
import { CreateEntityRequest } from "@/types/entity";
import Container from "@/components/containers/containers";

export function OnboardingForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const createEntityMutation = useCreateEntityMutation();

  const role = user?.role?.toUpperCase();
  const isProductSeller = role === USER_ROLE.USER_PRODUCT_SELLER_ADMIN;
  const isServiceProvider = role === USER_ROLE.USER_SERVICE_PROVIDER_ADMIN;

  const form = useForm({
    defaultValues: {
      name: "",
      legalName: "",
      description: "",
      primaryContactNumber: user?.phoneNumber || "",
      secondaryContactNumber: "",
      contactEmail: user?.email || "",
      supportEmail: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      pincodeId: "",
      type: (isServiceProvider
        ? "SERVICE_PROVIDER"
        : "RETAILER") as CreateEntityRequest["type"],
      op_type: (isServiceProvider
        ? "SERVICE"
        : "PRODUCT") as CreateEntityRequest["op_type"],
    },
    onSubmit: async ({ value }) => {
      try {
        await createEntityMutation.mutateAsync(value);
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
          Complete your business profile
        </h1>
        <p className="text-muted-foreground">
          Set up your business identity to start reaching customers on E-CON.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Business Details</CardTitle>
          </div>
          <CardDescription>
            Provide accurate information for your business identification.
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
              <h3 className="text-sm font-medium border-b pb-2">Identity</h3>

              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Business name is required" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Display Name *</FieldLabel>
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
                    <FieldLabel>Legal Name</FieldLabel>
                    <Input
                      placeholder="e.g. Skyline Pvt Ltd"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="type">
                {(field) => (
                  <Field>
                    <FieldLabel>Business Type *</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as CreateEntityRequest["type"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="MANUFACTURER"
                          disabled={isServiceProvider}
                        >
                          Manufacturer
                        </SelectItem>
                        <SelectItem
                          value="WHOLESALER"
                          disabled={isServiceProvider}
                        >
                          Wholesaler
                        </SelectItem>
                        <SelectItem
                          value="RETAILER"
                          disabled={isServiceProvider}
                        >
                          Retailer
                        </SelectItem>
                        <SelectItem
                          value="SERVICE_PROVIDER"
                          disabled={isProductSeller}
                        >
                          Service Provider
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      This cannot be changed later.
                    </FieldDescription>
                  </Field>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel>About the Business</FieldLabel>
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
                Contact & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="primaryContactNumber">
                  {(field) => (
                    <Field>
                      <FieldLabel>Primary Phone</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="secondaryContactNumber">
                  {(field) => (
                    <Field>
                      <FieldLabel>Secondary Phone</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field name="contactEmail">
                {(field) => (
                  <Field>
                    <FieldLabel>Contact Email</FieldLabel>
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
                    !value ? "Location selection is required" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Area / Pincode *</FieldLabel>
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
                    <FieldLabel>Street Address</FieldLabel>
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
                    <FieldLabel>City</FieldLabel>
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
                    Launch My Business
                    <CheckCircle2 className="ml-2" size={18} />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By clicking launch, you agree to our provider terms and
                conditions.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
