import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entityService } from "@/services/entityService";
import { CreateEntityRequest, UpdateEntityRequest, VerifyEntityRequest } from "@/types/entity";

export const entityKeys = {
  all: ["entities"] as const,
  lists: () => [...entityKeys.all, "list"] as const,
  details: () => [...entityKeys.all, "detail"] as const,
};

export function useEntitiesQuery() {
  return useQuery({
    queryKey: entityKeys.lists(),
    queryFn: () => entityService.getAll(),
  });
}

export function useCreateEntityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntityRequest) => entityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.lists() });
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
    },
  });
}
