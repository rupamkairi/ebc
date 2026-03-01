import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchClient from "@/lib/api-client";
import { CreatePostRequest, ForumContextResponse } from "@/types/forum";

const FORUM_API = "/forum";

export const useForumContextQuery = (params: {
  eventId?: string;
  offerId?: string;
  itemId?: string;
  slug?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.eventId) queryParams.append("eventId", params.eventId);
  if (params.offerId) queryParams.append("offerId", params.offerId);
  if (params.itemId) queryParams.append("itemId", params.itemId);
  if (params.slug) queryParams.append("slug", params.slug);

  return useQuery({
    queryKey: ["forum-context", params],
    queryFn: async () => {
      const resp = await fetchClient(
        `${FORUM_API}/context?${queryParams.toString()}`,
      );
      return ((resp as any).data || resp) as ForumContextResponse;
    },
    enabled: !!(
      params.eventId ||
      params.offerId ||
      params.itemId ||
      params.slug
    ),
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      return fetchClient(`${FORUM_API}/${payload.discussionId}/post`, {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forum-context"] });
    },
  });
};

export const useFlagPostMutation = () => {
  return useMutation({
    mutationFn: async ({
      postId,
      reason,
    }: {
      postId: string;
      reason: string;
    }) => {
      return fetchClient(`${FORUM_API}/post/${postId}/flag`, {
        method: "PATCH",
        body: { reason },
      });
    },
  });
};

export const useToggleHidePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      isHidden,
    }: {
      postId: string;
      isHidden: boolean;
    }) => {
      return fetchClient(`${FORUM_API}/post/${postId}/hide`, {
        method: "PATCH",
        body: { isHidden },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-context"] });
    },
  });
};
