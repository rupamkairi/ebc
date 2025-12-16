import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  AdminLoginRequest,
  AuthResponse,
  CreateAdminRequest,
  CreateAdminSubordinateRequest,
  SessionResponse,
} from "@/types/auth";

// --- Mutations ---

export function useAdminLogin() {
  const setToken = useAuthStore((state) => state.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminLoginRequest) =>
      fetchClient<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN.LOGIN, {
        method: "POST",
        body: data,
        auth: false,
      }),
    onSuccess: (data) => {
      setToken(data.token);
      // Invalidate session to fetch fresh user data
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    },
  });
}

export function useCreateAdmin() {
  return useMutation({
    mutationFn: (data: CreateAdminRequest) =>
      fetchClient<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN.CREATE_ADMIN, {
        method: "POST",
        body: data,
        auth: false, // Public if no admin exists
      }),
  });
}

export function useCreateAdminManager() {
  return useMutation({
    mutationFn: (data: CreateAdminSubordinateRequest) =>
      fetchClient<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN.CREATE_MANAGER, {
        method: "POST",
        body: data,
      }),
  });
}

export function useCreateAdminAccountant() {
  return useMutation({
    mutationFn: (data: CreateAdminSubordinateRequest) =>
      fetchClient<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN.CREATE_ACCOUNTANT, {
        method: "POST",
        body: data,
      }),
  });
}

export function useCreateAdminExecutive() {
  return useMutation({
    mutationFn: (data: CreateAdminSubordinateRequest) =>
      fetchClient<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN.CREATE_EXECUTIVE, {
        method: "POST",
        body: data,
      }),
  });
}

// --- Queries ---

export const SESSION_QUERY_KEY = ["session"];

export function useSession() {
  const token = useAuthStore((state) => state.token); // Dependency to refetch if token changes

  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchClient<SessionResponse>(
        API_ENDPOINTS.AUTH.SESSION,
        {
          method: "GET",
        }
      );
      return data;
    },
    enabled: !!token, // Only fetch if we have a token
    retry: false, // Don't retry if session fails (likely invalid token)
  });
}

// Helper to sync session with store
export function useSyncSession() {
  const { data, isSuccess, isError, error } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.user);
    }
  }, [isSuccess, data, setUser]);

  useEffect(() => {
    if (isError) {
      // Optional: Handle session expiry/invalid token
      // console.error("Session Sync Error:", error);
      // setToken(null);
      // setUser(null);
    }
  }, [isError, error]);

  return { isSuccess, isError };
}
