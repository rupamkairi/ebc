import { Category, Brand, Specification, Item, ItemListing } from "./catalog";
import { TargetRegion } from "./region";

export enum VERIFICATION_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  REVISE = "REVISE",
  MISINFORMATION = "MISINFORMATION",
  INAPPROPRIATE = "INAPPROPRIATE",
  OTHER = "OTHER",
}

export interface ConferenceHallEvent {
  id: string;
  name: string;
  description?: string;
  type: "LIVE" | "RECORDED";
  isPublic: boolean;
  isActive: boolean;
  isPhysical: boolean;
  isRemote: boolean;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  meetingUrl: string | null;
  createdAt: string;
  updatedAt: string;
  entityId: string;
  createdById: string;
  pincodeId?: string | null;
  hasJoined?: boolean;
  verificationStatus?: VERIFICATION_STATUS;
  verificationRemark?: string;
  entity?: {
    id: string;
    name: string;
  };
  attachments?: {
    id: string;
    mediaId?: string;
    documentId?: string;
    media?: {
      id: string;
      name: string;
      url: string;
    };
    document?: {
      id: string;
      name: string;
      url: string;
    };
  }[];
  _count?: {
    participants: number;
  };
  targetRegions?: TargetRegion[];
}

export interface EventAudience {
  state?: string;
  wholeState?: boolean;
  district?: string;
  wholeDistrict?: boolean;
  pincodeId?: string;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  entityId: string;
  type: "LIVE" | "RECORDED";
  isActive?: boolean;
  isPublic?: boolean;
  isPhysical?: boolean;
  isRemote?: boolean;
  startDate?: string;
  endDate?: string;
  location?: string;
  meetingUrl?: string;
  pincodeId?: string;
  attachmentIds?: { mediaId?: string; documentId?: string }[];
  targetRegions?: { pincodeId: string }[];
}

export type UpdateEventRequest = Partial<CreateEventRequest>;

export interface EventListParams {
  entityId?: string;
  isActive?: boolean;
  isPublic?: boolean;
  type?: "LIVE" | "RECORDED";
  isRemote?: boolean;
  isPhysical?: boolean;
  timeframe?: "FUTURE" | "PAST" | "ALL";
  search?: string;
  targeting?: {
    pincodeId?: string;
    district?: string;
    state?: string;
  };
}

export type OfferRelationType =
  | "CATEGORY"
  | "BRAND"
  | "SPECIFICATION"
  | "ITEM"
  | "ITEM_LISTING";

export interface OfferDetail {
  id: string;
  startDate: string | null;
  endDate: string | null;
  publishedAt: string | null;
  isPublic: boolean;
  offerId: string;
  attachments?: string[];
}

export interface OfferPincode {
  id: string;
  state: string;
  district: string;
  pincode: string;
}

export interface OfferRegion {
  id: string;
  pincodeId: string;
  offerId: string;
  pincode?: OfferPincode;
}

export interface OfferRelation {
  id: string;
  offerId: string;
  relationType: OfferRelationType;
  relationId: string;

  categoryId?: string | null;
  brandId?: string | null;
  specificationId?: string | null;
  itemId?: string | null;
  itemListingId?: string | null;

  category?: Category | null;
  brand?: Brand | null;
  specification?: Specification | null;
  item?: Item | null;
  itemListing?: ItemListing | null;
}

export type OfferStatus = "DRAFT" | "PUBLISHED" | "INACTIVE";

export interface Offer {
  id: string;
  entityId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedById: string | null;

  createdById: string;
  verificationStatus?: VERIFICATION_STATUS;
  verificationRemark?: string;

  // Nested Data
  offerDetails: OfferDetail[];
  targetRegions: TargetRegion[];
  offerRelations: OfferRelation[];

  // We keep status for frontend logic, but might need to derive it if not in JSON
  status?: OfferStatus;
}

export interface CreateOfferRequest {
  entityId: string;
  name: string;
  description?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  categoryIds: string[];
  brandIds: string[];
  specificationIds: string[];
  itemIds: string[];
  itemListingIds: string[];
  targetRegions: { pincodeId: string }[];
  attachmentIds: { mediaId?: string; documentId?: string }[];
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

export interface Content {
  id: string;
  name: string;
  description: string;
  entityId: string;
  isActive: boolean;
  isPublic: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedById: string | null;

  createdById: string;
  verificationStatus?: VERIFICATION_STATUS;
  verificationRemark?: string;

  attachments?: {
    id: string;
    mediaId?: string;
    documentId?: string;
    media?: {
      id: string;
      name: string;
      url: string;
    };
    document?: {
      id: string;
      name: string;
      url: string;
    };
  }[];
  targetRegions?: TargetRegion[];
}

export interface CreateContentRequest {
  name: string;
  description: string;
  entityId: string;
  isActive: boolean;
  attachmentIds: { mediaId?: string; documentId?: string }[];
  targetRegions?: { pincodeId: string }[];
}

export interface UpdateContentRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  isPublic?: boolean;
  targetRegions?: { pincodeId: string }[];
  attachmentIds?: { mediaId?: string; documentId?: string }[];
}

export interface ContentListParams {
  entityId?: string;
  isActive?: boolean;
  isPublic?: boolean;
  search?: string;
}

export interface VerificationRequest {
  status: VERIFICATION_STATUS;
  remarks?: string;
}
