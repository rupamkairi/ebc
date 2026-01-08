"use client";

import { useAuthStore } from "@/store/authStore";
import { RoleSelection } from "./role-selection";
import { BusinessSetup } from "./business-setup";
import { useEffect, useState, useCallback } from "react";
import { entityService } from "@/services/entityService";
import { Loader2 } from "lucide-react";

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const [hasEntity, setHasEntity] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkEntity = useCallback(async () => {
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    // We only care about entity for sellers/service providers
    const role = user.role?.toUpperCase() || "";
    if (role === "UNASSIGNED" || role.startsWith("ADMIN") && !role.startsWith("USER_")) {
      setIsLoading(false);
      return;
    }

    if (role.includes("SELLER") || role.includes("SERVICE")) {
      try {
        const entities = await entityService.getAll();
        setHasEntity(entities.length > 0);
      } catch (error) {
        console.error("Failed to fetch entities", error);
      }
    } else {
      // Buyers don't need entities in this flow
      setHasEntity(true);
    }
    setIsLoading(false);
  }, [token, user]);

  useEffect(() => {
    checkEntity();
  }, [checkEntity]);

  if (!token || !user) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="relative">
          <div className="h-16 w-16 rounded-3xl border-4 border-primary/10 border-t-primary animate-spin" />
          <Loader2 className="h-6 w-6 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-sm font-black text-foreground tracking-widest uppercase italic">Preparing Experience</h3>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] animate-pulse">Personalizing your portal...</p>
        </div>
      </div>
    );
  }

  const role = user.role?.toUpperCase() || "";

  // Step 1: Role Selection
  if (role === "UNASSIGNED") {
    return <RoleSelection />;
  }

  // Step 2: Entity Creation
  if (hasEntity === false && (role.includes("SELLER") || role.includes("SERVICE"))) {
    return <BusinessSetup onComplete={() => setHasEntity(true)} />;
  }

  return <>{children}</>;
}
