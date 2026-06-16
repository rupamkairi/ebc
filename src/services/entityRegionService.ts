import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { EntityRegion, RegionScopeInput } from "@/types/region";

export const entityRegionService = {
  list: (entityId: string): Promise<EntityRegion[]> =>
    fetchClient<EntityRegion[]>(`${API_ENDPOINTS.ENTITY_REGION.LIST}?entityId=${entityId}`),

  sync: (entityId: string, regions: RegionScopeInput[]): Promise<EntityRegion[]> =>
    fetchClient<EntityRegion[]>(API_ENDPOINTS.ENTITY_REGION.SYNC, {
      method: "POST",
      body: { entityId, regions },
    }),
};
