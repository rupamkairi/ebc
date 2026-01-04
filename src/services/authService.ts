import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  AdminLoginRequest,
  AuthResponse,
  SessionResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  UpdateProfileRequest,
} from "@/types/auth";
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

  async sendOtp(data: SendOtpRequest): Promise<{ message: string }> {
    return fetchClient<{ message: string }>(API_ENDPOINTS.AUTH.USER.SEND_OTP, {
      method: "POST",
      body: data,
      auth: false,
    });
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    return fetchClient<AuthResponse>(API_ENDPOINTS.AUTH.USER.VERIFY_OTP, {
      method: "POST",
      body: data,
      auth: false,
    });
  },

  async getSession(): Promise<SessionResponse> {
    return fetchClient<SessionResponse>(API_ENDPOINTS.AUTH.SESSION, {
      method: "GET",
    });
  },

  async updateProfile(data: UpdateProfileRequest) {
    return fetchClient(API_ENDPOINTS.AUTH.USER.UPDATE_PROFILE, {
      method: "PATCH",
      body: data,
    });
  },

  logout() {
    useAuthStore.getState().logout();
  },
};
