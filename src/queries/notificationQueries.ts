import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { notificationService } from "@/services/notificationService";
import { AddChannelRequest, UpdateChannelRequest } from "@/types/notification";
import { toast } from "sonner";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: any) => [...notificationKeys.all, "list", params] as const,
  channels: () => [...notificationKeys.all, "channels"] as const,
};

export const useNotificationsQuery = (params?: {
  type?: string;
  activityId?: string;
}) => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getNotifications(params),
    enabled: !!token,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useNotificationChannelsQuery = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: notificationKeys.channels(),
    queryFn: () => notificationService.getChannels(),
    enabled: !!token,
  });
};

export const useAddChannelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddChannelRequest) =>
      notificationService.addChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.channels() });
    },
  });
};

export const useVerifyChannelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, otp }: { id: string; otp: string }) =>
      notificationService.verifyChannel(id, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.channels() });
      toast.success("Channel verified successfully!");
    },
    onError: () => {
      toast.error("Failed to verify channel. Please check the OTP.");
    },
  });
};

export const useUpdateChannelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChannelRequest }) =>
      notificationService.updateChannel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.channels() });
      toast.success("Channel updated successfully!");
    },
  });
};

export const useDeleteChannelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.deleteChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.channels() });
      toast.success("Channel removed successfully!");
    },
  });
};
