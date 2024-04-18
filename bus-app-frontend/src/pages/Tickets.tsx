import axios from "axios";

import { useState, useEffect } from "react";
import { API_URL } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

import { TicketDetails } from "@/types";

import useTicketStore from "@/stores/ticketStore";

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
          <div>
            {tickets.map((ticket, index) => (
              <div key={ticket._id}>
                <h3>Bus: {ticket.bus.provider}</h3>
                <h4>Seats:</h4>
                <ul>
                  {ticket.seats.map((seat) => (
                    <li key={seat._id}>{seat.seat.seatNo}</li>
                  ))}
                </ul>
                <p>Total Cost: {ticket.totalCost}</p>
                <p>Status: {ticket.status}</p>
                <p>
                  Booking Date: {new Date(ticket.bookingDate).toDateString()}
                </p>
                <Button onClick={() => handleNavigation(index)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-5">
            <Link to="/p/dashboard">Back to dashboard</Link>
          </Button>
        </>
      )}
    </>
  );
}
