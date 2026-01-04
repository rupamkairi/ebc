"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

/**
 * SellerGuard ensures that ONLY users with a 'SELLER' role can access 
 * the dashboard pages.
 */
export function SellerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user } = useAuthStore();
  
  const isSeller = user?.role?.toUpperCase().includes("SELLER") || user?.role?.toUpperCase().includes("ADMIN");
  const isAuthorized = !!(token && user && isSeller);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login?role=seller");
    } else if (user && !isSeller) {
      router.push("/buyer-dashboard");
    }
  }, [token, user, isSeller, router]);

  // Show a premium loading state while verifying permissions
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="relative">
          <div className="h-16 w-16 rounded-3xl border-4 border-primary/10 border-t-primary animate-spin" />
          <Loader2 className="h-6 w-6 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-sm font-black text-foreground tracking-widest uppercase italic">Verifying Portal Access</h3>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] animate-pulse">Establishing Secure Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
