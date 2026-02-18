import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchClient from "@/lib/api-client";

const SUPPORT_API = "/support";

export const useSupportCategoriesQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["support-categories"],
    queryFn: async () => {
      return fetchClient(`${SUPPORT_API}/categories`);
    },
    enabled,
  });
};

export const useSupportQueriesQuery = (status?: string, enabled = true) => {
  return useQuery({
    queryKey: ["support-queries", status],
    queryFn: async () => {
      return fetchClient(`${SUPPORT_API}/queries`, {
        query: status ? { status } : undefined,
      });
    },
    enabled,
  });
};

export const useSupportQueryDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["support-query", id],
    queryFn: async () => {
      return fetchClient(`${SUPPORT_API}/queries/${id}`);
    },
    enabled: !!id,
  });
};

export const useCreateSupportQueryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return fetchClient(`${SUPPORT_API}/queries`, {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-queries"] });
    },
  });
};

export const useAddSupportMessageMutation = (queryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { message: string; attachmentIds?: string[] }) => {
      return fetchClient(`${SUPPORT_API}/queries/${queryId}/messages`, {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-query", queryId] });
    },
  });
};

export const useUpdateSupportQueryMutation = (queryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return fetchClient(`${SUPPORT_API}/queries/${queryId}`, {
        method: "PATCH",
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-query", queryId] });
      queryClient.invalidateQueries({ queryKey: ["support-queries"] });
    },
  });
};
