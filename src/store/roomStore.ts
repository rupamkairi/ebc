import { create } from "zustand";
import { Room } from "@/types/catalog";

interface RoomState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  selectedRoom: Room | null;
  setCreateOpen: (open: boolean) => void;
  setEditOpen: (open: boolean, room?: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  selectedRoom: null,
  setCreateOpen: (open) => set({ isCreateOpen: open }),
  setEditOpen: (open, room) =>
    set({ isEditOpen: open, selectedRoom: open ? room : null }),
}));
