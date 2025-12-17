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
};
