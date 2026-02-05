import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  CreateOfferRequest,
  Offer,
  OfferListParams,
  UpdateOfferRequest,
  ConferenceHallEvent,
  CreateEventRequest,
  UpdateEventRequest,
  EventListParams,
  Content,
  CreateContentRequest,
  UpdateContentRequest,
  ContentListParams,
  VerificationRequest,
} from "@/types/conference-hall";

export const conferenceHallService = {
  // Content
  getContents: (params: ContentListParams = {}) => {
    return fetchClient<Content[]>(API_ENDPOINTS.CONFERENCE_HALL.CONTENT.LIST, {
      method: "POST",
      body: params,
    });
  },

  getContent: (id: string) => {
    return fetchClient<Content>(
      `${API_ENDPOINTS.CONFERENCE_HALL.CONTENT.GET}/${id}`,
      {
        method: "GET",
      },
    );
  },

  createContent: (data: CreateContentRequest) => {
    return fetchClient<Content>(API_ENDPOINTS.CONFERENCE_HALL.CONTENT.CREATE, {
      method: "POST",
      body: data,
    });
  },

  updateContent: (id: string, data: UpdateContentRequest) => {
    return fetchClient<Content>(
      `${API_ENDPOINTS.CONFERENCE_HALL.CONTENT.UPDATE}/${id}`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },

  deleteContent: (id: string) => {
    return fetchClient(
      `${API_ENDPOINTS.CONFERENCE_HALL.CONTENT.DELETE}/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  publishContent: (id: string) => {
    return fetchClient<Content>(
      `${API_ENDPOINTS.CONFERENCE_HALL.CONTENT.PUBLISH.replace("/publish", "")}/${id}/publish`,
      {
        method: "POST",
      },
    );
  },

  // Events
  getEvents: (params: EventListParams = {}) => {
    return fetchClient<ConferenceHallEvent[]>(
      API_ENDPOINTS.CONFERENCE_HALL.EVENT.LIST,
      {
        method: "POST",
        body: params,
      },
    );
  },

  getEvent: (id: string) => {
    return fetchClient<ConferenceHallEvent>(
      `${API_ENDPOINTS.CONFERENCE_HALL.EVENT.GET}/${id}`,
      {
        method: "GET",
      },
    );
  },

  createEvent: (data: CreateEventRequest) => {
    return fetchClient<ConferenceHallEvent>(
      API_ENDPOINTS.CONFERENCE_HALL.EVENT.CREATE,
      {
        method: "POST",
        body: data,
      },
    );
  },

  updateEvent: (id: string, data: UpdateEventRequest) => {
    return fetchClient<ConferenceHallEvent>(
      `${API_ENDPOINTS.CONFERENCE_HALL.EVENT.UPDATE}/${id}`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },

  deleteEvent: (id: string) => {
    return fetchClient(`${API_ENDPOINTS.CONFERENCE_HALL.EVENT.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  joinEvent: (id: string, entityId?: string) => {
    return fetchClient(
      `${API_ENDPOINTS.CONFERENCE_HALL.EVENT.JOIN.replace("/join", "")}/${id}/join`,
      {
        method: "POST",
        body: { entityId },
      },
    );
  },

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

  verifyOffer: (id: string, data: VerificationRequest) => {
    return fetchClient<Offer>(
      `${API_ENDPOINTS.CONFERENCE_HALL.OFFER.UPDATE}/${id}/verify`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },

  verifyEvent: (id: string, data: VerificationRequest) => {
    return fetchClient<ConferenceHallEvent>(
      `${API_ENDPOINTS.CONFERENCE_HALL.EVENT.UPDATE}/${id}/verify`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },

  verifyContent: (id: string, data: VerificationRequest) => {
    return fetchClient<Content>(
      `${API_ENDPOINTS.CONFERENCE_HALL.CONTENT.UPDATE}/${id}/verify`,
      {
        method: "PATCH",
        body: data,
      },
    );
  },
};
