"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { NOTIFICATION_CHANNEL_TYPE } from "@/constants/enums";
import {
  useFakeEnquiryModerationConfigQuery,
  useUpdateFakeEnquiryModerationConfigMutation,
  useNotificationDeliveryConfigsQuery,
  useUpdateNotificationDeliveryConfigMutation,
} from "@/queries/adminQueries";
import { toast } from "sonner";
import {
  NotificationChannelType,
  NotificationDeliveryConfig,
} from "@/types/notification";
import { FakeEnquiryModerationConfig } from "@/types/auth";

const DELIVERY_CHANNELS: NotificationChannelType[] = [
  NOTIFICATION_CHANNEL_TYPE.EMAIL,
  NOTIFICATION_CHANNEL_TYPE.SMS,
  NOTIFICATION_CHANNEL_TYPE.WHATSAPP,
];

type DeliveryDraft = {
  label: string;
  channels: NotificationChannelType[];
  smsTemplateId: string;
  smsTemplateParams: string;
};

function ModerationSettingsCard({
  moderationConfig,
  isLoading,
  onSave,
}: {
  moderationConfig: FakeEnquiryModerationConfig;
  isLoading: boolean;
  onSave: (data: {
    strikeThreshold: number;
    blacklistDurationDays: number;
  }) => Promise<void>;
}) {
  const [draft, setDraft] = useState(() => ({
    strikeThreshold: moderationConfig.strikeThreshold,
    blacklistDurationDays: moderationConfig.blacklistDurationDays,
  }));

  return (
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
              <span className="text-sm font-medium">Strike Threshold</span>
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
          disabled={isLoading}
          onClick={async () => {
            await onSave(draft);
          }}
        >
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
      </CardContent>
    </Card>
  );
}

function DeliveryRulesCard({
  deliveryConfigs,
  onSave,
}: {
  deliveryConfigs: NotificationDeliveryConfig[];
  onSave: (
    key: string,
    data: {
      label: string;
      channels: NotificationChannelType[];
      smsTemplateId: string | null;
      smsTemplateParams: string[];
    },
  ) => Promise<void>;
}) {
  const [deliveryDrafts, setDeliveryDrafts] = useState<Record<string, DeliveryDraft>>(
    () =>
      Object.fromEntries(
        deliveryConfigs.map((config) => [
          config.key,
          {
            label: config.label,
            channels: config.channels,
            smsTemplateId: config.smsTemplateId || "",
            smsTemplateParams: config.smsTemplateParams.join(", "),
          },
        ]),
      ),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Delivery Rules</CardTitle>
        <CardDescription>
          Configure which delivery channels are allowed for each message
          key. In-app notifications are always preserved.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {deliveryConfigs.map((config) => {
            const draftRow = deliveryDrafts[config.key];

            if (!draftRow) return null;

            const toggleChannel = (channel: NotificationChannelType) => {
              setDeliveryDrafts((prev) => {
                const current = prev[config.key];
                if (!current) return prev;
                const nextChannels = current.channels.includes(channel)
                  ? current.channels.filter((item) => item !== channel)
                  : [...current.channels, channel];
                return {
                  ...prev,
                  [config.key]: {
                    ...current,
                    channels: nextChannels,
                  },
                };
              });
            };

            return (
              <div
                key={config.key}
                className="rounded-xl border bg-background p-4 space-y-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{config.label}</h4>
                      <Badge variant="secondary">{config.key}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      In-app delivery is always on. Enable only the external
                      channels you want this message to use.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await onSave(config.key, {
                        label: draftRow.label,
                        channels: draftRow.channels,
                        smsTemplateId: draftRow.smsTemplateId.trim() || null,
                        smsTemplateParams: draftRow.smsTemplateParams
                          .split(",")
                          .map((value) => value.trim())
                          .filter(Boolean),
                      });
                    }}
                  >
                    <Save className="size-4" />
                    Save
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Label</span>
                    <Input
                      value={draftRow.label}
                      onChange={(e) =>
                        setDeliveryDrafts((prev) => ({
                          ...prev,
                          [config.key]: {
                            ...prev[config.key],
                            label: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">
                      Allowed Channels
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {DELIVERY_CHANNELS.map((channel) => (
                        <label
                          key={channel}
                          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                        >
                          <Checkbox
                            checked={draftRow.channels.includes(channel)}
                            onCheckedChange={() => toggleChannel(channel)}
                          />
                          <span>{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">SMS Template ID</span>
                    <Input
                      value={draftRow.smsTemplateId}
                      onChange={(e) =>
                        setDeliveryDrafts((prev) => ({
                          ...prev,
                          [config.key]: {
                            ...prev[config.key],
                            smsTemplateId: e.target.value,
                          },
                        }))
                      }
                      placeholder="MSG91 template id"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      SMS Param Names
                    </span>
                    <Textarea
                      value={draftRow.smsTemplateParams}
                      onChange={(e) =>
                        setDeliveryDrafts((prev) => ({
                          ...prev,
                          [config.key]: {
                            ...prev[config.key],
                            smsTemplateParams: e.target.value,
                          },
                        }))
                      }
                      placeholder="otp, phone"
                      rows={3}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const { data: moderationConfig, isLoading } =
    useFakeEnquiryModerationConfigQuery(isAdmin);
  const {
    data: deliveryConfigs = [],
    isLoading: deliveryConfigsLoading,
  } = useNotificationDeliveryConfigsQuery();
  const updateDeliveryConfig = useUpdateNotificationDeliveryConfigMutation();
  const updateModerationConfig =
    useUpdateFakeEnquiryModerationConfigMutation();

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

          {moderationConfig && (
            <ModerationSettingsCard
              key={moderationConfig.updatedAt}
              moderationConfig={moderationConfig}
              isLoading={isLoading}
              onSave={async (data) => {
                try {
                  await updateModerationConfig.mutateAsync(data);
                  toast.success("Fake enquiry moderation updated.");
                } catch {
                  toast.error("Failed to update fake enquiry moderation.");
                }
              }}
            />
          )}

          <NotificationChannelList />

          {!deliveryConfigsLoading && deliveryConfigs.length > 0 && (
            <DeliveryRulesCard
              key={deliveryConfigs.map((config) => config.updatedAt).join("|")}
              deliveryConfigs={deliveryConfigs}
              onSave={async (key, data) => {
                try {
                  await updateDeliveryConfig.mutateAsync({ key, data });
                  toast.success("Delivery rule saved.");
                } catch {
                  toast.error("Failed to save delivery rule.");
                }
              }}
            />
          )}
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
