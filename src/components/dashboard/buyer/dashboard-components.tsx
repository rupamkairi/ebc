"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Bell, LogOut, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import {
  useNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/queries/notificationQueries";
import { USER_ROLE_LABELS } from "@/constants/roles";
import { useState } from "react";

/**
 * 1. Buyer Profile Card (Orange)
 */
export function BuyerProfileCard({
  name,
  role,
  avatarUrl,
}: {
  name: string;
  role: string;
  avatarUrl?: string;
}) {
  const { data: notifications = [] } = useNotificationsQuery();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const markAllRead = useMarkAllNotificationsReadMutation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (open && unreadCount > 0) {
      markAllRead.mutate();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#FF8C00] to-[#FFA500] p-4 sm:p-8 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-2 sm:border-4 border-white/30 shadow-xl">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-white text-[#FFA500] text-xl sm:text-3xl font-bold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {name}
            </h1>
            <p className="text-sm sm:text-lg font-medium text-white/80">
              {USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] || role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 text-white">
                <Settings className="size-5 sm:size-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  href="/buyer-dashboard/settings"
                  className="flex items-center w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification Bell — opens slide-out panel */}
          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <button className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 text-white">
                <Bell className="size-5 sm:size-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[360px] sm:w-[420px] p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-2 text-base font-black">
                  <Bell className="size-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto text-xs font-black text-white bg-red-500 rounded-full px-2 py-0.5">
                      {unreadCount} unread
                    </span>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                <NotificationInbox userType="BUYER" hideHeader />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Room Card
 */
export function RoomCard({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <div className="group flex flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-muted/50 transition-all hover:shadow-md h-full">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFA500] text-white">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-bold text-[#3D52A0] text-center">{title}</h3>
      <Link href={href} className="w-full mt-auto">
        <Button className="w-full bg-[#2A3B7D] hover:bg-[#1D2A5C] text-sm font-semibold h-10 px-8">
          Browse Area
        </Button>
      </Link>
    </div>
  );
}

/**
 * 3. Activity Container Card
 */
export function ActivitySectionCard({
  title,
  icon: Icon,
  children,
  footerLink,
  footerText,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  footerLink: string;
  footerText: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-[#0F28A9] text-white shadow-xl">
      <div className="flex items-center justify-center gap-3 p-6 pb-4">
        <Icon className="size-8" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className="flex-1 px-6">
        <div className="grid grid-cols-2 gap-4">{children}</div>
      </div>

      <div className="p-6">
        <Link href={footerLink}>
          <Button className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold h-12 text-md">
            {footerText}
          </Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * 4. Stat Card (Inside Activity)
 */
export function ActivityStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-[#3D52A0] shadow-inner">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[#FFA500]" />
        <span className="text-xs font-semibold opacity-70">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

/**
 * 5. Conference Hall Section Item
 */
export function ConferenceHallItem({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl bg-[#4D65B2] p-4 text-white transition-all hover:bg-[#3D52A0]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
          <Icon className="size-5" />
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium opacity-80">
        <span>View More</span>
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
