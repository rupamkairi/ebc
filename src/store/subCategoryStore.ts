import { create } from "zustand";
import { Category } from "@/types/catalog";

interface SubCategoryState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  selectedCategory: Category | null;
  setCreateOpen: (open: boolean) => void;
  setEditOpen: (open: boolean, subCategory?: Category) => void;
}

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  selectedCategory: null,
  setCreateOpen: (open) => set({ isCreateOpen: open }),
  setEditOpen: (open, subCategory) =>
    set({ isEditOpen: open, selectedCategory: open ? subCategory : null }),
}));
