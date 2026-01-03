import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BuyerDetails } from "@/store/enquiryStore";

export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface AppointmentItem {
  itemId: string;
  title: string;
  type: "product" | "service";
  price?: number;
  image?: string;
  description?: string;
}

interface AppointmentState {
  item: AppointmentItem | null;
  buyerDetails: BuyerDetails | null;
  timeSlots: TimeSlot[];

  setAppointmentItem: (item: AppointmentItem | null) => void;
  setBuyerDetails: (details: BuyerDetails) => void;
  addTimeSlot: (slot: TimeSlot) => void;
  removeTimeSlot: (id: string) => void;
  resetAppointment: () => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      item: null,
      buyerDetails: null,
      timeSlots: [],

      setAppointmentItem: (item) => set({ item }),
      setBuyerDetails: (details) => set({ buyerDetails: details }),
      addTimeSlot: (slot) =>
        set((state) => ({ timeSlots: [...state.timeSlots, slot] })),
      removeTimeSlot: (id) =>
        set((state) => ({
          timeSlots: state.timeSlots.filter((s) => s.id !== id),
        })),
      resetAppointment: () =>
        set({ item: null, buyerDetails: null, timeSlots: [] }),
    }),
    {
      name: "ebc-appointment-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        // Ensure dates are handled correctly during rehydration if needed, usually stringified by JSON
      }),
    }
  )
);
