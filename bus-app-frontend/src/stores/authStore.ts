import { API_URL } from "@/utils/constants";

import { create } from "zustand";

import { persist } from "zustand/middleware";
import axios from "axios";

import { useToast } from "@/components/ui/use-toast";
interface AuthStore {
  name: string | undefined;
  email: string | undefined;
  isAuth: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
}

interface ResData {
  name: string | undefined;
  email: string | undefined;
  isAuth: boolean;
}

let data: ResData = { name: undefined, email: undefined, isAuth: false };
(async () => {
  const res = await fetch(API_URL + "/user/me", { credentials: "include" });
  const resData: any = await res.json();

  if (resData.status === "success") {
    data.email = resData.data.email;
    data.name = resData.data.name;
    data.isAuth = true;
  }
  // console.log("RR", resData);
})();

export const useAuthStore = create<AuthStore>(
  // @ts-ignore
  persist(
    (set, _) => ({
      isAuth: data.isAuth,
      name: data.name,
      email: data.email,
      login: (name: string, email: string) =>
        set({ isAuth: true, name, email }),
      logout: async () => {
        try {
          await axios.get(API_URL + "/user/logout", { withCredentials: true });
          set({
            isAuth: false,
            name: undefined,
            email: undefined,
          });
        } catch (err) {
          const { toast } = useToast();
          toast({
            title: "Error",
            description: "Error while logging out",
            variant: "destructive",
          });
          console.log(err);
        }
      },
    }),
    {
      name: "auth-storage",
      // skipHydration: true,
    }
  )
);
