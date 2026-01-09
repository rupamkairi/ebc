import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, UserListParams } from "@/services/adminService";
import { CreateAdminSubordinateRequest } from "@/types/auth";

export const adminKeys = {
  all: ["admin"] as const,
  users: (params: UserListParams) =>
    [...adminKeys.all, "users", params] as const,
};

import { keepPreviousData } from "@tanstack/react-query";

export function useUsersQuery(params: UserListParams = {}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminManagersQuery(params: UserListParams = {}) {
  return useUsersQuery(params);
}

export function useCreateAdminManagerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminSubordinateRequest) =>
      adminService.createAdminManager(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useCreateAdminAccountantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminSubordinateRequest) =>
      adminService.createAdminAccountant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useCreateAdminExecutiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminSubordinateRequest) =>
      adminService.createAdminExecutive(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}
