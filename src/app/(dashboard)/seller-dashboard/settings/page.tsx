"use client";

import {
  Bell,
  Lock,
  Zap,
  Clock,
  XCircle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EntitySettingsForm } from "@/components/dashboard/seller/entity-settings-form";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { cn } from "@/lib/utils";
import Container from "@/components/containers/containers";

const settingGroups = [
  {
    title: "Notifications",
    icon: Bell,
    items: [
      {
        id: "notif-1",
        label: "New Lead Alerts",
        desc: "Get notified when a buyer sends an inquiry.",
        active: true,
      },
      {
        id: "notif-2",
        label: "Quotation Updates",
        desc: "Know when a quote is accepted or rejected.",
        active: true,
      },
      {
        id: "notif-3",
        label: "Marketing Tips",
        desc: "Receive tips to grow your business.",
        active: false,
      },
    ],
  },
  {
    title: "Preferences",
    icon: Zap,
    items: [
      {
        id: "pref-1",
        label: "Hinglish Mode",
        desc: "Show dashboard text in a mix of Hindi and English.",
        active: true,
      },
      {
        id: "pref-2",
        label: "Auto-respond to inquiries",
        desc: "Send a welcome message automatically.",
        active: false,
      },
    ],
  },
];

export default function SettingsPage() {
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const status = mainEntity?.verificationStatus;

  return (
    <Container className="py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business profile and dashboard preferences.
        </p>
      </div>

      {/* Verification Status Banner */}
      {status && status !== "APPROVED" && (
        <Card
          className={cn(
            "border-2",
            status === "PENDING" && "bg-amber-50/50 border-amber-200",
            status === "REJECTED" && "bg-destructive/5 border-destructive/20"
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
                    status === "REJECTED" && "text-destructive"
                  )}
                >
                  {status === "PENDING"
                    ? "Verification Pending"
                    : "Verification Rejected"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === "PENDING"
                    ? "Our team is reviewing your business profile. Some features may be restricted until approved."
                    : mainEntity.verificaitonRemark ||
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Entity Details */}
        <div className="lg:col-span-2 space-y-8">
          <EntitySettingsForm />
        </div>

        {/* Sidebar: Platform Settings (Disabled) */}
        <div className="space-y-8 opacity-60">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold px-1 flex items-center gap-2">
              <AlertCircle className="size-4 text-muted-foreground" />
              Platform Settings
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                Soon
              </span>
            </h3>

            {settingGroups.map((group, i) => (
              <Card key={i} className="pointer-events-none grayscale-[0.5]">
                <CardHeader className="py-4 px-6 border-b">
                  <div className="flex items-center gap-2">
                    <group.icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{group.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {group.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-4 flex items-center justify-between gap-4",
                        idx !== group.items.length - 1 && "border-b"
                      )}
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                      <Switch disabled checked={item.active} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Security Section */}
            <Card className="pointer-events-none grayscale-[0.5]">
              <CardHeader className="py-4 px-6 border-b">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <CardTitle className="text-sm">Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
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
              </CardContent>
            </Card>
          </div>

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
    </Container>
  );
}
