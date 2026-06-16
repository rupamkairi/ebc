import { ITEM_TYPE } from "@/constants/enums";
import { UnitType } from "@/constants/quantities";
import { Entity } from "./entity";

export interface Media {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface Document {
  id: string;
  url: string;
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  fileType?: string;
}

export interface Attachment {
  id: string;
  mediaId?: string;
  documentId?: string;
  media?: Media;
  document?: Document;
}

export interface Category {
  id: string;
  name: string;
  type: ITEM_TYPE;
  parentCategoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  parentCategory?: Category;
  subCategories?: Category[];
  categoryIconId?: string | null;
  categoryIcon?: Media;
  image?: string;
  roomId?: string | null;
  room?: Room;
}

export interface Brand {
  id: string;
  name: string;
  brandLogoId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  brandLogo?: Media;
}

export interface Specification {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  name: string;
  staticId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ITEM_TYPE;
  HSNCode?: string | null;
  GSTPercentage: number;
  categoryId: string;
  brandId?: string | null;
  specificationId: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  brand?: Brand;
  specification?: Specification;
  roomId?: string | null;
  room?: Room;
  /** Convenience field: populated from the backend's acceptableUnitTypes column */
  acceptableUnitTypes?: UnitType[] | null;
}

export interface CreateCategoryRequest {
  name: string;
  type: ITEM_TYPE;
  isSubCategory: boolean;
  parentCategoryId?: string;
  categoryIconId?: string;
  roomId?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  type?: ITEM_TYPE;
  isSubCategory?: boolean;
  parentCategoryId?: string | null;
  categoryIconId?: string | null;
  roomId?: string | null;
}

export interface CategoryListParams {
  type?: ITEM_TYPE;
  isSubCategory?: boolean;
  parentCategoryId?: string;
  roomId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}

export interface CreateBrandRequest {
  name: string;
  brandLogoId?: string;
}

export interface UpdateBrandRequest {
  id: string;
  name: string;
  brandLogoId?: string;
}

export interface BrandListParams {
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}

export interface CreateSpecificationRequest {
  name: string;
  description?: string;
}

export interface UpdateSpecificationRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface SpecificationListParams {
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}

export interface CreateItemRequest {
  name: string;
  description: string;
  type: ITEM_TYPE;
  HSNCode?: string | null;
  GSTPercentage: number;
  categoryId: string;
  brandId?: string | null;
  specificationId: string;
  roomId?: string | null;
  acceptableUnitTypes?: UnitType[];
}

export interface UpdateItemRequest {
  id: string;
  name?: string;
  description?: string;
  type?: ITEM_TYPE;
  HSNCode?: string | null;
  GSTPercentage?: number;
  categoryId?: string;
  brandId?: string | null;
  specificationId?: string;
  roomId?: string | null;
  acceptableUnitTypes?: UnitType[];
}

export interface ItemListParams {
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
  type?: ITEM_TYPE;
  roomId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}

export interface ItemParams {
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
  type?: ITEM_TYPE;
  enabled?: boolean;
}

export interface ItemRate {
  id?: string;
  itemListingId?: string;
  minQuantity: number;
  unitType: UnitType;
  rate: number;
  isNegotiable?: boolean;
}

export interface ItemRegion {
  id?: string;
  itemListingId?: string;
  scopeType?: "PAN_INDIA" | "STATE" | "DISTRICT" | "PINCODE";
  state?: string;
  district?: string;
  pincodeId?: string;
  pincode?:
    | string
    | {
        id: string;
        pincode: string;
        state: string;
        district: string;
      };
  wholeState?: boolean;
  wholeDistrict?: boolean;
}

export interface ItemListing {
  id: string;
  itemId: string;
  entityId: string;
  isActive: boolean;
  item?: Item;
  entity?: Entity;
  itemRates?: ItemRate[];
  itemRegions?: ItemRegion[];
  createdAt: string;
  updatedAt: string;
  mediaIds?: string[];
  documentIds?: string[];
  attachments?: Attachment[];
}

export interface CreateItemListingRequest {
  item_listing: {
    itemId: string;
    entityId: string;
    item_rate?: Omit<ItemRate, "id" | "itemListingId">;
    item_region: Omit<ItemRegion, "id" | "itemListingId">[];
  };
}

export interface ItemListingListParams {
  itemId?: string;
  entityId?: string;
  search?: string;
  // added for browse
  categoryId?: string[];
  brandId?: string[];
  type?: ITEM_TYPE;
  page?: number;
  perPage?: number;
  sort?: string;
}

export interface UpdateItemListingRequest {
  isActive?: boolean;
  mediaIds?: string[];
  documentIds?: string[];
}

export interface CreateItemRateRequest {
  itemListingId: string;
  minQuantity: number;
  unitType: UnitType;
  rate: number;
  isNegotiable?: boolean;
}

export interface UpdateItemRateRequest {
  minQuantity?: number;
  unitType?: UnitType;
  rate?: number;
  isNegotiable?: boolean;
}

export interface CreateItemRegionRequest {
  itemListingId: string;
  regions: {
    scopeType?: "PAN_INDIA" | "STATE" | "DISTRICT" | "PINCODE";
    state?: string;
    district?: string;
    pincodeId?: string;
  }[];
}

export interface ItemRateListParams {
  itemListingId: string;
}

export interface ItemRegionListParams {
  itemListingId: string;
}

export interface CreateRoomRequest {
  name: string;
  staticId: string;
}

export interface UpdateRoomRequest {
  id: string;
  name?: string;
  staticId?: string;
}

export interface RoomListParams {
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}
