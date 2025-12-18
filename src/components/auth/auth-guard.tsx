"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useSyncSession } from "@/hooks/api/use-auth-admin";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useSyncSession();
  const token = useAuthStore((state) => state.token);
  // const user = useAuthStore((state) => state.user); // Unused for now
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (mounted && !token) {
      router.push("/auth/admin-login");
    }
  }, [token, mounted, router]);

  if (!mounted) return null; // or a loading spinner

  if (!token) return null; // will redirect

  return <>{children}</>;
}
