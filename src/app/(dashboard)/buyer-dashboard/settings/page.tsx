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
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfileMutation } from "@/queries/authQueries";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfileMutation();

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
      email: formData.get("email") as string,
      phoneNumber: formData.get("phone") as string,
    };

    updateProfile.mutate(data, {
      onSuccess: () => toast.success("Profile updated successfully"),
      onError: () => toast.error("Failed to update profile"),
    });
  };

  // Split name for display
  const [firstName, lastName] = (user?.name || "").split(" ");

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
                  Update your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      defaultValue={firstName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      defaultValue={lastName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      defaultValue={user?.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      defaultValue={user?.phoneNumber || ""}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* 2. Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                Manage your company profile and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    defaultValue="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    placeholder="Enter GST number"
                    defaultValue="29ZZZZZ9999Z9Z9"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter company address"
                    defaultValue="123 Business Park, Tech City"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-4">
              <Button>Save Company Details</Button>
            </CardFooter>
          </Card>

          {/* 3. Company Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Company Members</CardTitle>
                  <CardDescription>
                    Manage team members who have access to this account.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Alice Johnson",
                    role: "Admin",
                    email: "alice@acme.com",
                  },
                  { name: "Bob Smith", role: "Editor", email: "bob@acme.com" },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email} • {member.role}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
