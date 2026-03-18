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
  acceptableUnitTypes?: UnitType[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ITEM_TYPE;
  HSNCode: string;
  GSTPercentage: number;
  categoryId: string;
  brandId: string;
  specificationId: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  brand?: Brand;
  specification?: Specification;
  /** Convenience field: populated from the backend's acceptableUnitTypes column */
  acceptableUnitTypes?: UnitType[] | null;
}

export interface CreateCategoryRequest {
  name: string;
  type: ITEM_TYPE;
  isSubCategory: boolean;
  parentCategoryId?: string;
  categoryIconId?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  type?: ITEM_TYPE;
  isSubCategory?: boolean;
  parentCategoryId?: string | null;
  categoryIconId?: string | null;
}

export interface CategoryListParams {
  type?: ITEM_TYPE;
  isSubCategory?: boolean;
  parentCategoryId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
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
}

export interface CreateItemRequest {
  name: string;
  description: string;
  type: ITEM_TYPE;
  HSNCode: string;
  GSTPercentage: number;
  categoryId: string;
  brandId: string;
  specificationId: string;
}

export interface UpdateItemRequest {
  id: string;
  name?: string;
  description?: string;
  type?: ITEM_TYPE;
  HSNCode?: string;
  GSTPercentage?: number;
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
}

export interface ItemListParams {
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
  type?: ITEM_TYPE;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface ItemParams {
  categoryId?: string;
  brandId?: string;
  specificationId?: string;
  type?: ITEM_TYPE;
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
  attachments?: any[];
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
    state?: string;
    district?: string;
    pincodeId?: string;
    wholeState?: boolean;
    wholeDistrict?: boolean;
  }[];
}

export interface ItemRateListParams {
  itemListingId: string;
}

export interface ItemRegionListParams {
  itemListingId: string;
}
