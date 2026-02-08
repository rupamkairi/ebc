"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SortOption = "relevance" | "price_asc" | "price_desc" | "newest";

export type BrowseType = "PRODUCT" | "SERVICE";

export interface BrowseParams {
  q: string;
  type: BrowseType;
  parentCategory: string | null; // Single parent category
  subCategory: string[]; // Multiple subcategories allowed
  brand: string[];
  specification: string[];
  sort: SortOption;
  page: number;
}

export const useBrowseParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current params from URL
  const params: BrowseParams = useMemo(() => {
    return {
      q: searchParams.get("q") || "",
      type:
        (searchParams.get("type")?.toUpperCase() as BrowseType) || "PRODUCT",
      parentCategory: searchParams.get("parentCategory") || null,
      subCategory: [
        ...searchParams.getAll("subCategory"),
        // Legacy support
        ...searchParams.getAll("category"),
        ...searchParams.getAll("categoryId"),
      ],
      brand: [
        ...searchParams.getAll("brand"),
        ...searchParams.getAll("brandId"),
      ],
      specification: searchParams.getAll("specification"),
      sort: (searchParams.get("sort") as SortOption) || "relevance",
      page: Number(searchParams.get("page")) || 1,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (newParams: Partial<BrowseParams>) => {
      const current = new URLSearchParams(searchParams.toString());

      // Search query
      if (newParams.q !== undefined) {
        if (newParams.q) current.set("q", newParams.q);
        else current.delete("q");
      }

      // Type (PRODUCT/SERVICE)
      if (newParams.type !== undefined) {
        current.set("type", newParams.type);
        // Reset category/subcategory when type changes
        current.delete("parentCategory");
        current.delete("subCategory");
        current.delete("category"); // legacy
      }

      // Parent Category (single value)
      if (newParams.parentCategory !== undefined) {
        if (newParams.parentCategory) {
          current.set("parentCategory", newParams.parentCategory);
        } else {
          current.delete("parentCategory");
        }
        // Clear subcategories when parent changes
        current.delete("subCategory");
        current.delete("category"); // legacy
      }

      // Sort
      if (newParams.sort !== undefined) {
        current.set("sort", newParams.sort);
      }

      // Page
      if (newParams.page !== undefined) {
        current.set("page", newParams.page.toString());
      }

      // Handle array params (reset and append)
      if (newParams.subCategory !== undefined) {
        current.delete("subCategory");
        current.delete("category"); // legacy
        newParams.subCategory.forEach((c) => current.append("subCategory", c));
      }

      if (newParams.brand !== undefined) {
        current.delete("brand");
        current.delete("brandId"); // legacy
        newParams.brand.forEach((b) => current.append("brand", b));
      }

      if (newParams.specification !== undefined) {
        current.delete("specification");
        newParams.specification.forEach((s) =>
          current.append("specification", s),
        );
      }

      // Reset to page 1 if filters changed
      const filtersChanged =
        newParams.q !== undefined ||
        newParams.parentCategory !== undefined ||
        newParams.subCategory !== undefined ||
        newParams.brand !== undefined ||
        newParams.specification !== undefined ||
        newParams.type !== undefined;

      if (filtersChanged && newParams.page === undefined) {
        current.set("page", "1");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [pathname, router, searchParams],
  );

  // Helper to toggle a subcategory (add/remove from array)
  const toggleSubCategory = useCallback(
    (subCategoryId: string) => {
      const current = params.subCategory;
      const isSelected = current.includes(subCategoryId);
      const next = isSelected
        ? current.filter((id) => id !== subCategoryId)
        : [...current, subCategoryId];
      updateParams({ subCategory: next });
    },
    [params.subCategory, updateParams],
  );

  // Helper to set parent category
  const setParentCategory = useCallback(
    (categoryId: string | null) => {
      updateParams({ parentCategory: categoryId });
    },
    [updateParams],
  );

  return {
    params,
    updateParams,
    toggleSubCategory,
    setParentCategory,
  };
};
