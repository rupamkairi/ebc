import { UnitType } from "@/constants/quantities";
import { Entity } from "./entity";
import { z } from "zod"; // Added import for zod

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
  type: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
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
}

export interface CreateCategoryRequest {
  name: string;
  type: string;
  isSubCategory: boolean;
  parentCategoryId?: string;
  categoryIconId?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  type?: string;
  isSubCategory?: boolean;
  parentCategoryId?: string | null;
  categoryIconId?: string | null;
}

export interface CategoryListParams {
  type?: string;
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
  type: string;
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
  type?: string;
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
  type?: string;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
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
  item_rate?: ItemRate;
  item_region?: ItemRegion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemListingRequest {
  item_listing: {
    itemId: string;
    entityId: string;
    item_rate: Omit<ItemRate, "id" | "itemListingId">;
    item_region: Omit<ItemRegion, "id" | "itemListingId">[];
  };
}

export interface ItemListingListParams {
  itemId?: string;
  entityId?: string;
  search?: string;
}

export interface UpdateItemListingRequest {
  isActive?: boolean;
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

export interface Offer {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  isActive: boolean;
  isPublic: boolean;
  name: string;
  description?: string;
  createdById: string;
  deletedById?: string;
  entityId: string;
  itemListingId: string;
  attachments?: Media[];
  documents?: Media[]; // Added documents
}

export const offerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  publishedAt: z.date().optional(),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  mediaIds: z.array(z.string()),
  documentIds: z.array(z.string()),
});

// Explicitly defining the type to avoid any mismatch with zodResolver
export interface OfferFormValues {
  name: string;
  description?: string;
  publishedAt?: Date;
  isActive: boolean;
  isPublic: boolean;
  mediaIds: string[];
  documentIds: string[];
}

export interface CreateOfferRequest {
  publishedAt: string;
  isActive: boolean;
  isPublic: boolean;
  name: string;
  description?: string;
  entityId: string;
  itemListingId: string;
  attachments?: string[];
}

export interface UpdateOfferRequest {
  id: string;
  publishedAt?: string;
  isActive?: boolean;
  isPublic?: boolean;
  name?: string;
  description?: string;
  attachments?: string[];
}

export interface OfferListParams {
  entityId?: string;
  itemListingId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
}
