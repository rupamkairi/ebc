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
import { User, Mail, Phone, MapPin } from "lucide-react";
import { BuyerDetails } from "@/store/enquiryStore";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { cn } from "@/lib/utils";

const buyerDetailsSchema = z.object({
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

type BuyerDetailsSchema = z.infer<typeof buyerDetailsSchema>;

interface NewBuyerDetailsFormProps {
  defaultValues?: Partial<BuyerDetails> | null;
  onChange: (values: BuyerDetails) => void;
}

export function NewBuyerDetailsForm({
  defaultValues,
  onChange,
}: NewBuyerDetailsFormProps) {
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

  useEffect(() => {
    if (defaultValues) {
      const currentValues = form.getValues();
      const hasChanged = (Object.keys(buyerDetailsSchema.shape) as Array<keyof typeof buyerDetailsSchema.shape>).some((key) => {
        return defaultValues[key] !== currentValues[key];
      });
      if (hasChanged) {
        form.reset(defaultValues as BuyerDetailsSchema);
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

  const inputClass = "h-14 bg-white dark:bg-white border-[#3D52A0]/20 rounded-xl focus:border-[#FFA500] focus:ring-[#FFA500]/10 font-medium text-[#3D52A0] transition-all duration-200 placeholder:text-[#3D52A0]/20";
  const labelClass = "text-[10px] font-black tracking-widest text-[#3D52A0] uppercase opacity-60 ml-1";

  return (
    <div className="rounded-[2.5rem] bg-white border-2 border-[#3D52A0]/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden group hover:border-[#3D52A0]/20 transition-all duration-500">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#3D52A0]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <User className="size-8 text-[#3D52A0]" />
            <h2 className="text-3xl font-black italic tracking-tighter text-[#3D52A0]">Your Details</h2>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-[#3D52A0] to-transparent rounded-full" />
        </div>

        <Form {...form}>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#3D52A0]/30" />
                        <Input placeholder="Enter Full Name" {...field} className={cn(inputClass, "pl-12")} />
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
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#3D52A0]/30" />
                        <Input placeholder="Enter Email" {...field} className={cn(inputClass, "pl-12")} />
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
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#3D52A0]/30" />
                        <Input placeholder="Enter Phone Number" {...field} className={cn(inputClass, "pl-12")} />
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
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>PinCode</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#3D52A0]/40 z-10" />
                        <PincodeSearchAutocomplete
                          value={field.value}
                          onRecordSelect={(record) => {
                            field.onChange(record.id);
                            form.setValue("pincode", record.pincode);
                          }}
                          className={cn(inputClass, "pl-12 z-20 relative bg-transparent")}
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
                      <MapPin className="absolute left-4 top-4 size-4 text-[#3D52A0]/30" />
                      <Textarea
                        placeholder="Enter Full Address..."
                        {...field}
                        className={cn(inputClass, "min-h-[120px] pl-12 py-4 resize-none")}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={labelClass}>Purpose (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Construction, Resale" {...field} className={inputClass} />
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
                    <FormLabel className={labelClass}>Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any specific details..." {...field} className={inputClass} />
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
