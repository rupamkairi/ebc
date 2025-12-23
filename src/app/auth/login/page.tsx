import { UserLoginMobileOtpForm } from "@/components/layouts/auth/user-login-mobile-otp-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AuthLogin({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { role } = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Back to home
        </Link>
        <UserLoginMobileOtpForm role={role as string} />
      </div>
    </div>
  );
}
