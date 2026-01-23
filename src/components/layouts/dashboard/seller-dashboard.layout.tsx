"use client";

import Container from "@/components/containers/containers";
import { DashboardHeader } from "@/app/(dashboard)/seller-dashboard/dashboard-header";
import { BottomNav } from "@/app/(dashboard)/seller-dashboard/bottom-nav";
import { ProfileCard } from "@/components/dashboard/seller/profile-card";
import { useAuthStore } from "@/store/authStore";
import { useEntitiesQuery } from "@/queries/entityQueries";

export default function SellerDashboardLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { data: entities } = useEntitiesQuery();

  const entity = entities?.[0];
  const businessName = entity?.name || user?.name || "Member";
  const businessRole =
    user?.role === "USER_SERVICE_PROVIDER_ADMIN"
      ? "Service Provider"
      : "Material Seller";

  // Using standard background and spacing
  return (
    <div className="min-h-screen bg-muted/30 pb-32">
      <DashboardHeader />
      <div className="flex flex-col gap-6 py-6">
        <Container>
          <ProfileCard
            user={{
              name: businessName,
              role: businessRole,
              avatarUrl: "",
            }}
          />
        </Container>
        <Container>{children}</Container>
      </div>
      <BottomNav />
    </div>
  );
}
