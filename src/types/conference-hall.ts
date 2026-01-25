export interface ConferenceHallEvent {
  id: string;
  name: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OfferRelationType =
  | "CATEGORY"
  | "BRAND"
  | "SPECIFICATION"
  | "ITEM"
  | "ITEM_LISTING";

export interface OfferRelation {
  id: string;
  offerId: string;
  relationType: OfferRelationType;
  relationId: string;
  // Optional expanded details if needed, usually just IDs are enough for creation
}

export interface OfferRegion {
  id: string;
  offerId: string;
  pincodeId: string;
}

export type OfferStatus = "DRAFT" | "PUBLISHED" | "INACTIVE";

export interface Offer {
  id: string;
  entityId: string;
  name: string;
  description?: string;
  status: OfferStatus; // DRAFT, PUBLISHED, INACTIVE

  // Dates
  startDate: string;
  endDate: string;

  // Visibility
  isActive: boolean;
  isPublic: boolean;

  // Relations & Regions
  relations: OfferRelation[];
  regions: OfferRegion[];

  // Attachments (joined strings of IDs usually, or objects)
  attachments: string[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferRequest {
  entityId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPublic: boolean;
  attachments?: string[];

  // For relations, we might send an array of objects
  relations: {
    relationType: OfferRelationType;
    relationId: string;
  }[];

  // For regions, list of pincode IDs
  pincodeIds: string[];
}

export type UpdateOfferRequest = Partial<CreateOfferRequest>;

export interface PublishOfferRequest {
  offerId: string;
}

export interface OfferListParams {
  entityId?: string;
  status?: OfferStatus;
  search?: string;
  isActive?: boolean;
}
