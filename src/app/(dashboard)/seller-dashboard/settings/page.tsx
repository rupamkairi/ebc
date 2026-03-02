"use client";

import { Lock, Clock, XCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EntitySettingsForm } from "@/components/dashboard/seller/entity-settings-form";
import { NotificationChannelList } from "@/components/dashboard/notifications/notification-channel-list";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/containers";

export default function SettingsPage() {
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const status = mainEntity?.verificationStatus;

  return (
    <Container className="py-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[32px] font-bold tracking-tight text-[#445EB4]">Profile Settings</h1>
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
                    ? "Verification Pending"
                    : "Verification Rejected"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === "PENDING"
                    ? "Our team is reviewing your business profile. Some features may be restricted until approved."
                    : mainEntity?.verificaitonRemark ||
                      "Your business profile was rejected. Please contact support for more information."}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {status === "PENDING" ? "View Details" : "Contact Support"}
            </Button>
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
            {/* Security Section */}
            <Card className="pointer-events-none opacity-60 grayscale-[0.5]">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">Security</p>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    disabled
                    className="w-full justify-start text-xs h-9"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="w-full justify-start text-xs h-9"
                  >
                    Session Management
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-6 text-center space-y-2">
                <ShieldCheck className="size-8 mx-auto text-muted-foreground/40" />
                <p className="text-xs font-medium text-muted-foreground">
                  Account verification ensures a safe marketplace for everyone.
                </p>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" disabled>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
