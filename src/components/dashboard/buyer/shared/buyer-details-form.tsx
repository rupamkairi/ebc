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
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { BuyerDetails } from "@/store/enquiryStore";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { cn } from "@/lib/utils";
import { useSessionQuery } from "@/queries/authQueries";
import { usePrefetchBuyerDetails } from "@/hooks/usePrefetchBuyerDetails";

const buyerDetailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().length(10, { message: "Phone number must be exactly 10 digits." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  pincode: z.string().min(4, { message: "Pincode is required." }),
  pincodeDirectoryId: z
    .string()
    .min(1, { message: "Pincode selection is required." }),
  description: z.string().optional(),
  purpose: z.string().optional(),
  expectedDate: z.string().optional(),
});

type BuyerDetailsSchema = z.infer<typeof buyerDetailsSchema>;

interface BuyerDetailsFormProps {
  defaultValues?: Partial<BuyerDetails> | null;
  onChange: (values: BuyerDetails) => void;
  title?: string;
  showExpectedDate?: boolean;
}

export function BuyerDetailsForm({
  defaultValues,
  onChange,
  title = "Your Details",
  showExpectedDate = false,
}: BuyerDetailsFormProps) {
  const { data: session } = useSessionQuery();
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
      expectedDate: "",
    },
  });

  // Use the shared prefetch hook to fill form from session
  usePrefetchBuyerDetails(
    onChange,
    defaultValues as BuyerDetails | null,
    session?.user,
  );

  // Prefill with session if no defaultValues
  useEffect(() => {
    if (session?.user && !defaultValues) {
      form.reset({
        ...form.getValues(),
        name: session.user.name || "",
        email: session.user.email || "",
        phoneNumber: session.user.phone || "",
      });
    }
  }, [session, defaultValues, form]);

  useEffect(() => {
    if (defaultValues) {
      const currentValues = form.getValues();
      const hasChanged = (
        Object.keys(buyerDetailsSchema.shape) as Array<
          keyof typeof buyerDetailsSchema.shape
        >
      ).some((key) => {
        return defaultValues[key] !== currentValues[key];
      });
      if (hasChanged) {
        form.reset({
          ...currentValues,
          ...defaultValues,
        } as BuyerDetailsSchema);
      }
    }
  }, [defaultValues, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name) {
        onChange(value as BuyerDetails);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const hasSession = !!session?.user;

  const inputClass =
    "h-12 bg-white dark:bg-white border-primary/20 rounded-xl focus:border-secondary focus:ring-secondary/10 font-medium text-primary transition-all duration-200 placeholder:text-primary/20";
  const labelClass =
    "text-xs font-semibold tracking-wider text-primary opacity-80 ml-1";

  return (
    <div className="rounded-2xl bg-white border-2 border-primary/10 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="size-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-primary">
              {title}
            </h2>
          </div>
          <div className="h-0.5 w-24 bg-linear-to-r from-primary to-transparent rounded-full" />
        </div>

        <Form {...form}>
          <form className="space-y-5">
            {/* Single column layout for all fields */}
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/30" />
                        <Input
                          placeholder="Enter Full Name"
                          {...field}
                          className={cn(inputClass, "pl-10")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/30" />
                        <Input
                          placeholder="Enter Email"
                          {...field}
                          className={cn(inputClass, "pl-10")}
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
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/30" />
                        <div className="flex w-full">
                          <span className="flex items-center px-3 rounded-l-xl text-sm font-medium bg-primary/10 border border-r-0 border-primary/20 text-primary shrink-0">
                            +91
                          </span>
                          <Input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            {...field}
                            value={field.value.replace(/\D/g, "").slice(0, 10)}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className={cn(
                              inputClass,
                              "pl-3 rounded-l-none",
                              hasSession && "opacity-70 cursor-not-allowed",
                            )}
                            disabled={hasSession}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-xs text-primary/60">
                      Enter 10-digit mobile number (digits only, no spaces or special characters)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincodeDirectoryId"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>PinCode</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/40 z-10" />
                        <PincodeSearchAutocomplete
                          value={field.value}
                          onRecordSelect={(record) => {
                            field.onChange(record.id);
                            form.setValue("pincode", record.pincode);
                          }}
                          className={cn(
                            inputClass,
                            "pl-10 z-20 relative bg-transparent",
                          )}
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
                <FormItem className="space-y-1">
                  <FormLabel className={labelClass}>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-primary/30" />
                      <Textarea
                        placeholder="Enter Full Address..."
                        {...field}
                        className={cn(
                          inputClass,
                          "min-h-[80px] pl-10 py-3 resize-none",
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-5">
              {showExpectedDate && (
                <FormField
                  control={form.control}
                  name="expectedDate"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={labelClass}>
                        Expected Delivery Date
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary/30" />
                          <Input
                            type="date"
                            {...field}
                            className={cn(inputClass, "pl-10")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>
                      Purpose (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Construction, Resale"
                        {...field}
                        className={inputClass}
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
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>
                      Additional Requirements (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any specific details..."
                        {...field}
                        className={inputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
