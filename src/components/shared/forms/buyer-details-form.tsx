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

export const buyerDetailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be valid." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  pincode: z.string().min(4, { message: "Pincode is required." }),
  description: z.string().optional(),
  purpose: z.string().optional(),
});

export type BuyerDetailsSchema = z.infer<typeof buyerDetailsSchema>;

// Mock user fetch (simulate logged in user)
export const MOCK_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  address: "123 Main St, Tech City",
  pincode: "10001",
};

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
      phone: "",
      address: "",
      pincode: "",
      description: "",
      purpose: "",
    },
  });

  // Pre-fill form
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as BuyerDetailsSchema);
    } else {
      form.reset({
        ...MOCK_USER,
        description: "",
        purpose: "",
      });
    }
  }, [defaultValues, form]);

  // Sync to parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name) {
        onChange(value as BuyerDetails);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

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
                name="phone"
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
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="10001"
                          {...field}
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
