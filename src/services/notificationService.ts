import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  AddChannelRequest,
  Notification,
  NotificationChannel,
  UpdateChannelRequest,
} from "@/types/notification";

export const notificationService = {
  // Inbox
  async getNotifications(params?: {
    type?: string;
    activityId?: string;
  }): Promise<Notification[]> {
    const response = await fetchClient<Notification[]>(
      API_ENDPOINTS.NOTIFICATION.LIST,
      {
        method: "POST",
        body: params,
      },
    );
    return response;
  },

  async markAsRead(id: string): Promise<void> {
    await fetchClient(`${API_ENDPOINTS.NOTIFICATION.MARK_READ}/${id}`, {
      method: "PATCH",
    });
  },

  // Channels
  async getChannels(): Promise<NotificationChannel[]> {
    return fetchClient<NotificationChannel[]>(
      API_ENDPOINTS.NOTIFICATION_CHANNEL.LIST,
      {
        method: "GET",
      },
    );
  },

  async addChannel(data: AddChannelRequest): Promise<NotificationChannel> {
    return fetchClient<NotificationChannel>(
      API_ENDPOINTS.NOTIFICATION_CHANNEL.CREATE,
      {
        method: "POST",
        body: data,
      },
    );
  },

  async verifyChannel(id: string, otp: string): Promise<void> {
    await fetchClient(
      `${API_ENDPOINTS.NOTIFICATION_CHANNEL.VERIFY}/${id}/verify`,
      {
        method: "POST",
        body: { otp },
      },
    );
  },

  async updateChannel(
    id: string,
    data: UpdateChannelRequest,
  ): Promise<NotificationChannel> {
    return fetchClient<NotificationChannel>(
      `${API_ENDPOINTS.NOTIFICATION_CHANNEL.UPDATE}/${id}`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },

  async deleteChannel(id: string): Promise<void> {
    await fetchClient(`${API_ENDPOINTS.NOTIFICATION_CHANNEL.DELETE}/${id}`, {
      method: "DELETE",
    });
  },
};
