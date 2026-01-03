"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SortOption = "relevance" | "price_asc" | "price_desc" | "newest";

export type BrowseType = "product" | "service";

export interface BrowseParams {
  q: string;
  type: BrowseType;
  category: string[];
  brand: string[];
  sort: SortOption;
  page: number;
}

export const useBrowseParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current params
  const params: BrowseParams = useMemo(() => {
    return {
      q: searchParams.get("q") || "",
      type: (searchParams.get("type") as BrowseType) || "product",
      category: searchParams.getAll("category"),
      brand: searchParams.getAll("brand"),
      sort: (searchParams.get("sort") as SortOption) || "relevance",
      page: Number(searchParams.get("page")) || 1,
    };
  }, [searchParams]);

  // Helper to create a new URLSearchParams object
  const createQueryString = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateParams = useCallback(
    (newParams: Partial<BrowseParams>) => {
      const current = new URLSearchParams(searchParams.toString());

      if (newParams.q !== undefined) {
        if (newParams.q) current.set("q", newParams.q);
        else current.delete("q");
      }

      if (newParams.type !== undefined) {
        current.set("type", newParams.type);
      }

      if (newParams.sort !== undefined) {
        current.set("sort", newParams.sort);
      }

      if (newParams.page !== undefined) {
        current.set("page", newParams.page.toString());
      }

      // Handle array params (reset and append)
      if (newParams.category !== undefined) {
        current.delete("category");
        newParams.category.forEach((c) => current.append("category", c));
      }

      if (newParams.brand !== undefined) {
        current.delete("brand");
        newParams.brand.forEach((b) => current.append("brand", b));
      }

      // Always reset to page 1 if not explicitly setting page
      if (newParams.page === undefined && !current.get("page")) {
        // Logic: if filters changed, reset page to 1
        if (
          newParams.q !== undefined ||
          newParams.category !== undefined ||
          newParams.brand !== undefined ||
          newParams.type !== undefined
        ) {
          current.set("page", "1");
        }
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [pathname, router, searchParams]
  );

  return {
    params,
    updateParams,
    createQueryString,
  };
};
