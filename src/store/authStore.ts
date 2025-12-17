import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SessionResponse } from "@/types/auth";

export type User = SessionResponse["user"];

type AuthState = {
  token?: string | null;
  user?: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "ebc_auth_storage", // unique name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // only persist token, maybe user too? Plan said token. Let's persist token.
      // If we persist user, we might show stale data. But usually better to persist both for fast load, then revalidate.
      // The original code only persisted token manually: localStorage.setItem("ebc_token", token);
      // So sticking to token only for parity, but let's check if we should persist user.
      // "The login response has userId, but store expects User object."
      // Let's persist token only as per original logic, fetching session on load likely happens elsewhere or relied on token presence.
      // Wait, AuthGuard relies on 'token' to deterine auth.
      // Let's persist token only to match previous behavior exactly.
    }
  )
);
