"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/containers";
import { NotificationChannelList } from "@/components/dashboard/notifications/notification-channel-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  useFakeEnquiryModerationConfigQuery,
  useUpdateFakeEnquiryModerationConfigMutation,
} from "@/queries/adminQueries";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const { data: moderationConfig, isLoading } =
    useFakeEnquiryModerationConfigQuery(isAdmin);
  const updateModerationConfig =
    useUpdateFakeEnquiryModerationConfigMutation();
  const [draft, setDraft] = useState({
    strikeThreshold: 3,
    blacklistDurationDays: 90,
  });

  useEffect(() => {
    if (moderationConfig) {
      setDraft({
        strikeThreshold: moderationConfig.strikeThreshold,
        blacklistDurationDays: moderationConfig.blacklistDurationDays,
      });
    }
  }, [moderationConfig]);

  if (!isAdmin) {
    return (
      <Container>
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-destructive font-semibold">
            Access Denied. Admin only.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage your administrator profile and notification channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Basic information about your administrator account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm">{user?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <p className="text-sm font-mono  text-primary bg-primary/5 px-2 py-0.5 rounded w-fit">
                    {user?.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fake Enquiry Moderation</CardTitle>
              <CardDescription>
                Configure strike threshold and blacklist duration. Auto-expiry
                is checked on demand, so no cron job is needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading moderation config...
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Strike Threshold
                    </span>
                    <Input
                      type="number"
                      min={1}
                      value={draft.strikeThreshold}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          strikeThreshold: Number(e.target.value) || 1,
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Blacklist Duration Days
                    </span>
                    <Input
                      type="number"
                      min={1}
                      value={draft.blacklistDurationDays}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          blacklistDurationDays: Number(e.target.value) || 1,
                        }))
                      }
                    />
                  </label>
                </div>
              )}

              <Button
                disabled={updateModerationConfig.isPending || isLoading}
                onClick={async () => {
                  try {
                    await updateModerationConfig.mutateAsync(draft);
                    toast.success("Fake enquiry moderation updated.");
                  } catch (error) {
                    toast.error("Failed to update fake enquiry moderation.");
                  }
                }}
              >
                {updateModerationConfig.isPending ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                Save
              </Button>
            </CardContent>
          </Card>

          <NotificationChannelList />
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-2">Admin Notifications</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                As an administrator, you&apos;ll receive notifications regarding
                entity verifications, system alerts, and critical user
                activities. Ensure your channels are verified to receive timely
                updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
