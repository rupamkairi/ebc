import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { 
  Entity, 
  CreateEntityRequest, 
  UpdateEntityRequest, 
  VerifyEntityRequest 
} from "@/types/entity";

export const entityService = {
  async create(data: CreateEntityRequest): Promise<Entity> {
    return fetchClient<Entity>(API_ENDPOINTS.ENTITY.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async getAll(): Promise<Entity[]> {
    return fetchClient<Entity[]>(API_ENDPOINTS.ENTITY.GET_ALL, {
      method: "GET",
    });
  },

  async update(id: string, data: UpdateEntityRequest): Promise<Entity> {
    return fetchClient<Entity>(`${API_ENDPOINTS.ENTITY.UPDATE}/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  async verify(id: string, data: VerifyEntityRequest): Promise<Entity> {
    return fetchClient<Entity>(`${API_ENDPOINTS.ENTITY.VERIFY}/${id}/verify`, {
      method: "PATCH",
      body: data,
    });
  },
};
