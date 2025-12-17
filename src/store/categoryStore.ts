import { create } from "zustand";
import { Category } from "@/types/catalog";

interface CategoryState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  selectedCategory: Category | null;
  setCreateOpen: (open: boolean) => void;
  setEditOpen: (open: boolean, category?: Category) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  selectedCategory: null,
  setCreateOpen: (open) => set({ isCreateOpen: open }),
  setEditOpen: (open, category) =>
    set({ isEditOpen: open, selectedCategory: open ? category : null }),
}));
