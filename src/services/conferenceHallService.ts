import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  CreateOfferRequest,
  Offer,
  OfferListParams,
  UpdateOfferRequest,
} from "@/types/conference-hall";

export const conferenceHallService = {
  // Offers
  getOffers: (params: OfferListParams = {}) => {
    return fetchClient<Offer[]>(API_ENDPOINTS.CONFERENCE_HALL.OFFER.LIST, {
      method: "POST",
      body: params,
    });
  },

  getOffer: (id: string) => {
    return fetchClient<Offer>(
      `${API_ENDPOINTS.CONFERENCE_HALL.OFFER.GET}/${id}`,
      {
        method: "GET",
      },
    );
  },

  createOffer: (data: CreateOfferRequest) => {
    return fetchClient<Offer>(API_ENDPOINTS.CONFERENCE_HALL.OFFER.CREATE, {
      method: "POST",
      body: data,
    });
  },

  updateOffer: (id: string, data: UpdateOfferRequest) => {
    return fetchClient<Offer>(
      `${API_ENDPOINTS.CONFERENCE_HALL.OFFER.UPDATE}/${id}`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },

  deleteOffer: (id: string) => {
    return fetchClient(`${API_ENDPOINTS.CONFERENCE_HALL.OFFER.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  publishOffer: (id: string) => {
    return fetchClient<Offer>(
      `${API_ENDPOINTS.CONFERENCE_HALL.OFFER.PUBLISH.replace("/publish", "")}/${id}/publish`,
      {
        method: "POST",
      },
    );
  },

  publishOfferViaUrl: (id: string) => {
    return fetchClient<Offer>(
      `${API_ENDPOINTS.CONFERENCE_HALL.OFFER.PUBLISH.replace("/publish", "")}/${id}/publish`,
      { method: "POST" },
    );
  },
};
