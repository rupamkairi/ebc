import { create } from "zustand";
import { BrowseItem, Facet } from "@/queries/browse.queries";

interface BrowseState {
  // Data from API
  items: BrowseItem[];
  categories: { id: string; name: string; image?: string }[];
  subCategories: { id: string; name: string; image?: string }[];
  facets: {
    brands: Facet[];
    specifications: Facet[];
  };
  total: number;
  page: number;
  totalPages: number;

  // Actions
  setBrowseData: (data: {
    items: BrowseItem[];
    categories?: { id: string; name: string; image?: string }[];
    subCategories?: { id: string; name: string; image?: string }[];
    facets: { brands: Facet[]; specifications: Facet[] };
    total: number;
    page: number;
    totalPages: number;
  }) => void;
}

export const useBrowseStore = create<BrowseState>((set) => ({
  items: [],
  categories: [],
  subCategories: [],
  facets: {
    brands: [],
    specifications: [],
  },
  total: 0,
  page: 1,
  totalPages: 1,

  setBrowseData: (data) => set((state) => ({ ...state, ...data })),
}));
