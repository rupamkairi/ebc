import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface EnquiryItem {
  itemId: string;
  name: string;
  quantity: number;
  unit: string;
  remarks?: string;
  brandName?: string;
  categoryName?: string;
}

export interface BuyerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pincode: string;
  state?: string;
  district?: string;
  expectedDate?: Date;
  remarks?: string;
  attachments?: string[]; // URLs or IDs
}

interface EnquiryState {
  step: number;
  buyerDetails: BuyerDetails;
  items: EnquiryItem[];

  setStep: (step: number) => void;
  updateBuyerDetails: (details: Partial<BuyerDetails>) => void;
  addItem: (item: EnquiryItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<EnquiryItem>) => void;
  resetEnquiry: () => void;
}

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set) => ({
      step: 1,
      buyerDetails: {
        name: "",
        phone: "",
        pincode: "",
      },
      items: [],

      setStep: (step) => set({ step }),
      updateBuyerDetails: (details) =>
        set((state) => ({
          buyerDetails: { ...state.buyerDetails, ...details },
        })),
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.itemId === item.itemId
          );
          if (existingItemIndex > -1) {
            // If item exists, maybe update it? or just add another line?
            // Requirement says "user can add multiple item (line_item)", implying distinct entries, possibly same item multiple times?
            // Usually same item means update quantity. Let's assume unique items for now or append.
            // But for simplicity in "search & add" flow, let's append if not same, or update if user intends.
            // For now, let's just append.
            return { items: [...state.items, item] };
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
      resetEnquiry: () =>
        set({
          step: 1,
          buyerDetails: { name: "", phone: "", pincode: "" },
          items: [],
        }),
    }),
    {
      name: "enquiry-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        buyerDetails: state.buyerDetails,
        items: state.items,
        step: state.step,
      }),
    }
  )
);
