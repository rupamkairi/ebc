"use client";

import Container from "@/components/containers/containers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <Container className="py-8">
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
    </Container>
  );
}
