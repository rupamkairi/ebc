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

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />
      <Container>
        <div className="flex flex-col gap-8 py-8">
          <ProfileCard
            user={{
              name: businessName,
              role: businessRole,
              avatarUrl: "",
            }}
          />
          {children}
        </div>
      </Container>
      <BottomNav />
    </div>
  );
}
