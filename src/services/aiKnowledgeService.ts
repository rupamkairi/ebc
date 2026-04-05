import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  AiKnowledgeSource,
  CreateAiKnowledgeSourcesRequest,
  CreateAiKnowledgeSourcesResponse,
  DeleteAiKnowledgeSourceResponse,
  ReindexAiKnowledgeSourceResponse,
} from "@/types/ai-knowledge";

const withId = (template: string, id: string) => template.replace(":id", id);

export const aiKnowledgeService = {
  listSources: async () =>
    fetchClient<AiKnowledgeSource[]>(API_ENDPOINTS.AI_KNOWLEDGE.SOURCES),

  createSources: async (payload: CreateAiKnowledgeSourcesRequest) =>
    fetchClient<CreateAiKnowledgeSourcesResponse>(
      API_ENDPOINTS.AI_KNOWLEDGE.SOURCES,
      {
        method: "POST",
        body: payload,
      },
    ),

  reindexSource: async (id: string) =>
    fetchClient<ReindexAiKnowledgeSourceResponse>(
      withId(API_ENDPOINTS.AI_KNOWLEDGE.REINDEX, id),
      {
        method: "POST",
      },
    ),

  deleteSource: async (id: string) =>
    fetchClient<DeleteAiKnowledgeSourceResponse>(
      withId(API_ENDPOINTS.AI_KNOWLEDGE.DELETE, id),
      {
        method: "DELETE",
      },
    ),
};
