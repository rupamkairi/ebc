import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export enum UNIT_TYPE {
  Meter = "Meter",
  Kilogram = "Kilogram",
  Litre = "Litre",
  SquareMeter = "SquareMeter",
  Piece = "Piece",
  Box = "Box",
  Bag = "Bag",
}

export interface EnquiryItem {
  itemId: string;
  title: string;
  quantity: number;
  remarks?: string;
  type: "product" | "service";
  unit?: UNIT_TYPE;
  price?: number;
}

export interface BuyerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  description?: string;
  purpose?: string;
  attachments?: string[]; // URLs or IDs
}

interface EnquiryState {
  items: EnquiryItem[];
  buyerDetails: BuyerDetails | null;
  addItem: (item: EnquiryItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<EnquiryItem>) => void;
  setBuyerDetails: (details: BuyerDetails) => void;
  clearEnquiry: () => void;
  resetEnquiry: () => void;
}

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set) => ({
      items: [],
      buyerDetails: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.itemId === item.itemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.itemId === item.itemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemId !== itemId),
        })),
      updateItem: (itemId, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.itemId === itemId ? { ...i, ...updates } : i
          ),
        })),
      setBuyerDetails: (details) =>
        set((state) => {
          if (JSON.stringify(state.buyerDetails) === JSON.stringify(details))
            return state;
          return { buyerDetails: details };
        }),
      clearEnquiry: () => set({ items: [] }), // Just clears items
      resetEnquiry: () => set({ items: [], buyerDetails: null }), // Clears everything
    }),
    {
      name: "ebc-enquiry-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
