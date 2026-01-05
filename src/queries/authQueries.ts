"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useSessionQuery() {
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: [...authKeys.session(), token],
    queryFn: () => authService.getSession(),
    enabled: !!token,
  });

  useEffect(() => {
    if (query.data?.user) {
      setUser(query.data.user);
    }
  }, [query.data, setUser]);

  return query;
}

export function useRefreshSession() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: authKeys.session() });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof authService.updateProfile>[0]) =>
      authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (data: Parameters<typeof authService.sendOtp>[0]) =>
      authService.sendOtp(data),
  });
}

export function useVerifyOtpMutation() {
  const setToken = useAuthStore((state) => state.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof authService.verifyOtp>[0]) =>
      authService.verifyOtp(data),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}
