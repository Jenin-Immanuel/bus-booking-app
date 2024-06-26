export interface BusCardProps {
  _id: string;
  provider: string;
  description: string;
  start: string;
  end: string;
  startTime: Date;
  endTime: Date;
  price: number;
  maxSeats: number;
  seats: string[];
  bookedSeats: number;
  __v: number;
}

export interface SeatDetails {
  _id: string;
  seatNo: number;
  status: string;
  cost: number;
  isSleeper: boolean;
  pName?: string;
  pAge?: number;
  pGender?: string;
  __v: number;
}

export interface BusDetails {
  _id: string;
  provider: string;
  description: string;
  start: string;
  end: string;
  startTime: Date;
  endTime: Date;
  maxSeats: number;
  seats: SeatDetails[];
}

interface SeatExtended {
  seat: SeatDetails;
  _id: string;
}

export interface TicketDetails {
  _id: string;
  user: string;
  bus: BusDetails;
  seats: SeatExtended[];
  totalCost: number;
  status: "reserved" | "booked" | "cancelled";
  bookingDate: Date;
}
