"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function UserLoginMobileOtpForm({
  className,
  role: initialRole,
  ...props
}: React.ComponentProps<"div"> & { role?: string }) {
  const router = useRouter();
  const { token, user, setToken, setUser } = useAuthStore();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login check
  useEffect(() => {
    if (token && user) {
      const role = user.role?.toUpperCase() || "";
      // Only redirect if it's a User/Seller role (not Admin trying to use user login,
      // though admins might want to be redirected too?
      // User instructions said "not to mix up".
      // If I am an Admin, I shouldn't be auto-redirected by the User Login form
      // unless I want to access the app.
      // Safer to redirect *only* if the role is relevant to this form?
      // Actually, if I am logged in, I am logged in.
      // Detailed logic:
      // If role is SELLER -> seller-dashboard
      // If role is BUYER/Default -> buyer-dashboard
      // If role is ADMIN -> admin-dashboard (Valid session is valid session)

      if (role.includes("SELLER")) {
        router.push("/seller-dashboard");
      } else if (role.includes("ADMIN") && !role.startsWith("USER_")) {
        // If an admin is here, they are authenticated. Redirect them to their place.
        router.push("/admin-dashboard");
      } else {
        router.push("/buyer-dashboard");
      }
    }
  }, [token, user, router]);

  const displayRole = initialRole
    ? initialRole.charAt(0).toUpperCase() + initialRole.slice(1)
    : "";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsLoading(true);
    try {
      // Ensure mobile has prefix if not present, though API docs didn't specify.
      // Let's stick to what user enters for now.
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
      if (role.includes("SELLER")) {
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
      <Card>
        <CardHeader>
          <CardTitle>Login as {displayRole || "User"}</CardTitle>
          <CardDescription>
            Enter your mobile below to login to your{" "}
            {displayRole.toLowerCase() || "user"} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendOtp}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground">
                      +91
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading} className="w-full">
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
                  <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                  <InputOTP
                    containerClassName="justify-around"
                    maxLength={6}
                    id="otp"
                    value={otp}
                    onChange={(val) => setOtp(val)}
                    required
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription className="text-center pt-2">
                    Enter the 6-digit code sent to +91{mobile}.
                  </FieldDescription>
                </Field>
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("phone")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Change Number
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
