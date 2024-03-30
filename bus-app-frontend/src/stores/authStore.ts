import { create } from "zustand";

interface AuthStore {
  token: string | undefined;
  name: string | undefined;
  email: string | undefined;
  isAuth: boolean;
  login: (token: string, name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: undefined,
  isAuth: false,
  name: undefined,
  email: undefined,
  login: (token: string, name: string, email: string) =>
    set({ token, isAuth: true, name, email }),
  logout: () =>
    set({ token: undefined, isAuth: false, name: undefined, email: undefined }),
}));
