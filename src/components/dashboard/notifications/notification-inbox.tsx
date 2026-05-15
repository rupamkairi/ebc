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
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { NOTIFICATION_TYPE } from "@/constants/enums";
import { useLanguage } from "@/hooks/useLanguage";

interface NotificationInboxProps {
  userType: "ADMIN" | "SELLER" | "BUYER";
  className?: string;
  limit?: number;
  hideHeader?: boolean;
  /** Set of enquiry IDs that have already been responded to — used to update the badge label */
  respondedEnquiryIds?: Set<string>;
}

const notificationDisplay: Record<
  NOTIFICATION_TYPE,
  {
    labelKey: string;
    titleKey: string;
    messageKey: string;
    icon: LucideIcon;
    badgeClassName: string;
  }
> = {
  [NOTIFICATION_TYPE.ENQUIRY_SUMBIT]: {
    labelKey: "notification_badge_enquiry_submit",
    titleKey: "notification_title_enquiry_submit",
    messageKey: "notification_message_enquiry_submit",
    icon: FileText,
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  [NOTIFICATION_TYPE.ENQUIRY_RECEIVE]: {
    labelKey: "notification_badge_enquiry_receive",
    titleKey: "notification_title_enquiry_receive",
    messageKey: "notification_message_enquiry_receive",
    icon: FileText,
    badgeClassName: "bg-amber-100 text-amber-700",
  },
  [NOTIFICATION_TYPE.ENQUIRY_REVISE_REQUEST]: {
    labelKey: "notification_badge_enquiry_revise_request",
    titleKey: "notification_title_enquiry_revise_request",
    messageKey: "notification_message_enquiry_revise_request",
    icon: CheckCircle2,
    badgeClassName: "bg-orange-100 text-orange-700",
  },
  [NOTIFICATION_TYPE.QUOTATION_SUMBIT]: {
    labelKey: "notification_badge_quotation_submit",
    titleKey: "notification_title_quotation_submit",
    messageKey: "notification_message_quotation_submit",
    icon: MessageSquare,
    badgeClassName: "bg-green-100 text-green-700",
  },
  [NOTIFICATION_TYPE.QUOTATION_ACCEPT]: {
    labelKey: "notification_badge_quotation_accept",
    titleKey: "notification_title_quotation_accept",
    messageKey: "notification_message_quotation_accept",
    icon: CheckCircle2,
    badgeClassName: "bg-green-100 text-green-700",
  },
  [NOTIFICATION_TYPE.QUOTATION_REJECT]: {
    labelKey: "notification_badge_quotation_reject",
    titleKey: "notification_title_quotation_reject",
    messageKey: "notification_message_quotation_reject",
    icon: MessageSquare,
    badgeClassName: "bg-red-100 text-red-700",
  },
  [NOTIFICATION_TYPE.APPOINTMENT_SUBMIT]: {
    labelKey: "notification_badge_appointment_submit",
    titleKey: "notification_title_appointment_submit",
    messageKey: "notification_message_appointment_submit",
    icon: Calendar,
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  [NOTIFICATION_TYPE.APPOINTMENT_RECEIVE]: {
    labelKey: "notification_badge_appointment_receive",
    titleKey: "notification_title_appointment_receive",
    messageKey: "notification_message_appointment_receive",
    icon: Calendar,
    badgeClassName: "bg-amber-100 text-amber-700",
  },
  [NOTIFICATION_TYPE.VISIT_SUBMIT]: {
    labelKey: "notification_badge_visit_submit",
    titleKey: "notification_title_visit_submit",
    messageKey: "notification_message_visit_submit",
    icon: Calendar,
    badgeClassName: "bg-green-100 text-green-700",
  },
  [NOTIFICATION_TYPE.VISIT_ACCEPT]: {
    labelKey: "notification_badge_visit_accept",
    titleKey: "notification_title_visit_accept",
    messageKey: "notification_message_visit_accept",
    icon: CheckCircle2,
    badgeClassName: "bg-green-100 text-green-700",
  },
  [NOTIFICATION_TYPE.VISIT_REJECT]: {
    labelKey: "notification_badge_visit_reject",
    titleKey: "notification_title_visit_reject",
    messageKey: "notification_message_visit_reject",
    icon: Calendar,
    badgeClassName: "bg-red-100 text-red-700",
  },
  [NOTIFICATION_TYPE.CHANNEL_VERIFICATION]: {
    labelKey: "notification_badge_channel_verification",
    titleKey: "notification_title_channel_verification",
    messageKey: "notification_message_channel_verification",
    icon: Bell,
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  [NOTIFICATION_TYPE.CONTENT_VERIFICATION]: {
    labelKey: "notification_badge_content_verification",
    titleKey: "notification_title_content_verification",
    messageKey: "notification_message_content_verification",
    icon: FileText,
    badgeClassName: "bg-purple-100 text-purple-700",
  },
  [NOTIFICATION_TYPE.EVENT_VERIFICATION]: {
    labelKey: "notification_badge_event_verification",
    titleKey: "notification_title_event_verification",
    messageKey: "notification_message_event_verification",
    icon: GraduationCap,
    badgeClassName: "bg-purple-100 text-purple-700",
  },
  [NOTIFICATION_TYPE.OFFER_VERIFICATION]: {
    labelKey: "notification_badge_offer_verification",
    titleKey: "notification_title_offer_verification",
    messageKey: "notification_message_offer_verification",
    icon: Briefcase,
    badgeClassName: "bg-purple-100 text-purple-700",
  },
  [NOTIFICATION_TYPE.NEW_OFFER]: {
    labelKey: "notification_badge_new_offer",
    titleKey: "notification_title_new_offer",
    messageKey: "notification_message_new_offer",
    icon: Briefcase,
    badgeClassName: "bg-green-100 text-green-700",
  },
  [NOTIFICATION_TYPE.NEW_EVENT]: {
    labelKey: "notification_badge_new_event",
    titleKey: "notification_title_new_event",
    messageKey: "notification_message_new_event",
    icon: GraduationCap,
    badgeClassName: "bg-green-100 text-green-700",
  },
  [NOTIFICATION_TYPE.NEW_CONTENT]: {
    labelKey: "notification_badge_new_content",
    titleKey: "notification_title_new_content",
    messageKey: "notification_message_new_content",
    icon: FileText,
    badgeClassName: "bg-green-100 text-green-700",
  },
};

export function NotificationInbox({
  userType,
  className,
  limit,
  hideHeader,
  respondedEnquiryIds,
}: NotificationInboxProps) {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const router = useRouter();
  const { t } = useLanguage();

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
    const { activityId, type, metadata } = notification;

    if (role === "SELLER") {
      if (type.includes("ENQUIRY")) {
        const id = (metadata?.enquiryId as string) || activityId;
        return id ? `/seller-dashboard/enquiries/${id}` : null;
      }
      if (type.includes("APPOINTMENT")) {
        return `/seller-dashboard/appointments`;
      }
      if (type.includes("QUOTATION")) {
        const id = (metadata?.quotationId as string) || activityId;
        return id ? `/seller-dashboard/quotations/${id}` : null;
      }
    }

    if (role === "BUYER") {
      if (type.includes("QUOTATION")) {
        const id = (metadata?.enquiryId as string) || activityId;
        return id ? `/buyer-dashboard/enquiries/${id}` : null;
      }
      if (type.includes("VISIT")) {
        const id = (metadata?.appointmentId as string) || activityId;
        return id ? `/buyer-dashboard/appointments/${id}` : null;
      }
      if (type.includes("OFFER")) {
        return "/conference-hall?tab=offers";
      }
      if (type.includes("EVENT")) {
        return "/conference-hall?tab=events";
      }
    }

    if (role === "ADMIN") {
      if (type.includes("ENTITY"))
        return activityId
          ? `/admin-dashboard/sellers/product-sellers/${activityId}`
          : null;
      if (type.includes("OFFER")) return `/admin-dashboard/catalog/offers`;
    }

    return null;
  };

  const getDisplay = (notification: Notification) =>
    notificationDisplay[notification.type] || null;

  const metadataForTranslation = (notification: Notification) => ({
    ...(notification.metadata || {}),
    sellerName: String(notification.metadata?.sellerName || "A seller"),
    providerName: String(notification.metadata?.providerName || "A provider"),
  });

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
      {/* {!hideHeader && (
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
      )} */}
      <CardContent className="px-0">
        <ScrollArea className="h-[400px]">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
              <Bell className="size-10 mb-2" />
              <p className="text-sm">No notifications found.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedNotifications.map((notification) => {
                const display = getDisplay(notification);
                const Icon = display?.icon || Bell;
                const metadata = metadataForTranslation(notification);
                const title = display
                  ? t(display.titleKey, metadata)
                  : notification.title;
                const message = display
                  ? t(display.messageKey, metadata)
                  : notification.message;
                const enquiryId = notification.metadata?.enquiryId as
                  | string
                  | undefined;
                const isResponded =
                  userType === "SELLER" &&
                  notification.type === NOTIFICATION_TYPE.ENQUIRY_RECEIVE &&
                  enquiryId &&
                  respondedEnquiryIds?.has(enquiryId);
                const badgeLabel = isResponded
                  ? t("notification_badge_responded")
                  : display
                    ? t(display.labelKey, metadata)
                    : notification.type.replace(/_/g, " ");
                const badgeClassName = isResponded
                  ? "bg-green-100 text-green-700"
                  : display?.badgeClassName || "bg-muted text-muted-foreground";
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
                            {title}
                          </p>
                          <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {message}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1",
                              badgeClassName,
                            )}
                          >
                            {isResponded && <CheckCircle2 size={10} />}
                            {badgeLabel}
                          </span>
                        </div>
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
