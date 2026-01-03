import { create } from "zustand";
import { Product, Facet } from "@/queries/browse.queries";

interface BrowseState {
  products: Product[];
  facets: {
    categories: Facet[];
    brands: Facet[];
  };
  total: number;
  page: number;
  totalPages: number;
  setBrowseData: (data: {
    products: Product[];
    facets: { categories: Facet[]; brands: Facet[] };
    total: number;
    page: number;
    totalPages: number;
  }) => void;
}

export const useBrowseStore = create<BrowseState>((set) => ({
  products: [],
  facets: {
    categories: [],
    brands: [],
  },
  total: 0,
  page: 1,
  totalPages: 1,
  setBrowseData: (data) => set(data),
}));
