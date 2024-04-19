import { TicketDetails } from "@/types";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import { Link } from "react-router-dom";
import { dateFormatter } from "@/lib/utils";

export default function TicketDisplay({ ticket }: { ticket: TicketDetails }) {
  // @ts-ignore
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  // Format the seat numbers from the following array
  const seats = formatter.format(
    ticket.seats.map((seat) => `${seat.seat.seatNo}`)
  );

  return (
    <div className="flex flex-col gap-2 md:gap-4 p-2 md:p-4 border rounded-md">
      <div className="flex items-center justify-between gap-5">
        <p className="text-xl md:text-2xl">
          Ticket ID: <span className="text-green-500">{ticket._id}</span>
        </p>
        <div className="flex gap-2 justify-center items-center">
          <div>{dateFormatter.format(new Date(ticket.bookingDate))}</div>
          <div
            className={cn(
              ticket.status === "booked" ? "bg-green-500" : "bg-red-500",
              "w-2 h-2 md:w-4 md:h-4 rounded-full"
            )}
          ></div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p>Bus: {ticket.bus.provider}</p>
          <p>Seats: {seats}</p>
          <p>Total Cost: {ticket.totalCost}</p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <Link to={`/p/tickets/${ticket._id}`}>
            <Button onClick={() => {}}>View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
