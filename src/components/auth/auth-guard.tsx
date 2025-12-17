"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  // const user = useAuthStore((state) => state.user); // Unused for now
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/auth/admin-login");
    }
  }, [token, mounted, router]);

  if (!mounted) return null; // or a loading spinner

  if (!token) return null; // will redirect

  return <>{children}</>;
}
