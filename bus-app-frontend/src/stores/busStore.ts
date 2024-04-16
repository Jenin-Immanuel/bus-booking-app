import { create } from "zustand";

import { BusDetails } from "@/types";

interface Bus {
  bus: BusDetails;
  setBus: (bus: BusDetails) => void;
}

const useBusStore = create<Bus>((set) => ({
  bus: {} as BusDetails,
  setBus: (newBus: BusDetails) => set({ bus: newBus }),
}));

export default useBusStore;
