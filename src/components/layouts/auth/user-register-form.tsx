"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { USER_ROLE, ITEM_TYPE } from "@/constants/enums";

import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { useLanguage } from "@/hooks/useLanguage";

export function UserRegisterForm({
  className,
  isDarkTheme,
  ...props
}: React.ComponentProps<"div"> & { isDarkTheme?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const { setToken, setUser } = useAuthStore();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincodeId, setPincodeId] = useState("");
  
  // Initialize type from search params if provided, otherwise default to buyer
  const initialType = requestedType?.toUpperCase() === "SELLER" 
    ? USER_ROLE.USER_PRODUCT_SELLER_ADMIN
    : requestedType?.toUpperCase() === "SERVICE"
    ? USER_ROLE.USER_SERVICE_PROVIDER_ADMIN
    : requestedType?.toUpperCase() === "BUYER"
    ? USER_ROLE.USER_BUYER_ADMIN
    : USER_ROLE.USER_BUYER_ADMIN;

  const [type, setType] = useState<string>(initialType);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"info" | "otp">("info");
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.length < 2) {
      toast.error("Please enter a valid name");
      return;
    }
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!pincodeId) {
      toast.error("Please select a pincode");
      return;
    }

    setIsLoading(true);
    try {
      const phone = `+91${mobile}`;
      const response = await authService.sendOtp({
        phone,
        name,
        type,
        pincodeId,
      });

      if (response.isNewUser === false) {
        toast.info("User already exists. Redirecting to login...");
        router.push(
          `/auth/login?phone=${encodeURIComponent(phone)}&otp_sent=true`,
        );
        return;
      }

      setIsNewUser(true);
      toast.success("OTP sent successfully");
      setStep("otp");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register";
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
      const phone = `+91${mobile}`;
      const { token } = await authService.verifyOtp({ phone, otp });
      setToken(token);

      const { user } = await authService.getSession();
      setUser(user);

      toast.success("Registration successful");

      // Redirection logic
      const role = user.role?.toUpperCase() || "";
      if (isNewUser && (role.includes("SELLER") || role.includes("SERVICE"))) {
        router.push("/auth/register/onboarding");
      } else if (
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
            {t("create_account")}
          </CardTitle>
          <CardDescription className={cn(isDarkTheme && "text-white/70")}>
            {t("already_have_account")}{" "}
            <Link
              href="/auth/login"
              className={cn(
                "hover:underline font-semibold",
                isDarkTheme ? "text-secondary" : "text-primary",
              )}
            >
              {t("login")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(isDarkTheme && "px-0 mt-6")}>
          <div className="space-y-6">
            {step === "info" ? (
              <form onSubmit={handleSendOtp}>
                <FieldGroup className={cn(isDarkTheme && "gap-6")}>
                  <Field>
                    <Input
                      id="name"
                      placeholder={t("full_name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={cn(
                        isDarkTheme &&
                          "bg-white/10 border-none text-white placeholder:text-white/60 rounded-md h-12 focus-visible:ring-1 focus-visible:ring-white/30",
                      )}
                    />
                  </Field>
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
                        placeholder="Enter 10-digit mobile number"
                        value={mobile}
                        onChange={handleMobileChange}
                        required
                        className={cn(
                          isDarkTheme &&
                            "bg-white/10 border-none text-white placeholder:text-white/60 rounded-r-md rounded-l-none h-12 focus-visible:ring-1 focus-visible:ring-white/30",
                        )}
                      />
                    </div>
                    <FieldDescription
                      className={cn(
                        "text-xs mt-1",
                        isDarkTheme && "text-white/60",
                      )}
                    >
                      Enter 10-digit mobile number (digits only, no spaces or special characters)
                    </FieldDescription>
                  </Field>
                  <Field>
                    <PincodeSearchAutocomplete
                      value={pincodeId}
                      onValueChange={setPincodeId}
                      placeholder={t("search_pincode")}
                      label={t("select_pincode")}
                      className={cn(
                        isDarkTheme &&
                          "bg-white/10 border-none text-white placeholder:text-white/60 rounded-md h-12 focus-visible:ring-1 focus-visible:ring-white/30 [&>button]:h-12 [&>button]:bg-white/10 [&>button]:border-none [&>button]:text-white",
                      )}
                    />
                  </Field>
                  <Field>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger
                        id="type"
                        className={cn(
                          isDarkTheme &&
                            "h-12 bg-white/10 border-none text-white focus:ring-1 focus:ring-white/30",
                        )}
                      >
                        <SelectValue placeholder={t("select_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={USER_ROLE.USER_PRODUCT_SELLER_ADMIN}>
                          {t("product_seller")}
                        </SelectItem>
                        <SelectItem value={USER_ROLE.USER_SERVICE_PROVIDER_ADMIN}>
                          {t("service_provider")}
                        </SelectItem>
                        <SelectItem value={USER_ROLE.USER_BUYER_ADMIN}>
                          {t("buyer_customer")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full h-11 text-base font-semibold",
                        isDarkTheme &&
                          "bg-secondary hover:bg-secondary/90 text-white rounded-md shadow-lg shadow-secondary/20",
                      )}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t("create_account")}
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
                      {t("verification_code")}
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
                      {t("enter_otp_sent_to", { phone: `+91${mobile}` })}
                    </FieldDescription>
                  </Field>
                  <div className="flex flex-col gap-4 mt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full h-11 text-base font-semibold",
                        isDarkTheme &&
                          "bg-secondary hover:bg-secondary/90 text-white rounded-md shadow-lg shadow-secondary/20",
                      )}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t("verify_register")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("info")}
                      disabled={isLoading}
                      className={cn(
                        "w-full",
                        isDarkTheme &&
                          "text-white hover:text-white hover:bg-white/10",
                      )}
                    >
                      {t("change_details")}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
