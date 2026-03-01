"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useNotificationChannelsQuery,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
} from "@/queries/notificationQueries";
import { AddChannelModal } from "./add-channel-modal";
import {
  Mail,
  Phone,
  MessageSquare,
  Bell,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationChannelType } from "@/types/notification";
import { NOTIFICATION_CHANNEL_TYPE } from "@/constants/enums";

export function NotificationChannelList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: channels = [], isLoading } = useNotificationChannelsQuery();
  const updateChannelMutation = useUpdateChannelMutation();
  const deleteChannelMutation = useDeleteChannelMutation();

  const getIcon = (type: NotificationChannelType) => {
    switch (type) {
      case NOTIFICATION_CHANNEL_TYPE.EMAIL:
        return Mail;
      case NOTIFICATION_CHANNEL_TYPE.SMS:
        return Phone;
      case NOTIFICATION_CHANNEL_TYPE.WHATSAPP:
        return MessageSquare;
      case NOTIFICATION_CHANNEL_TYPE.PUSH:
        return Bell;
      default:
        return Bell;
    }
  };

  const toggleChannel = (id: string, currentStatus: boolean) => {
    updateChannelMutation.mutate({ id, data: { isActive: !currentStatus } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Notification Channels</h3>
          <p className="text-sm text-muted-foreground">
            Manage where you receive notifications.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Add Channel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="size-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No notification channels added yet.
              </p>
              <Button
                variant="link"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2"
              >
                Add your first channel
              </Button>
            </CardContent>
          </Card>
        ) : (
          channels.map((channel) => {
            const Icon = getIcon(channel.type);
            return (
              <Card
                key={channel.id}
                className={cn(
                  !channel.isActive && "opacity-60",
                  "col-span-full",
                )}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {channel.destination}
                        </p>
                        {channel.isVerified ? (
                          <CheckCircle2 className="size-3 text-green-500" />
                        ) : (
                          <AlertCircle className="size-3 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {channel.type.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={channel.isActive}
                      onCheckedChange={() =>
                        toggleChannel(channel.id, channel.isActive)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteChannelMutation.mutate(channel.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <AddChannelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingChannels={channels}
      />
    </div>
  );
}
