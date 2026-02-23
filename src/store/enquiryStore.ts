import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/queries/browse.queries";

export interface BuyerDetails {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  pincodeDirectoryId: string;
  description: string;
  purpose: string;
}

interface EnquiryStore {
  items: Product[];
  buyerDetails: BuyerDetails | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setBuyerDetails: (details: BuyerDetails) => void;
  clearEnquiry: () => void;
}

export const useEnquiryStore = create<EnquiryStore>()(
  persist(
    (set) => ({
      items: [],
      buyerDetails: null,
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
      setBuyerDetails: (details) => set({ buyerDetails: details }),
      clearEnquiry: () => set({ items: [], buyerDetails: null }),
    }),
    {
      name: "enquiry-storage",
    }
  )
);
