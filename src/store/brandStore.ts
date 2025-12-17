import { create } from "zustand";
import { Brand } from "@/types/catalog";

interface BrandState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  selectedBrand: Brand | null;
  setCreateOpen: (open: boolean) => void;
  setEditOpen: (open: boolean, brand?: Brand) => void;
}

export const useBrandStore = create<BrandState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  selectedBrand: null,
  setCreateOpen: (open) => set({ isCreateOpen: open }),
  setEditOpen: (open, brand) =>
    set({ isEditOpen: open, selectedBrand: open ? brand : null }),
}));
