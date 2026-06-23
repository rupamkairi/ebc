"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminUser } from "@/types/auth";
import { useUpdateUserMutation } from "@/queries/adminQueries";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").or(z.literal("")),
  pincodeId: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  const password = data.password?.trim() || "";
  const confirmPassword = data.confirmPassword?.trim() || "";

  if (password.length > 0 && password.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 6,
      type: "string",
      inclusive: true,
      message: "Password must be at least 6 characters",
      path: ["password"],
    });
  }

  if (password.length > 0 && password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }

  if (confirmPassword.length > 0 && password.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter a new password before confirming it.",
      path: ["password"],
    });
  }
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface AdminEditUserFormProps {
  user: AdminUser;
}

export function AdminEditUserForm({ user }: AdminEditUserFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateUserMutation();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      pincodeId: user.pincodeId || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const password = data.password?.trim();
      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          pincodeId: data.pincodeId || undefined,
          ...(password ? { password } : {}),
        },
      });
      toast.success("User profile updated successfully");
      router.back();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user profile",
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" type="email" {...field} />
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
                  <Input placeholder="Enter phone number" {...field} />
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
                    initialRecord={user.pincode_directory || user.pincodeId || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leave blank to keep current password"
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Repeat new password"
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
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
