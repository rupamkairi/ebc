import { aiKnowledgeService } from "@/services/aiKnowledgeService";
import { CreateAiKnowledgeSourcesRequest } from "@/types/ai-knowledge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const aiKnowledgeKeys = {
  all: ["ai-knowledge"] as const,
  sources: () => [...aiKnowledgeKeys.all, "sources"] as const,
};

export function useAiKnowledgeSourcesQuery(refetchInterval = 8000) {
  return useQuery({
    queryKey: aiKnowledgeKeys.sources(),
    queryFn: () => aiKnowledgeService.listSources(),
    refetchInterval,
  });
}

export function useCreateAiKnowledgeSourcesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAiKnowledgeSourcesRequest) =>
      aiKnowledgeService.createSources(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKnowledgeKeys.all });
    },
  });
}

export function useReindexAiKnowledgeSourceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiKnowledgeService.reindexSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKnowledgeKeys.all });
    },
  });
}

export function useDeleteAiKnowledgeSourceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiKnowledgeService.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKnowledgeKeys.all });
    },
  });
}
