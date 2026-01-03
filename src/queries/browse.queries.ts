import { BrowseParams } from "@/hooks/useBrowseParams";
import { useQuery } from "@tanstack/react-query";

// Mock Data Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  type: "product" | "service";
}

export interface Facet {
  label: string;
  value: string;
  count: number;
}

export interface BrowseData {
  products: Product[];
  total: number;
  facets: {
    categories: Facet[];
    brands: Facet[];
  };
  page: number;
  totalPages: number;
}

// Mock Data Generator
const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }).map((_, i) => {
  const isService = i % 5 === 0; // 20% services
  return {
    id: `prod-${i}`,
    title: isService ? `Service Solution ${i + 1}` : `Premium Product ${i + 1}`,
    description: isService
      ? "Professional service with guaranteed results."
      : "High quality item with amazing features.",
    price: Math.floor(Math.random() * 500) + 50,
    image: "https://placehold.co/300x300",
    category: i % 3 === 0 ? "electronics" : i % 3 === 1 ? "clothing" : "home",
    brand:
      i % 4 === 0
        ? "brand-a"
        : i % 4 === 1
        ? "brand-b"
        : i % 4 === 2
        ? "brand-c"
        : "brand-d",
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    type: isService ? "service" : "product",
  };
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useBrowseData = (params: BrowseParams) => {
  return useQuery({
    queryKey: ["browse", params],
    queryFn: async (): Promise<BrowseData> => {
      // Simulate network delay
      await delay(800);

      let filtered = [...MOCK_PRODUCTS];

      // 0. Filter by Type
      if (params.type) {
        filtered = filtered.filter((p) => p.type === params.type);
      }

      // 1. Search
      if (params.q) {
        const qLower = params.q.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(qLower) ||
            p.description.toLowerCase().includes(qLower)
        );
      }

      // 2. Filter by Category
      if (params.category && params.category.length > 0) {
        filtered = filtered.filter((p) => params.category.includes(p.category));
      }

      // 3. Filter by Brand
      if (params.brand && params.brand.length > 0) {
        filtered = filtered.filter((p) => params.brand.includes(p.brand));
      }

      // 4. Sort
      filtered.sort((a, b) => {
        switch (params.sort) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "newest":
            return b.id.localeCompare(a.id); // primitive "newest"
          default:
            return 0; // relevance (preserved original order)
        }
      });

      // 5. Pagination
      const pageSize = 12;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (params.page - 1) * pageSize;
      const paginatedProducts = filtered.slice(start, start + pageSize);

      // 6. Facets (Mocked counts based on full dataset vs filtered - simplified to full dataset for now to show options)
      // Real apps effectively aggregate based on current search context
      const allCategories = ["electronics", "clothing", "home"];
      const allBrands = ["brand-a", "brand-b", "brand-c", "brand-d"];

      return {
        products: paginatedProducts,
        total,
        page: params.page,
        totalPages,
        facets: {
          categories: allCategories.map((c) => ({
            label: c.charAt(0).toUpperCase() + c.slice(1),
            value: c,
            count: MOCK_PRODUCTS.filter((p) => p.category === c).length,
          })),
          brands: allBrands.map((b) => ({
            label: b.charAt(0).toUpperCase() + b.slice(1).replace("-", " "),
            value: b,
            count: MOCK_PRODUCTS.filter((p) => p.brand === b).length,
          })),
        },
      };
    },
  });
};
