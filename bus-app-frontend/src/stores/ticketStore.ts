import { create } from "zustand";

import { BusDetails, TicketDetails } from "@/types";

interface TicketActions {
  setTickets: (ticket: TicketDetails) => void;
}

const useTicketStore = create<TicketDetails & TicketActions>((set) => ({
  _id: "",
  bookingDate: new Date(),
  bus: {} as BusDetails,
  seats: [],
  status: "reserved",
  totalCost: 0,
  user: "",
  setTickets: (ticket: TicketDetails) => set({ ...ticket }),
}));

export default useTicketStore;
