import { BrowseParams } from "@/hooks/useBrowseParams";
import {
  useBrandsQuery,
  useCategoriesQuery,
  useItemListingsQuery,
  useItemsQuery,
  useSpecificationsQuery,
} from "./catalogQueries";
import { ItemListing } from "@/types/catalog";
import { ITEM_TYPE } from "@/constants/enums";

// UI Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryName: string;
  subCategoryName?: string;
  categoryId?: string;
  subCategoryId?: string;
  brand: string;
  rating: number;
  type: string;
}

export interface Facet {
  label: string;
  value: string;
  count: number;
}

export interface BrowseData {
  products: Product[];
  categories: { id: string; name: string; image: string }[];
  subCategories: { id: string; name: string; image: string }[];
  total: number;
  facets: {
    brands: Facet[];
    specifications: Facet[];
  };
  page: number;
  totalPages: number;
}

export const useBrowseData = (params: BrowseParams) => {
  // Read selection from URL params
  const { parentCategory, subCategory, type } = params;

  // 1. Fetch Parent Categories (for horizontal carousel) - filtered by type
  const { data: parentCategories, isLoading: isLoadingCats } =
    useCategoriesQuery({
      isSubCategory: false,
      type: type as ITEM_TYPE, // Pass PRODUCT or SERVICE type to filter categories
    });

  // 2. Fetch Subcategories based on selected parent category
  const { data: subCategoriesData, isLoading: isLoadingSubCats } =
    useCategoriesQuery(
      parentCategory
        ? {
            parentCategoryId: parentCategory,
            isSubCategory: true,
            type: type as ITEM_TYPE,
          }
        : ({ enabled: false } as never), // Skip query if no parent selected
    );

  // 3. Fetch Brands for Sidebar
  const { data: brands } = useBrandsQuery({});

  // 4. Fetch Specifications for Sidebar
  const { data: specifications } = useSpecificationsQuery({});

  // 5. Fetch Items - filter by selected category or subcategories
  const categoryFilter =
    subCategory.length > 0
      ? subCategory[0] // API only supports single category, multi-select is client-side
      : parentCategory || undefined;

  const { data: itemsFromCatalog, isLoading: isLoadingItems } = useItemsQuery({
    search: params.q || undefined,
    categoryId: categoryFilter,
    brandId: params.brand.length === 1 ? params.brand[0] : undefined,
    type: type as ITEM_TYPE, // Pass type to filter products vs services
  });

  // 6. Fetch Listings for price/media info
  const { data: listings, isLoading: isLoadingListings } = useItemListingsQuery(
    {
      search: params.q || undefined,
    },
  );

  const isLoading =
    isLoadingCats || isLoadingSubCats || isLoadingItems || isLoadingListings;

  // Create listing lookup map
  const listingMap = new Map<string, ItemListing>();
  (listings || []).forEach((listing) => {
    if (!listingMap.has(listing.itemId)) {
      listingMap.set(listing.itemId, listing);
    }
  });

  // Filter items client-side
  const allItems = itemsFromCatalog || [];
  const filteredItems = allItems.filter((item) => {
    // Filter by Type
    if (type && item.type !== type) return false;

    // Filter by Subcategories (if any selected)
    if (subCategory.length > 0) {
      if (!item.categoryId || !subCategory.includes(item.categoryId)) {
        return false;
      }
    }

    // Filter by Brands (multi-select)
    if (params.brand.length > 0) {
      if (!item.brandId || !params.brand.includes(item.brandId)) return false;
    }

    // Filter by Specifications
    if (params.specification.length > 0) {
      if (
        !item.specificationId ||
        !params.specification.includes(item.specificationId)
      ) {
        return false;
      }
    }

    return true;
  });

  // Pagination
  const total = filteredItems.length;
  const pageSize = 12;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.max(1, params.page || 1);
  const start = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(start, start + pageSize);

  // Lookup maps for names
  const brandMap = new Map((brands || []).map((b) => [b.id, b]));

  // Map to Product interface
  const products: Product[] = paginatedItems.map((item) => {
    const listing = listingMap.get(item.id);

    // In our schema, item.categoryId usually points to the specific sub-category it belongs to
    const subCategoryId = item.category?.parentCategoryId
      ? item.categoryId
      : undefined;
    const categoryId = item.category?.parentCategoryId || item.categoryId;

    return {
      id: item.id,
      title: item.name,
      description: item.description,
      price: listing?.itemRates?.[0]?.rate || 0,
      image: listing?.mediaIds?.[0] || "https://placehold.co/300x300",
      category: item.category?.name || "Uncategorized",
      categoryName:
        item.category?.parentCategory?.name ||
        (item.category?.parentCategoryId
          ? "Unknown Parent"
          : item.category?.name || "Uncategorized"),
      subCategoryName: item.category?.parentCategoryId
        ? item.category?.name
        : undefined,
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      brand: brandMap.get(item.brandId)?.name || "Generic",
      rating: 4.5,
      type: item.type || "PRODUCT",
    };
  });

  // Build Facets with counts
  const brandFacetMap = new Map<string, number>();
  const specFacetMap = new Map<string, number>();

  filteredItems.forEach((item) => {
    if (item.brandId) {
      brandFacetMap.set(
        item.brandId,
        (brandFacetMap.get(item.brandId) || 0) + 1,
      );
    }
    if (item.specificationId) {
      specFacetMap.set(
        item.specificationId,
        (specFacetMap.get(item.specificationId) || 0) + 1,
      );
    }
  });

  const brandFacets: Facet[] = (brands || [])
    .map((b) => ({
      label: b.name,
      value: b.id,
      count: brandFacetMap.get(b.id) || 0,
    }))
    .filter((f) => f.count > 0 || params.brand.includes(f.value));

  const specFacets: Facet[] = (specifications || [])
    .map((s) => ({
      label: s.name,
      value: s.id,
      count: specFacetMap.get(s.id) || 0,
    }))
    .filter((f) => f.count > 0 || params.specification.includes(f.value));

  // Map categories and subcategories for UI
  const categories = (parentCategories || []).map((c) => ({
    id: c.id,
    name: c.name,
    image: c.categoryIcon?.url || "https://placehold.co/120x70",
  }));

  const subCategories = (subCategoriesData || []).map((sc) => ({
    id: sc.id,
    name: sc.name,
    image: sc.categoryIcon?.url || "https://placehold.co/150x100",
  }));

  const data: BrowseData = {
    products,
    categories,
    subCategories,
    total,
    facets: {
      brands: brandFacets,
      specifications: specFacets,
    },
    page: currentPage,
    totalPages,
  };

  return { data, isLoading };
};
