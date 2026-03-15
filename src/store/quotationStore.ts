import { create } from "zustand";

export interface QuotationState {
  enquiryId: string;
  lineItems: {
    id?: string;
    itemId: string;
    itemListingId: string; // Internal helper to keep track of selection
    rate: number;
    amount: number;
    isNegotiable: boolean;
    remarks?: string;
    quantity: number; // Helper for calculation
  }[];
  details: {
    expectedDate?: string;
    remarks?: string;
    attachmentIds: string[];
  };
  setEnquiryId: (id: string) => void;
  setLineItems: (items: QuotationState["lineItems"]) => void;
  updateLineItem: (
    index: number,
    item: Partial<QuotationState["lineItems"][0]>
  ) => void;
  setDetails: (details: Partial<QuotationState["details"]>) => void;
  reset: () => void;
}

export const useQuotationStore = create<QuotationState>((set) => ({
  enquiryId: "",
  lineItems: [],
  details: {
    attachmentIds: [],
  },
  setEnquiryId: (id) => set({ enquiryId: id }),
  setLineItems: (items) => set({ lineItems: items }),
  updateLineItem: (index, item) =>
    set((state) => {
      const newLineItems = [...state.lineItems];
      const currentItem = newLineItems[index];
      if (!currentItem) return state;

      const updatedItem = { ...currentItem, ...item };

      // Calculate amount if rate or quantity changed
      if (item.rate !== undefined || item.quantity !== undefined) {
        updatedItem.amount =
          (updatedItem.rate || 0) * (updatedItem.quantity || 0);
      }

      newLineItems[index] = updatedItem;
      return { lineItems: newLineItems };
    }),
  setDetails: (details) =>
    set((state) => ({ details: { ...state.details, ...details } })),
  reset: () =>
    set({
      enquiryId: "",
      lineItems: [],
      details: { attachmentIds: [] },
    }),
}));
