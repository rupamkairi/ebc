"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { NotificationChannelType } from "@/types/notification";
import {
  useAddChannelMutation,
  useVerifyChannelMutation,
} from "@/queries/notificationQueries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingChannels: { type: NotificationChannelType }[];
}

export function AddChannelModal({
  isOpen,
  onClose,
  existingChannels,
}: AddChannelModalProps) {
  const [step, setStep] = useState<"INPUT" | "VERIFY">("INPUT");
  const [createdChannelId, setCreatedChannelId] = useState<string | null>(null);

  const addChannelMutation = useAddChannelMutation();
  const verifyChannelMutation = useVerifyChannelMutation();

  const channelLimits = {
    EMAIL: 2,
    PHONE: 2,
    PUSH: 1,
    WHATSAPP: 1,
  };

  const getChannelCount = (type: NotificationChannelType) => {
    return existingChannels.filter((c) => c.type === type).length;
  };

  const form = useForm({
    defaultValues: {
      type: "" as NotificationChannelType,
      destination: "",
    },
    onSubmit: async ({ value }) => {
      const count = getChannelCount(value.type);
      if (count >= channelLimits[value.type]) {
        toast.error(`You have reached the limit for ${value.type} channels.`);
        return;
      }

      try {
        const channel = await addChannelMutation.mutateAsync({
          type: value.type,
          destination: value.destination,
          name: value.destination || value.type, // Use destination as name, fallback to type if empty (for PUSH)
        });
        setCreatedChannelId(channel.id);
        setStep("VERIFY");
      } catch {
        toast.error("Failed to add channel. Please try again.");
      }
    },
  });

  const otpForm = useForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: async ({ value }) => {
      if (!createdChannelId) return;
      try {
        await verifyChannelMutation.mutateAsync({
          id: createdChannelId,
          otp: value.otp,
        });
        onClose();
        reset();
      } catch {
        // Error toast handled in mutation
      }
    },
  });

  const reset = () => {
    setStep("INPUT");
    setCreatedChannelId(null);
    form.reset();
    otpForm.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (step === "VERIFY" && !open) {
      toast.info(
        "Please verify your channel to continue or cancel explicitly.",
      );
      return;
    }
    if (!open) {
      onClose();
      reset();
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "INPUT" ? "Add Notification Channel" : "Verify Channel"}
          </DialogTitle>
          <DialogDescription>
            {step === "INPUT"
              ? "Choose how you want to receive notifications."
              : "Enter the verification code sent to your destination."}
          </DialogDescription>
        </DialogHeader>

        {step === "INPUT" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 py-4"
          >
            {/* 1. Channel Type Selection */}
            <form.Field name="type">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="channel-type">Channel Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val as NotificationChannelType);
                      // Clear destination when type changes to avoid validation mismatch
                      form.setFieldValue("destination", "");
                    }}
                  >
                    <SelectTrigger id="channel-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="EMAIL"
                        disabled={
                          getChannelCount("EMAIL") >= channelLimits.EMAIL
                        }
                      >
                        Email ({getChannelCount("EMAIL")}/{channelLimits.EMAIL})
                      </SelectItem>
                      <SelectItem
                        value="PHONE"
                        disabled={
                          getChannelCount("PHONE") >= channelLimits.PHONE
                        }
                      >
                        Phone SMS ({getChannelCount("PHONE")}/
                        {channelLimits.PHONE})
                      </SelectItem>
                      <SelectItem
                        value="WHATSAPP"
                        disabled={
                          getChannelCount("WHATSAPP") >= channelLimits.WHATSAPP
                        }
                      >
                        WhatsApp ({getChannelCount("WHATSAPP")}/
                        {channelLimits.WHATSAPP})
                      </SelectItem>
                      <SelectItem
                        value="PUSH"
                        disabled={getChannelCount("PUSH") >= channelLimits.PUSH}
                      >
                        Web Push ({getChannelCount("PUSH")}/{channelLimits.PUSH}
                        )
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            {/* 2. Destination Input - Conditional based on type */}
            <form.Subscribe selector={(state) => [state.values.type]}>
              {([type]) => {
                if (!type || type === "PUSH") return null;

                return (
                  <form.Field
                    name="destination"
                    validators={{
                      onChange: ({ value }) => {
                        if (type === "EMAIL" && !validateEmail(value)) {
                          return "Invalid email address";
                        }
                        if (
                          (type === "PHONE" || type === "WHATSAPP") &&
                          !validatePhone(value)
                        ) {
                          return "Invalid phone number (+91...)";
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="destination">
                          {type === "EMAIL" ? "Email Address" : "Phone Number"}
                        </Label>

                        {type === "EMAIL" ? (
                          <Input
                            id="email-destination"
                            type="email"
                            placeholder="user@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        ) : (
                          <Input
                            id="phone-destination"
                            type="tel"
                            placeholder="+91..."
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}

                        {field.state.meta.errors && (
                          <p className="text-xs text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                );
              }}
            </form.Subscribe>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting, state.values] as const
                }
              >
                {([canSubmit, isSubmitting, values]) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit ||
                      isSubmitting ||
                      !values.type ||
                      (values.type !== "PUSH" && !values.destination) ||
                      addChannelMutation.isPending
                    }
                  >
                    {(isSubmitting || addChannelMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send OTP
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              otpForm.handleSubmit();
            }}
            className="space-y-6 py-4 flex flex-col items-center"
          >
            <otpForm.Field name="otp">
              {(field) => (
                <div className="space-y-4 flex flex-col items-center">
                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-xs text-muted-foreground">
                    Code sent to {form.getFieldValue("destination")}
                  </p>
                </div>
              )}
            </otpForm.Field>

            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setStep("INPUT")}
              >
                Back
              </Button>
              <otpForm.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting, state.values] as const
                }
              >
                {([canSubmit, isSubmitting, values]) => (
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      !canSubmit ||
                      isSubmitting ||
                      values.otp.length < 6 ||
                      verifyChannelMutation.isPending
                    }
                  >
                    {(isSubmitting || verifyChannelMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify
                  </Button>
                )}
              </otpForm.Subscribe>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
