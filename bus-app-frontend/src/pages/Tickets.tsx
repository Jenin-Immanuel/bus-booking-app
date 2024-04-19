import axios from "axios";

import { useState, useEffect } from "react";
import { API_URL } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

import { TicketDetails } from "@/types";

import useTicketStore from "@/stores/ticketStore";
import TicketDisplay from "@/components/TicketDisplay";

export default function Tickets() {
  const [tickets, setTickets_] = useState<TicketDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const setTickets = useTicketStore((state) => state.setTickets);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(API_URL + "/booking/getTickets", {
        withCredentials: true,
      });
      if (res.data.status === "error") {
        return alert(res.data.message);
      }

      setTickets_(res.data.data as TicketDetails[]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleNavigation = (indexOfTicket: number) => {
    setTickets(tickets[indexOfTicket]);
    navigate(`/p/tickets/${tickets[indexOfTicket]._id}`);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="w-full max-w-screen-lg mx-2 md:mx-auto my-auto mt-10 flex flex-col gap-2 md:gap-4">
            <div className="w-full h-full flex justify-around items-center">
              <div>
                <h1 className="text-xl md:text-3xl font-bold">My Tickets</h1>
              </div>
              <div className="flex justify-center items-center">
                <Link
                  to="/p/dashboard"
                  className="flex justify-center items-center"
                >
                  <Button variant="secondary" className="mt-5">
                    Back to dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <ul className="flex flex-col gap-4 md:gap-6 mt-10">
                {tickets.map((ticket, index) => (
                  <TicketDisplay key={index} ticket={ticket} />
                  // <div key={ticket._id}>
                  //   <h3>Bus: {ticket.bus.provider}</h3>
                  //   <h4>Seats:</h4>
                  //   <ul>
                  //     {ticket.seats.map((seat) => (
                  //       <li key={seat._id}>{seat.seat.seatNo}</li>
                  //     ))}
                  //   </ul>
                  //   <p>Total Cost: {ticket.totalCost}</p>
                  //   <p>Status: {ticket.status}</p>
                  //   <p>
                  //     Booking Date: {new Date(ticket.bookingDate).toDateString()}
                  //   </p>
                  //   <Button onClick={() => handleNavigation(index)}>
                  //     View Details
                  //   </Button>
                  // </div>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}
