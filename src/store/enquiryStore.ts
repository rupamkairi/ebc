import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/queries/browse.queries";

interface EnquiryStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearEnquiry: () => void;
}

export const useEnquiryStore = create<EnquiryStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id);
          if (exists) return state;
          return { items: [...state.items, product] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clearEnquiry: () => set({ items: [] }),
    }),
    {
      name: "enquiry-storage",
    }
  )
);
