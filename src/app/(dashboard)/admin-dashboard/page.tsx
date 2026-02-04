"use client";

import Container from "@/components/containers/containers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <Container className="py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.name || "Admin"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Monitor your marketplace performance and manage platform activities.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Stats or other overview content could go here */}
          <Card className="h-full bg-muted/20 border-dashed flex items-center justify-center p-12">
            <p className="text-muted-foreground text-sm font-medium">
              Dashboard charts and metrics coming soon.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <NotificationInbox userType="ADMIN" />
        </div>
      </div>
    </Container>
  );
}
