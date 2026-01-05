"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { token, user } = useAuthStore();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!mounted) return;

    // 1. Check if authenticated
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // 2. Check Role
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user?.role || "";
      if (!allowedRoles.includes(userRole)) {
        toast.error("You do not have permission to access this page.");
        router.push("/");
      }
    }
  }, [token, user, router, allowedRoles, mounted]);

  if (!mounted) return null;

  // Render logic derived from state
  if (!token) return null;

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || "";
    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
