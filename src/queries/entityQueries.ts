import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { entityService } from "@/services/entityService";
import {
  CreateEntityRequest,
  UpdateEntityRequest,
  VerifyEntityRequest,
} from "@/types/entity";
import { SELLER_ROLES, USER_ROLE } from "@/constants/roles";

export const entityKeys = {
  all: ["entities"] as const,
  lists: () => [...entityKeys.all, "list"] as const,
  details: () => [...entityKeys.all, "detail"] as const,
};

export function useEntitiesQuery() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const isSeller = !!role && SELLER_ROLES.includes(role as USER_ROLE);
  return useQuery({
    queryKey: entityKeys.lists(),
    queryFn: () => entityService.getAll(),
    enabled: !!token && isSeller,
  });
}

export function useCreateEntityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntityRequest) => entityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUpdateEntityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntityRequest }) =>
      entityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useVerifyEntityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyEntityRequest }) =>
      entityService.verify(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
