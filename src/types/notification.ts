export type NotificationChannelType = "EMAIL" | "PHONE" | "PUSH" | "WHATSAPP";

export interface NotificationChannel {
  id: string;
  type: NotificationChannelType;
  destination: string;
  isActive: boolean;
  isVerified: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddChannelRequest {
  type: NotificationChannelType;
  destination: string;
  name: string;
}

export interface VerifyChannelOTPRequest {
  otp: string;
}

export interface UpdateChannelRequest {
  isActive?: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  activityId?: string;
  activityType?: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
}
