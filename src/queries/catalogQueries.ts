import { catalogService } from "@/services/catalogService";
import {
  BrandListParams,
  CategoryListParams,
  CreateBrandRequest,
  CreateCategoryRequest,
  // New Imports
  CreateItemListingRequest,
  CreateItemRateRequest,
  CreateItemRegionRequest,
  CreateItemRequest,
  CreateSpecificationRequest,
  ItemListingListParams,
  ItemListParams,
  ItemRateListParams,
  ItemRegionListParams,
  SpecificationListParams,
  UpdateBrandRequest,
  UpdateCategoryRequest,
  // Add Update Requests
  UpdateItemListingRequest,
  UpdateItemRateRequest,
  UpdateItemRequest,
  UpdateSpecificationRequest,
} from "@/types/catalog";
import { CreateOfferRequest, OfferListParams } from "@/types/conference-hall";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const catalogKeys = {
  all: ["catalog"] as const,
  categories: (params: CategoryListParams) =>
    [...catalogKeys.all, "categories", params] as const,
  brands: (params: BrandListParams) =>
    [...catalogKeys.all, "brands", params] as const,
  specifications: (params: SpecificationListParams) =>
    [...catalogKeys.all, "specifications", params] as const,
  items: (params: ItemListParams) =>
    [...catalogKeys.all, "items", params] as const,
  itemListings: (params: ItemListingListParams) =>
    [...catalogKeys.all, "listings", params] as const,
  itemRates: (params: ItemRateListParams) =>
    [...catalogKeys.all, "rates", params] as const,
  itemRegions: (params: ItemRegionListParams) =>
    [...catalogKeys.all, "regions", params] as const,
};

// Categories
export function useCategoriesQuery(params: CategoryListParams = {}) {
  return useQuery({
    queryKey: catalogKeys.categories(params),
    queryFn: () => catalogService.getCategories(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      catalogService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all }); // Invalidate all for now, or just categories
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) =>
      catalogService.updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Brands
export function useBrandsQuery(params: BrandListParams = {}) {
  return useQuery({
    queryKey: catalogKeys.brands(params),
    queryFn: () => catalogService.getBrands(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandRequest) => catalogService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBrandRequest) => catalogService.updateBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useDeleteBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Specifications
export function useSpecificationsQuery(params: SpecificationListParams = {}) {
  return useQuery({
    queryKey: catalogKeys.specifications(params),
    queryFn: () => catalogService.getSpecifications(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateSpecificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSpecificationRequest) =>
      catalogService.createSpecification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateSpecificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSpecificationRequest) =>
      catalogService.updateSpecification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useDeleteSpecificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogService.deleteSpecification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Items
export function useItemsQuery(params: ItemListParams = {}) {
  return useQuery({
    queryKey: catalogKeys.items(params),
    queryFn: () => catalogService.getItems(params),
    placeholderData: keepPreviousData,
  });
}

export function useItemQuery(id: string) {
  return useQuery({
    queryKey: [...catalogKeys.all, "item", id],
    queryFn: () => catalogService.getItem(id),
    enabled: !!id,
  });
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemRequest) => catalogService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateItemRequest) => catalogService.updateItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useDeleteItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Item Listings
export function useItemListingsQuery(params: ItemListingListParams = {}) {
  return useQuery({
    queryKey: catalogKeys.itemListings(params),
    queryFn: () => catalogService.getItemListings(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateItemListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemListingRequest) =>
      catalogService.createItemListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateItemListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateItemListingRequest;
    }) => catalogService.updateItemListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Item Rates
export function useItemRatesQuery(params: ItemRateListParams) {
  return useQuery({
    queryKey: catalogKeys.itemRates(params),
    queryFn: () => catalogService.getItemRates(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateItemRateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemRateRequest) =>
      catalogService.createItemRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateItemRateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRateRequest }) =>
      catalogService.updateItemRate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Item Regions
export function useItemRegionsQuery(params: ItemRegionListParams) {
  return useQuery({
    queryKey: catalogKeys.itemRegions(params),
    queryFn: () => catalogService.getItemRegions(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateItemRegionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemRegionRequest) =>
      catalogService.createItemRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}
export function useUpdateItemRegionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateItemRegionRequest>;
    }) => catalogService.updateItemRegion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// Offers
export function useOffersQuery(params: OfferListParams = {}) {
  return useQuery({
    queryKey: [...catalogKeys.all, "offers", params],
    queryFn: () => catalogService.getOffers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOfferRequest) => catalogService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useDeleteOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogService.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}
