"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { BuyerDetails } from "@/store/enquiryStore";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";

export const buyerDetailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be valid." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  pincode: z.string().min(4, { message: "Pincode is required." }),
  pincodeDirectoryId: z
    .string()
    .min(1, { message: "Pincode selection is required." }),
  description: z.string().optional(),
  purpose: z.string().optional(),
});

export type BuyerDetailsSchema = z.infer<typeof buyerDetailsSchema>;

interface BuyerDetailsFormProps {
  defaultValues?: Partial<BuyerDetails> | null;
  onChange: (values: BuyerDetails) => void;
  title?: string;
}

export function BuyerDetailsForm({
  defaultValues,
  onChange,
  title = "Buyer Details",
}: BuyerDetailsFormProps) {
  const form = useForm<BuyerDetailsSchema>({
    resolver: zodResolver(buyerDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      pincode: "",
      pincodeDirectoryId: "",
      description: "",
      purpose: "",
    },
  });

  // Pre-fill form
  useEffect(() => {
    if (defaultValues) {
      // Only reset if values are different to avoid loop
      const currentValues = form.getValues();
      const hasChanged = (
        Object.keys(buyerDetailsSchema.shape) as Array<
          keyof typeof buyerDetailsSchema.shape
        >
      ).some((key) => {
        const dvValue = (defaultValues as Record<string, unknown>)[key];
        const cvValue = (currentValues as Record<string, unknown>)[key];
        return dvValue !== cvValue;
      });
      if (hasChanged) {
        form.reset(defaultValues as BuyerDetailsSchema);
      }
    }
  }, [defaultValues, form]);

  // Sync to parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name) {
        // Only trigger onChange if value is actually different from defaultValues
        // to avoid infinite loop with reset()
        const hasChanged =
          !defaultValues ||
          (
            Object.keys(buyerDetailsSchema.shape) as Array<
              keyof typeof buyerDetailsSchema.shape
            >
          ).some((key) => {
            const val = (value as Record<string, unknown>)[key];
            const dv = (defaultValues as Record<string, unknown>)[key];
            return val !== dv;
          });

        if (hasChanged) {
          onChange(value as BuyerDetails);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, defaultValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="+1 234 567 8900"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincodeDirectoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <PincodeSearchAutocomplete
                          value={field.value}
                          onRecordSelect={(record) => {
                            field.onChange(record.id);
                            form.setValue("pincode", record.pincode);
                          }}
                          className="pl-9"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full delivery address"
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Construction, Resale"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any specific details..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
