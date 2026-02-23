import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UnitType } from "@/constants/quantities";

export interface EnquiryItem {
  itemId: string;
  title: string;
  type: string;
  quantity: number;
  unitType: UnitType;
  remarks?: string;
  price?: number;
}

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
  items: EnquiryItem[];
  buyerDetails: BuyerDetails | null;
  addItem: (item: EnquiryItem) => void;
  removeItem: (itemId: string) => void;
  setBuyerDetails: (details: BuyerDetails) => void;
  clearEnquiry: () => void;
}

export const useEnquiryStore = create<EnquiryStore>()(
  persist(
    (set) => ({
      items: [],
      buyerDetails: null,
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.itemId === item.itemId);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemId !== itemId),
        })),
      setBuyerDetails: (details) => set({ buyerDetails: details }),
      clearEnquiry: () => set({ items: [], buyerDetails: null }),
    }),
    {
      name: "enquiry-storage",
    }
  )
);
