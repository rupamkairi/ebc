"use client";

import Container from "@/components/ui/containers";
import { NotificationChannelList } from "@/components/dashboard/notifications/notification-channel-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();

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
                  <p className="text-sm font-mono uppercase text-primary bg-primary/5 px-2 py-0.5 rounded w-fit">
                    {user?.role}
                  </p>
                </div>
              </div>
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
