"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown) =>
    err instanceof ApiError ? err.message : "Something went wrong. Please try again.";

  const sendResetCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.requestAdminPasswordReset({ email });
      setMessage(response.message);
      setRequested(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendResetCode();
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.confirmAdminPasswordReset({ email, code, password });
      setMessage(response.message);
      window.setTimeout(() => router.push("/auth/admin-login"), 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset admin password</CardTitle>
          <CardDescription>
            {requested ? "Enter the code sent to your email and choose a new password." : "We will email a six-digit reset code to your admin account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={requested ? resetPassword : requestCode}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={requested} />
              </Field>
              {requested && <>
                <Field>
                  <FieldLabel htmlFor="code">Reset code</FieldLabel>
                  <Input id="code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
                  <Input id="confirm-password" type="password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Field>
              </>}
              {error && <p className="text-sm font-medium text-red-500">{error}</p>}
              {message && <p className="text-sm font-medium text-green-600">{message}</p>}
              <Field>
                <Button type="submit" disabled={loading}>{loading ? "Please wait..." : requested ? "Reset password" : "Send reset code"}</Button>
                {requested && <Button type="button" variant="link" className="px-0" disabled={loading} onClick={sendResetCode}>Resend code</Button>}
                <Link href="/auth/admin-login" className="text-sm underline-offset-4 hover:underline">Back to admin login</Link>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
