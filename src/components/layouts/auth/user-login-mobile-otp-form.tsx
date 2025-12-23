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

export function UserLoginMobileOtpForm({
  className,
  role,
  ...props
}: React.ComponentProps<"div"> & { role?: string }) {
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login as {displayRole || "User"}</CardTitle>
          <CardDescription>
            Enter your mobile below to login to your {displayRole.toLowerCase() || "user"} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
                <Input
                  id="mobile"
                  type="mobile"
                  placeholder="9876543210"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Send OTP</Button>
              </Field>

              <Field>
                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                <InputOTP
                  containerClassName="justify-around"
                  maxLength={6}
                  id="otp"
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
                <FieldDescription className="text-center">
                  Enter the 6-digit code sent to your mobile.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Verify</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
