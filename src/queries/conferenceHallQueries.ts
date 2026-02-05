import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conferenceHallService } from "@/services/conferenceHallService";
import {
  CreateOfferRequest,
  UpdateOfferRequest,
  OfferListParams,
  EventListParams,
  CreateEventRequest,
  UpdateEventRequest,
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
} from "@/types/conference-hall";
import { keepPreviousData } from "@tanstack/react-query";
import { walletKeys } from "./walletQueries";

export const conferenceHallKeys = {
  all: ["conference-hall"] as const,
  offers: (params: OfferListParams) =>
    [...conferenceHallKeys.all, "offers", params] as const,
  offer: (id: string) => [...conferenceHallKeys.all, "offer", id] as const,
  events: (params: EventListParams) =>
    [...conferenceHallKeys.all, "events", params] as const,
  event: (id: string) => [...conferenceHallKeys.all, "event", id] as const,
  contents: (params: ContentListParams) =>
    [...conferenceHallKeys.all, "contents", params] as const,
  content: (id: string) => [...conferenceHallKeys.all, "content", id] as const,
};

// Contents
export function useContentsQuery(params: ContentListParams = {}) {
  return useQuery({
    queryKey: conferenceHallKeys.contents(params),
    queryFn: () => conferenceHallService.getContents(params),
    placeholderData: keepPreviousData,
  });
}

export function useContentQuery(id: string) {
  return useQuery({
    queryKey: conferenceHallKeys.content(id),
    queryFn: () => conferenceHallService.getContent(id),
    enabled: !!id,
  });
}

export function useCreateContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentRequest) =>
      conferenceHallService.createContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
    },
  });
}

export function useUpdateContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContentRequest }) =>
      conferenceHallService.updateContent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({
        queryKey: conferenceHallKeys.content((data as any).id),
      });
    },
  });
}

export function useDeleteContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conferenceHallService.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
    },
  });
}

export function usePublishContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conferenceHallService.publishContent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({
        queryKey: conferenceHallKeys.content((data as any).id),
      });
    },
  });
}

// Events
export function useEventsQuery(params: EventListParams = {}) {
  return useQuery({
    queryKey: conferenceHallKeys.events(params),
    queryFn: () => conferenceHallService.getEvents(params),
    placeholderData: keepPreviousData,
  });
}

export function useEventQuery(id: string) {
  return useQuery({
    queryKey: conferenceHallKeys.event(id),
    queryFn: () => conferenceHallService.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventRequest) =>
      conferenceHallService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      conferenceHallService.updateEvent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({
        queryKey: conferenceHallKeys.event((data as any).id),
      });
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conferenceHallService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
    },
  });
}

export function useJoinEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, entityId }: { id: string; entityId?: string }) =>
      conferenceHallService.joinEvent(id, entityId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({
        queryKey: conferenceHallKeys.event(data.eventId),
      });
    },
  });
}

// Offers
export function useOffersQuery(params: OfferListParams = {}) {
  return useQuery({
    queryKey: conferenceHallKeys.offers(params),
    queryFn: () => conferenceHallService.getOffers(params),
    placeholderData: keepPreviousData,
  });
}

export function useOfferQuery(id: string) {
  return useQuery({
    queryKey: conferenceHallKeys.offer(id),
    queryFn: () => conferenceHallService.getOffer(id),
    enabled: !!id,
  });
}

export function useCreateOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOfferRequest) =>
      conferenceHallService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
    },
  });
}

export function useUpdateOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOfferRequest }) =>
      conferenceHallService.updateOffer(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({
        queryKey: conferenceHallKeys.offer(data.id),
      });
    },
  });
}

export function useDeleteOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conferenceHallService.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
    },
  });
}

export function usePublishOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conferenceHallService.publishOffer(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conferenceHallKeys.all });
      queryClient.invalidateQueries({
        queryKey: conferenceHallKeys.offer(data.id),
      });
    },
  });
}
