import { create } from "zustand";

interface Seats {
  seats: string[];
  setSeats: (seats: string[]) => void;
}

const useCartStore = create<Seats>((set) => ({
  seats: [],
  setSeats: (seats: string[]) => set({ seats: seats }),
}));

export default useCartStore;
