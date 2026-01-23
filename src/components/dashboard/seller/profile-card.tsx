"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bell, ScanLine, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileCardProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Card className="w-full flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
      <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
        <Avatar className="h-14 w-14 border">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="text-lg font-medium">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {user.name}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {user.role}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-end">
        <Button variant="outline" size="icon" className="h-9 w-9">
          <ScanLine className="h-4 w-4 text-muted-foreground" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/seller-dashboard/settings">
                Edit Business Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </Card>
  );
}
