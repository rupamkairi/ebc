"use client";

import Container from "@/components/ui/containers";
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
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfileMutation } from "@/queries/authQueries";
import { toast } from "sonner";
import { NotificationChannelList } from "@/components/dashboard/notifications/notification-channel-list";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfileMutation();
  const [pincodeId, setPincodeId] = useState(user?.pincodeId || "");
  const [phone, setPhone] = useState(user?.phone?.replace(/^\+91/, "") || "");
  const { t } = useLanguage();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string) || undefined,
      phone: phone ? `+91${phone}` : undefined,
      pincodeId: pincodeId || undefined,
    };

    updateProfile.mutate(data, {
      onSuccess: () => toast.success(t("profile_success_msg")),
      onError: () => toast.error(t("profile_failed_msg")),
    });
  };

  return (
    <Container>
      <div className="flex flex-col gap-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("settings_title")}</h1>
          <p className="text-muted-foreground">
            {t("settings_subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. User Personal Details */}
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>{t("personal_details_title")}</CardTitle>
                <CardDescription>
                  {t("personal_details_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("first_name_field")}</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={t("enter_name_placeholder")}
                      defaultValue={user?.name || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email_field")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone_field")}</Label>
                    <div className="flex gap-0 w-full">
                      <span className="flex items-center px-4 rounded-l-md text-sm font-medium border bg-muted text-muted-foreground">
                        +91
                      </span>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter 10-digit mobile number (digits only, no spaces or special characters)
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label>{t("pincode_field")}</Label>
                    <PincodeSearchAutocomplete
                      value={pincodeId}
                      onValueChange={setPincodeId}
                      initialRecord={(user?.pincode?.pincode || "") as string}
                      placeholder={t("search_pincode_placeholder_new")}
                    />
                  </div>
                </div>
                <br />
              </CardContent>
              <CardFooter className="justify-end border-t pt-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? t("saving_btn") : t("save_changes_btn")}
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
