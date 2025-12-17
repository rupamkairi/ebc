import { create } from "zustand";
import { Item } from "@/types/catalog";

interface ItemState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  selectedItem: Item | null;
  setCreateOpen: (open: boolean) => void;
  setEditOpen: (open: boolean, item?: Item) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  selectedItem: null,
  setCreateOpen: (open) => set({ isCreateOpen: open }),
  setEditOpen: (open, item) =>
    set({ isEditOpen: open, selectedItem: open ? item : null }),
}));
