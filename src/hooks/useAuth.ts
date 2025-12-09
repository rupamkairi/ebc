"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { sendOtp, verifyOtp, fetchCurrentUser } from "@/queries/auth";
import { useAuthStore } from "@/store/authStore";
import { setAuthToken } from "@/lib/axios";
import { useEffect } from "react";

export function useAuth() {
  const { token, setToken, setUser } = useAuthStore();

  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { phone: string; code: string }) => {
      const data = await verifyOtp(payload);

      if (data?.token) {
        setToken(data.token);
        setAuthToken(data.token);
      }

      return data;
    },
  });

  const userQuery = useQuery({
    queryKey: ["current_user"],
    queryFn: fetchCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  return {
    token,
    sendOtpMutation,
    verifyOtpMutation,
    userQuery,
  };
}
