import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  name: string | undefined;
  email: string | undefined;
  isAuth: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  // @ts-ignore
  persist(
    (set, _) => ({
      token: undefined,
      isAuth: false,
      name: undefined,
      email: undefined,
      login: (name: string, email: string) =>
        set({ isAuth: true, name, email }),
      logout: () =>
        set({
          isAuth: false,
          name: undefined,
          email: undefined,
        }),
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
