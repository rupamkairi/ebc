"use client";

import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/queries/notificationQueries";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Loader2,
  FileText,
  Calendar,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationInboxProps {
  userType: "ADMIN" | "SELLER" | "BUYER";
  className?: string;
  limit?: number;
}

export function NotificationInbox({
  userType,
  className,
  limit,
}: NotificationInboxProps) {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    const path = getNotificationPath(notification, userType);
    if (path) {
      router.push(path);
    }
  };

  const getNotificationPath = (notification: Notification, role: string) => {
    const { activityId, type } = notification;
    if (!activityId) return null;

    if (role === "SELLER") {
      if (type.includes("ENQUIRY"))
        return `/seller-dashboard/enquiries/${activityId}`;
      if (type.includes("APPOINTMENT"))
        return `/seller-dashboard/appointments/${activityId}`;
      if (type.includes("QUOTATION"))
        return `/seller-dashboard/quotations/${activityId}`;
    }

    if (role === "BUYER") {
      if (type.includes("QUOTATION"))
        return `/buyer-dashboard/enquiries/${notification.metadata?.enquiryId || ""}`;
      if (type.includes("VISIT"))
        return `/buyer-dashboard/appointments/${activityId}`;
    }

    if (role === "ADMIN") {
      if (type.includes("ENTITY"))
        return `/admin-dashboard/sellers/product-sellers/${activityId}`;
      if (type.includes("OFFER")) return `/admin-dashboard/catalog/offers`;
    }

    return null;
  };

  const getIcon = (type: string) => {
    if (type.includes("ENQUIRY")) return FileText;
    if (type.includes("APPOINTMENT")) return Calendar;
    if (type.includes("QUOTATION")) return MessageSquare;
    if (type.includes("ENTITY")) return Briefcase;
    return Bell;
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const displayedNotifications = limit
    ? notifications.slice(0, limit)
    : notifications;

  return (
    <Card
      className={cn("w-full border-none shadow-none bg-transparent", className)}
    >
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="size-5" />
            Notifications
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {notifications.filter((n) => !n.isRead).length} Unread
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[400px] pr-4">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
              <Bell className="size-10 mb-2" />
              <p className="text-sm">No notifications found.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border border-transparent",
                      notification.isRead
                        ? "hover:bg-muted/50"
                        : "bg-primary/3 border-primary/5 hover:bg-primary/5",
                    )}
                  >
                    <div className="flex gap-4">
                      <div
                        className={cn(
                          "size-10 shrink-0 rounded-full flex items-center justify-center",
                          notification.isRead
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-semibold truncate",
                              notification.isRead
                                ? "text-foreground/70"
                                : "text-foreground",
                            )}
                          >
                            {notification.title}
                          </p>
                          <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>

                        {/* Slot implementation for specific user content */}
                        {userType === "SELLER" &&
                          notification.type.includes("ENQUIRY") && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                New Enquiry
                              </span>
                              {/* {notification.metadata?.itemName && (
                                <span className="text-[10px] text-muted-foreground truncate italic">
                                  for {notification.metadata.itemName}
                                </span>
                              )} */}
                            </div>
                          )}

                        {userType === "BUYER" &&
                          notification.type.includes("QUOTATION") && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                Quotation Ready
                              </span>
                              {/* {notification.metadata?.sellerName && (
                                <span className="text-[10px] text-muted-foreground truncate italic">
                                  from {notification.metadata.sellerName}
                                </span>
                              )} */}
                            </div>
                          )}

                        {userType === "ADMIN" &&
                          notification.type.includes("ENTITY") && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                Review Required
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
