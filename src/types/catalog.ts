export interface Category {
  id: string;
  name: string;
  type: string;
  parentCategoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  parentCategory?: Category;
  subCategories?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
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
  parentCategoryId?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  type?: string;
  parentCategoryId?: string | null;
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
}

export interface UpdateBrandRequest {
  id: string;
  name: string;
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
