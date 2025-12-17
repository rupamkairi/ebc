import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AdminLoginRequest, AuthResponse, SessionResponse } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";

export const authService = {
  async login(data: AdminLoginRequest): Promise<AuthResponse> {
    const response = await fetchClient<AuthResponse>(
      API_ENDPOINTS.AUTH.ADMIN.LOGIN,
      {
        method: "POST",
        body: data,
        auth: false,
      }
    );
    return response;
  },

  async getSession(): Promise<SessionResponse> {
    return fetchClient<SessionResponse>(API_ENDPOINTS.AUTH.SESSION, {
      method: "GET",
    });
  },

  logout() {
    useAuthStore.getState().logout();
  },
};
