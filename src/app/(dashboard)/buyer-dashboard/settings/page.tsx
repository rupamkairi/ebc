"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfileMutation } from "@/queries/authQueries";
import { toast } from "sonner";
import { NotificationChannelList } from "@/components/dashboard/notifications/notification-channel-list";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfileMutation();
  const [pincodeId, setPincodeId] = useState(user?.pincodeId || "");

  useEffect(() => {
    if (user?.pincodeId) {
      setPincodeId(user.pincodeId);
    }
  }, [user?.pincodeId]);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      pincodeId: pincodeId || undefined,
    };

    updateProfile.mutate(data, {
      onSuccess: () => toast.success("Profile updated successfully"),
      onError: () => toast.error("Failed to update profile"),
    });
  };

  return (
    <Container>
      <div className="flex flex-col gap-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and company settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. User Personal Details */}
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Update your personal information and contact details for
                  better targeting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      defaultValue={user?.name || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      defaultValue={user?.phone || ""}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label>Pincode / Targeting Location</Label>
                    <PincodeSearchAutocomplete
                      value={pincodeId}
                      onValueChange={setPincodeId}
                      initialRecord={(user?.pincode?.pincode || "") as string}
                      placeholder="Search your pincode..."
                    />
                  </div>
                </div>
                <br />
              </CardContent>
              <CardFooter className="justify-end border-t pt-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* 4. Notification Settings */}
          <NotificationChannelList />
        </div>
      </div>
    </Container>
  );
}
