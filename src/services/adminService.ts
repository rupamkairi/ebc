import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { CreateAdminSubordinateRequest, SessionResponse } from "@/types/auth";

export interface UserListParams {
  role?: string;
  phoneVerified?: boolean;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export const adminService = {
  async createAdminManager(data: CreateAdminSubordinateRequest) {
    return fetchClient(API_ENDPOINTS.AUTH.ADMIN.CREATE_MANAGER, {
      method: "POST",
      body: data,
    });
  },

  async createAdminAccountant(data: CreateAdminSubordinateRequest) {
    return fetchClient(API_ENDPOINTS.AUTH.ADMIN.CREATE_ACCOUNTANT, {
      method: "POST",
      body: data,
    });
  },

  async createAdminExecutive(data: CreateAdminSubordinateRequest) {
    return fetchClient(API_ENDPOINTS.AUTH.ADMIN.CREATE_EXECUTIVE, {
      method: "POST",
      body: data,
    });
  },

  async getUsers(params: UserListParams = {}) {
    return fetchClient<SessionResponse["user"][]>(
      API_ENDPOINTS.AUTH.ADMIN.LIST_USERS,
      {
        method: "POST",
        body: params as Record<string, string | number | boolean>,
        // query: params as Record<string, string | number | boolean>,
      }
    );
  },
};
