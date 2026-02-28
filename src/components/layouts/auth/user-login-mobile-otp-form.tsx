"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { USER_ROLE } from "@/constants/enums";

export function UserLoginMobileOtpForm({
  className,
  isDarkTheme,
  ...props
}: React.ComponentProps<"div"> & { role?: string; isDarkTheme?: boolean }) {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  // Handle redirect from register
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const phoneParam = params.get("phone");
      const otpSentParam = params.get("otp_sent");

      if (phoneParam) {
        // Remove +91 if present as the input group already has it
        const cleanPhone = phoneParam.replace(/^\+91/, "");
        setMobile(cleanPhone);
      }
      if (otpSentParam === "true") {
        setStep("otp");
      }
    }
  }, []);

  // Auto-login removed to prevent redirection traps during session issues.

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const phone = mobile.startsWith("+") ? mobile : `+91${mobile}`;
      await authService.sendOtp({ phone });
      toast.success("OTP sent successfully");
      setStep("otp");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const phone = mobile.startsWith("+") ? mobile : `+91${mobile}`;
      const { token } = await authService.verifyOtp({ phone, otp });
      setToken(token);

      // Fetch session to get user role
      const { user } = await authService.getSession();
      setUser(user);

      toast.success("Login successful");

      // Redirection logic
      const role = user.role?.toUpperCase() || "";
      if (
        role === USER_ROLE.UNASSIGNED ||
        role.includes("SELLER") ||
        role.includes("SERVICE")
      ) {
        router.push("/seller-dashboard");
      } else if (role.includes("ADMIN") && !role.startsWith("USER_")) {
        router.push("/admin-dashboard");
      } else {
        router.push("/buyer-dashboard");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card
        className={cn(isDarkTheme && "border-none bg-transparent shadow-none")}
      >
        <CardHeader className={cn(isDarkTheme && "px-0")}>
          <CardTitle
            className={cn(
              isDarkTheme && "text-white text-3xl font-medium tracking-wide",
            )}
          >
            Login To Your Account
          </CardTitle>
          <CardDescription className={cn(isDarkTheme && "text-white/70")}>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className={cn(
                "hover:underline",
                isDarkTheme ? "text-[#FFA500]" : "text-primary",
              )}
            >
              register
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(isDarkTheme && "px-0 mt-6")}>
          <div className="space-y-6">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp}>
                <FieldGroup className={cn(isDarkTheme && "gap-6")}>
                  <Field>
                    <div className="flex gap-0 w-full">
                      <span
                        className={cn(
                          "flex items-center px-4 rounded-l-md text-sm font-medium",
                          isDarkTheme
                            ? "bg-white/20 text-white border-none shrink-0"
                            : "border rounded-md bg-muted text-muted-foreground",
                        )}
                      >
                        +91
                      </span>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Phone Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        className={cn(
                          isDarkTheme &&
                            "bg-white/10 border-none text-white placeholder:text-white/60 rounded-r-md rounded-l-none h-12 focus-visible:ring-1 focus-visible:ring-white/30",
                        )}
                      />
                    </div>
                  </Field>
                  <Field className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full h-11 text-base font-semibold",
                        isDarkTheme &&
                          "bg-[#FFA500] hover:bg-[#E69500] text-white rounded-md shadow-lg shadow-[#FFA500]/20",
                      )}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send OTP
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <FieldGroup>
                  <Field>
                    <FieldLabel
                      htmlFor="otp"
                      className={cn(isDarkTheme && "text-white")}
                    >
                      Verification code
                    </FieldLabel>
                    <InputOTP
                      containerClassName="justify-around"
                      maxLength={6}
                      id="otp"
                      value={otp}
                      onChange={(val) => setOtp(val)}
                      required
                    >
                      <InputOTPGroup
                        className={cn(
                          "gap-2.5 *:data-[slot=input-otp-slot]:rounded-md",
                          isDarkTheme
                            ? "*:data-[slot=input-otp-slot]:border-none *:data-[slot=input-otp-slot]:bg-white/10 *:data-[slot=input-otp-slot]:text-white *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 transition-all focus-within:ring-white/30"
                            : "*:data-[slot=input-otp-slot]:border",
                        )}
                      >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <FieldDescription
                      className={cn(
                        "text-center pt-2",
                        isDarkTheme && "text-white/70",
                      )}
                    >
                      Enter the 6-digit code sent to +91{mobile}.
                    </FieldDescription>
                  </Field>
                  <div className="flex flex-col gap-4 mt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full h-11 text-base font-semibold",
                        isDarkTheme &&
                          "bg-[#FFA500] hover:bg-[#E69500] text-white rounded-md shadow-lg shadow-[#FFA500]/20",
                      )}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("phone")}
                      disabled={isLoading}
                      className={cn(
                        "w-full",
                        isDarkTheme &&
                          "text-white hover:text-white hover:bg-white/10",
                      )}
                    >
                      Change Number
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {!isDarkTheme && (
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      )}
    </div>
  );
}
