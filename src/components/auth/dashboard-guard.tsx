"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getDashboardPathForRole } from "@/constants/roles";

interface DashboardGuardProps {
  children: React.ReactNode;
  /** Roles that are permitted to access this dashboard section */
  allowedRoles: string[];
  /** Where to redirect unauthenticated users. Defaults to /auth/login */
  loginPath?: string;
}

/**
 * DashboardGuard enforces both authentication AND role-based access.
 *
 * - If not authenticated → redirects to loginPath
 * - If authenticated but wrong role → redirects to the user's correct dashboard
 * - Works on initial load AND on hard refresh
 */
export function DashboardGuard({
  children,
  allowedRoles,
  loginPath = "/auth/login",
}: DashboardGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();

  // SSR-safe hydration flag — prevents rendering (and redirect) before
  // client-side auth state is available from localStorage/zustand persist.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;

    // 1. Not authenticated → redirect to login
    if (!token) {
      // Admin pages get a distinct login page
      const target = pathname.includes("/admin-dashboard")
        ? "/auth/admin-login"
        : loginPath;
      router.replace(target);
      return;
    }

    // 2. Authenticated but wrong role → redirect to correct dashboard
    const userRole = (user?.role ?? "").toUpperCase();
    if (!allowedRoles.map((r) => r.toUpperCase()).includes(userRole)) {
      const correctPath = getDashboardPathForRole(userRole);
      toast.error("You don't have access to this section.", {
        description: "Redirecting you to your dashboard...",
      });
      router.replace(correctPath);
    }
  }, [mounted, token, user, allowedRoles, router, pathname, loginPath]);

  // Prevent rendering while hydrating — avoids flash of wrong content
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated → render nothing while redirect fires
  if (!token) return null;

  // If wrong role → render nothing while redirect fires
  const userRole = (user?.role ?? "").toUpperCase();
  if (!allowedRoles.map((r) => r.toUpperCase()).includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
