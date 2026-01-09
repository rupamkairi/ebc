"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { entityService } from "@/services/entityService";
import { Loader2 } from "lucide-react";
import { USER_ROLE } from "@/constants/auth";
import { RoleSelection } from "./role-selection";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Derive mounted state for hydration safety
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const checkOnboarding = useCallback(async () => {
    if (!token || !user) {
      setIsChecking(false);
      return;
    }

    const role = user.role?.toUpperCase() || "";

    // 1. Check if unassigned
    if (role === USER_ROLE.UNASSIGNED) {
      setIsChecking(false);
      return;
    }

    // 2. Check if onboarding needed
    const needsOnboarding =
      role === USER_ROLE.USER_PRODUCT_SELLER_ADMIN ||
      role === USER_ROLE.USER_SERVICE_PROVIDER_ADMIN;

    if (!needsOnboarding) {
      setIsOnboarded(true);
      setIsChecking(false);
      return;
    }

    // 3. Check for entity
    try {
      const entities = await entityService.getAll();
      if (entities.length > 0) {
        setIsOnboarded(true);
      } else {
        router.push("/auth/register/onboarding");
      }
    } catch (error) {
      console.error("Onboarding check failed", error);
    } finally {
      setIsChecking(false);
    }
  }, [token, user, router]);

  useEffect(() => {
    if (mounted) {
      checkOnboarding();
    }
  }, [checkOnboarding, mounted]);

  if (!mounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const role = user?.role?.toUpperCase() || "";

  if (role === USER_ROLE.UNASSIGNED) {
    return <RoleSelection />;
  }

  if (
    !isOnboarded &&
    (role === USER_ROLE.USER_PRODUCT_SELLER_ADMIN ||
      role === USER_ROLE.USER_SERVICE_PROVIDER_ADMIN)
  ) {
    return null; // Redirecting to onboarding
  }

  return <>{children}</>;
}
