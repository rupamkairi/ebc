import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  Brand,
  BrandListParams,
  Category,
  CategoryListParams,
  CreateBrandRequest,
  CreateCategoryRequest,
  CreateItemRequest,
  CreateSpecificationRequest,
  Item,
  ItemListParams,
  Specification,
  SpecificationListParams,
  UpdateBrandRequest,
  UpdateCategoryRequest,
  UpdateItemRequest,
  UpdateSpecificationRequest,
  // New Imports
  CreateItemListingRequest,
  ItemListing,
  ItemListingListParams,
  CreateItemRateRequest,
  ItemRate,
  ItemRateListParams,
  CreateItemRegionRequest,
  ItemRegion,
  ItemRegionListParams,
} from "@/types/catalog";

export const catalogService = {
  // Category
  async createCategory(data: CreateCategoryRequest) {
    return fetchClient<Category>(API_ENDPOINTS.CATALOG.CATEGORY.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async updateCategory(data: UpdateCategoryRequest) {
    return fetchClient<Category>(API_ENDPOINTS.CATALOG.CATEGORY.UPDATE, {
      method: "PATCH",
      body: data,
    });
  },

  async deleteCategory(id: string) {
    return fetchClient(API_ENDPOINTS.CATALOG.CATEGORY.DELETE, {
      method: "DELETE",
      body: { id },
    });
  },

  async getCategories(params: CategoryListParams = {}) {
    return fetchClient<Category[]>(API_ENDPOINTS.CATALOG.CATEGORY.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },

  // Brand
  async createBrand(data: CreateBrandRequest) {
    return fetchClient<Brand>(API_ENDPOINTS.CATALOG.BRAND.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async updateBrand(data: UpdateBrandRequest) {
    return fetchClient<Brand>(API_ENDPOINTS.CATALOG.BRAND.UPDATE, {
      method: "PATCH",
      body: data,
    });
  },

  async deleteBrand(id: string) {
    return fetchClient(API_ENDPOINTS.CATALOG.BRAND.DELETE, {
      method: "DELETE",
      body: { id },
    });
  },

  async getBrands(params: BrandListParams = {}) {
    return fetchClient<Brand[]>(API_ENDPOINTS.CATALOG.BRAND.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },

  // Specification
  async createSpecification(data: CreateSpecificationRequest) {
    return fetchClient<Specification>(
      API_ENDPOINTS.CATALOG.SPECIFICATION.CREATE,
      {
        method: "POST",
        body: data,
      }
    );
  },

  async updateSpecification(data: UpdateSpecificationRequest) {
    return fetchClient<Specification>(
      API_ENDPOINTS.CATALOG.SPECIFICATION.UPDATE,
      {
        method: "PATCH",
        body: data,
      }
    );
  },

  async deleteSpecification(id: string) {
    return fetchClient(API_ENDPOINTS.CATALOG.SPECIFICATION.DELETE, {
      method: "DELETE",
      body: { id },
    });
  },

  async getSpecifications(params: SpecificationListParams = {}) {
    return fetchClient<Specification[]>(
      API_ENDPOINTS.CATALOG.SPECIFICATION.LIST,
      {
        method: "POST",
        body: params as Record<string, string | number | boolean>,
      }
    );
  },

  // Item
  async createItem(data: CreateItemRequest) {
    return fetchClient<Item>(API_ENDPOINTS.CATALOG.ITEM.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async updateItem(data: UpdateItemRequest) {
    return fetchClient<Item>(API_ENDPOINTS.CATALOG.ITEM.UPDATE, {
      method: "PATCH",
      body: data,
    });
  },

  async deleteItem(id: string) {
    return fetchClient(API_ENDPOINTS.CATALOG.ITEM.DELETE, {
      method: "DELETE",
      body: { id },
    });
  },

  async getItems(params: ItemListParams = {}) {
    return fetchClient<Item[]>(API_ENDPOINTS.CATALOG.ITEM.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },

  // Item Listing
  async createItemListing(data: CreateItemListingRequest) {
    return fetchClient<ItemListing>(API_ENDPOINTS.CATALOG.ITEM_LISTING.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async updateItemListing(id: string, data: { isActive: boolean }) {
    return fetchClient<ItemListing>(
      `${API_ENDPOINTS.CATALOG.ITEM_LISTING.UPDATE}/${id}`,
      {
        method: "PATCH",
        body: data,
      }
    );
  },

  async deleteItemListing(id: string) {
    return fetchClient(`${API_ENDPOINTS.CATALOG.ITEM_LISTING.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  async getItemListings(params: ItemListingListParams = {}) {
    return fetchClient<ItemListing[]>(API_ENDPOINTS.CATALOG.ITEM_LISTING.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },

  // Item Rate
  async createItemRate(data: CreateItemRateRequest) {
    return fetchClient<ItemRate>(API_ENDPOINTS.CATALOG.ITEM_RATE.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async updateItemRate(id: string, data: Partial<CreateItemRateRequest>) {
    return fetchClient<ItemRate>(
      `${API_ENDPOINTS.CATALOG.ITEM_RATE.UPDATE}/${id}`,
      {
        method: "PATCH",
        body: data as Record<string, string | number | boolean>,
      }
    );
  },

  async deleteItemRate(id: string) {
    return fetchClient(`${API_ENDPOINTS.CATALOG.ITEM_RATE.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  async getItemRates(params: ItemRateListParams) {
    return fetchClient<ItemRate[]>(API_ENDPOINTS.CATALOG.ITEM_RATE.LIST, {
      method: "POST",
      body: params as unknown as Record<string, string | number | boolean>,
    });
  },

  // Item Region
  async createItemRegion(data: CreateItemRegionRequest) {
    return fetchClient(API_ENDPOINTS.CATALOG.ITEM_REGION.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async updateItemRegion(id: string, data: Partial<CreateItemRegionRequest>) {
    return fetchClient(`${API_ENDPOINTS.CATALOG.ITEM_REGION.UPDATE}/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  async deleteItemRegion(id: string) {
    return fetchClient(`${API_ENDPOINTS.CATALOG.ITEM_REGION.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  async getItemRegions(params: ItemRegionListParams) {
    return fetchClient<ItemRegion[]>(API_ENDPOINTS.CATALOG.ITEM_REGION.LIST, {
      method: "POST",
      body: params as unknown as Record<string, string | number | boolean>,
    });
  },
};
