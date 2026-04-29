"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/containers";
import { useAuthStore } from "@/store/authStore";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"></div>
    </Container>
  );
}
