import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchClient from "@/lib/api-client";
import { Review, ReviewSummary, CreateReviewRequest } from "@/types/review";

const REVIEW_API = "/review";

export const useEntityReviewsQuery = (entityId: string) => {
  return useQuery({
    queryKey: ["entity-reviews", entityId],
    queryFn: async () => {
      const resp = await fetchClient(`${REVIEW_API}/entity/${entityId}`);
      return (resp.data || resp) as Review[];
    },
    enabled: !!entityId,
  });
};

export const useEntityReviewsFullQuery = (entityId: string) => {
  return useQuery({
    queryKey: ["entity-reviews-full", entityId],
    queryFn: async () => {
      const resp = await fetchClient(`${REVIEW_API}/entity/${entityId}/all`);
      return (resp.data || resp) as Review[];
    },
    enabled: !!entityId,
  });
};

export const useReviewSummaryQuery = (entityId: string) => {
  return useQuery({
    queryKey: ["review-summary", entityId],
    queryFn: async () => {
      const resp = await fetchClient(`${REVIEW_API}/entity/${entityId}/summary`);
      return (resp.data || resp) as ReviewSummary;
    },
    enabled: !!entityId,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReviewRequest) => {
      return fetchClient(`${REVIEW_API}`, {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.entityId) {
        queryClient.invalidateQueries({ queryKey: ["entity-reviews", variables.entityId] });
      }
    },
  });
};

export const useTogglePinReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, entityId, isPinned }: { reviewId: string; entityId: string; isPinned: boolean }) => {
      return fetchClient(`${REVIEW_API}/${reviewId}/pin`, {
        method: "PATCH",
        body: { entityId, isPinned },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["entity-reviews-full", variables.entityId] });
      queryClient.invalidateQueries({ queryKey: ["entity-reviews", variables.entityId] });
    },
  });
};

export const useToggleHideReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, entityId, isHidden }: { reviewId: string; entityId: string; isHidden: boolean }) => {
      return fetchClient(`${REVIEW_API}/${reviewId}/hide`, {
        method: "PATCH",
        body: { entityId, isHidden },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["entity-reviews-full", variables.entityId] });
      queryClient.invalidateQueries({ queryKey: ["admin-hidden-reviews"] });
    },
  });
};

export const useAdminHiddenReviewsQuery = () => {
  return useQuery({
    queryKey: ["admin-hidden-reviews"],
    queryFn: async () => {
      return fetchClient(`${REVIEW_API}/admin/hidden`);
    },
  });
};
