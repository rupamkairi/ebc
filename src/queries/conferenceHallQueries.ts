import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conferenceHallService } from "@/services/conferenceHallService";
import {
  CreateOfferRequest,
  UpdateOfferRequest,
  OfferListParams,
} from "@/types/conference-hall";
import { keepPreviousData } from "@tanstack/react-query";

export const conferenceHallKeys = {
  all: ["conference-hall"] as const,
  offers: (params: OfferListParams) =>
    [...conferenceHallKeys.all, "offers", params] as const,
  offer: (id: string) => [...conferenceHallKeys.all, "offer", id] as const,
};

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
