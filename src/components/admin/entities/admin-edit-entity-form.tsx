"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Entity } from "@/types/entity";
import { useUpdateEntityMutation } from "@/queries/entityQueries";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ENTITY_TYPE, ITEM_TYPE, ENTITY_TYPE_LABELS, ITEM_TYPE_LABELS } from "@/constants/enums";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";

const entityFormSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  legalName: z.string().optional(),
  description: z.string().optional(),
  primaryContactNumber: z.string().optional(),
  secondaryContactNumber: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  supportEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  pincodeId: z.string().optional(),
  type: z.nativeEnum(ENTITY_TYPE).optional(),
  op_type: z.nativeEnum(ITEM_TYPE),
});

type EntityFormValues = z.infer<typeof entityFormSchema>;

interface AdminEditEntityFormProps {
  entity: Entity;
}

export function AdminEditEntityForm({ entity }: AdminEditEntityFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateEntityMutation();

  const form = useForm<EntityFormValues>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
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
      type: entity.type || undefined,
      op_type: entity.op_type || ITEM_TYPE.PRODUCT,
    },
  });

  const onSubmit = async (data: EntityFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: entity.id,
        data: {
          ...data,
          legalName: data.legalName || undefined,
          description: data.description || undefined,
          primaryContactNumber: data.primaryContactNumber || undefined,
          secondaryContactNumber: data.secondaryContactNumber || undefined,
          contactEmail: data.contactEmail || undefined,
          supportEmail: data.supportEmail || undefined,
          addressLine1: data.addressLine1 || undefined,
          addressLine2: data.addressLine2 || undefined,
          city: data.city || undefined,
          pincodeId: data.pincodeId || undefined,
        },
      });
      toast.success("Business details updated successfully");
      router.back();
    } catch (error: any) {
      toast.error(error.message || "Failed to update business details");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Basic Info</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter legal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ENTITY_TYPE).map((type) => (
                        <SelectItem key={type} value={type}>
                          {ENTITY_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="op_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operating type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ITEM_TYPE).map((type) => (
                        <SelectItem key={type} value={type}>
                          {ITEM_TYPE_LABELS[type as keyof typeof ITEM_TYPE_LABELS] || type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter business description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Contact & Address</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primaryContactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondaryContactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Secondary phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Support email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Address Line 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Address Line 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincodeId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3 pt-2">
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <PincodeSearchAutocomplete
                        value={field.value}
                        onValueChange={field.onChange}
                        initialRecord={entity.pincode || entity.pincodeId || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full md:w-auto"
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={updateMutation.isPending}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
