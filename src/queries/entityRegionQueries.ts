import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entityRegionService } from "@/services/entityRegionService";
import { EntityRegion, RegionScopeInput } from "@/types/region";

export const entityRegionKeys = {
  all: ["entity-region"] as const,
  byEntity: (entityId: string) => [...entityRegionKeys.all, entityId] as const,
};

export function useEntityRegionsQuery(entityId: string | undefined) {
  return useQuery<EntityRegion[]>({
    queryKey: entityRegionKeys.byEntity(entityId ?? ""),
    queryFn: () => entityRegionService.list(entityId!),
    enabled: !!entityId,
  });
}

export function useSyncEntityRegionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityId, regions }: { entityId: string; regions: RegionScopeInput[] }) =>
      entityRegionService.sync(entityId, regions),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: entityRegionKeys.byEntity(variables.entityId) });
    },
  });
}
