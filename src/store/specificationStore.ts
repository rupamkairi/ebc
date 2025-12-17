import { create } from "zustand";
import { Specification } from "@/types/catalog";

interface SpecificationState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  selectedSpecification: Specification | null;
  setCreateOpen: (open: boolean) => void;
  setEditOpen: (open: boolean, specification?: Specification) => void;
}

export const useSpecificationStore = create<SpecificationState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  selectedSpecification: null,
  setCreateOpen: (open) => set({ isCreateOpen: open }),
  setEditOpen: (open, specification) =>
    set({
      isEditOpen: open,
      selectedSpecification: open ? specification : null,
    }),
}));
