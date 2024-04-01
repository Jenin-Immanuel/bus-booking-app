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
