"use client";

import { Lock, Clock, XCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EntitySettingsForm } from "@/components/dashboard/seller/entity-settings-form";
import { NotificationChannelList } from "@/components/dashboard/notifications/notification-channel-list";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/containers";
import { useAuthStore } from "@/store/authStore";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const status = mainEntity?.verificationStatus;
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container className="py-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[32px] font-bold tracking-tight text-primary">
          {t("profile_settings")}
        </h1>
      </div>

      {/* Verification Status Banner */}
      {status && status !== "APPROVED" && (
        <Card
          className={cn(
            "border-2",
            status === "PENDING" && "bg-amber-50/50 border-amber-200",
            status === "REJECTED" && "bg-destructive/5 border-destructive/20",
          )}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status === "PENDING" ? (
                <Clock className="size-5 text-amber-600" />
              ) : (
                <XCircle className="size-5 text-destructive" />
              )}
              <div>
                <p
                  className={cn(
                    "text-sm font-bold",
                    status === "PENDING" && "text-amber-900",
                    status === "REJECTED" && "text-destructive",
                  )}
                >
                  {status === "PENDING"
                    ? t("verification_pending_title")
                    : t("verification_rejected_title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === "PENDING"
                    ? t("complete_info_in_settings")
                    : mainEntity?.verificaitonRemark ||
                      t("verification_rejected_desc")}
                </p>
              </div>
            </div>
            {status === "REJECTED" && (
              <Button variant="outline" size="sm">
                {t("contact_support_btn")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content: Entity Details */}
        <div className="lg:col-span-3 space-y-8">
          <EntitySettingsForm />
        </div>

        {/* Sidebar: Platform Settings */}
        <div className="space-y-8">
          <NotificationChannelList />

          <div className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center space-y-2">
                <ShieldCheck className="size-8 mx-auto text-muted-foreground/40" />
                <p className="text-xs font-medium text-muted-foreground">
                  {t("account_verification_safe_marketplace")}
                </p>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              {t("log_out")}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
