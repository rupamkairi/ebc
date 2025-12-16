// src/store/authStore.ts
import { create } from "zustand";

import { SessionResponse } from "@/types/auth";

export type User = SessionResponse["user"];

type AuthState = {
  token?: string | null;
  user?: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => {
    if (typeof window !== "undefined") {
      try {
        if (token) localStorage.setItem("ebc_token", token);
        else localStorage.removeItem("ebc_token");
      } catch {}
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    try {
      if (typeof window !== "undefined") localStorage.removeItem("ebc_token");
    } catch {}
    set({ token: null, user: null });
  },
}));

export function hydrateAuthFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const token = localStorage.getItem("ebc_token");
    if (token) useAuthStore.getState().setToken(token);
  } catch {}
}
