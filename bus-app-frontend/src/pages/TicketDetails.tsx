import { useParams, useNavigate } from "react-router-dom";

import useTicketStore from "@/stores/ticketStore";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

import axios from "axios";

import { API_URL } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function TicketDetailsComp() {
  const params = useParams();
  const navigate = useNavigate();
  const ticket = useTicketStore((state) => state);

  const [timeDiff, setTimeDiff] = useState<number>(0); // 10 minutes in seconds
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const calculateDiff = () => {
    const now = new Date(Date.now()).getTime();
    const bookingDate = new Date(ticket.bookingDate).getTime();
    const diff = now - bookingDate;
    setTimeDiff(diff);
  };
  const getTimeComponents = () => {
    setSeconds(timeDiff % 60);
    setMinutes(Math.floor((timeDiff % (60 * 60)) / 60));
    setHours(Math.floor(timeDiff / (60 * 60)));
  };
  useEffect(() => {
    calculateDiff();
    getTimeComponents();

    let intervalId = setTimeout(() => {
      if (timeDiff > 0) {
        setTimeDiff(timeDiff - 1);
        getTimeComponents();
      } else {
        return;
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, [ticket.bookingDate]);

  const handlePayment = async () => {
    const res = await axios.post(
      API_URL + "/booking/payment",
      { ticketId: ticket._id },
      { withCredentials: true }
    );
    if (res.data.status === "error") {
      return alert(res.data.message);
    }
    alert(res.data.message);
    ticket.setTickets(res.data.ticket);
    navigate(`/p/dashboard`);
  };

  return (
    <>
      <div>
        <div>
          <h1>Ticket ID: {params.id}</h1>
          {/* Show details */}
          <Badge
            className={cn(
              ticket.status === "booked" ? "bg-green-500" : "bg-white"
            )}
          >
            {ticket.status}
          </Badge>
          <h3>Bus: {ticket.bus.provider}</h3>
          <h4>Seats:</h4>
          <ul>
            {ticket.seats.map((seat) => (
              <li key={seat._id}>Seat No: {seat.seat.seatNo}</li>
            ))}
          </ul>
          <p>Total Cost: {ticket.totalCost}</p>
          <p>Status: {ticket.status}</p>
          <p>
            Booking Date: {new Date(ticket.bookingDate).toDateString()}{" "}
            {new Date(ticket.bookingDate).toTimeString()}
          </p>
          {ticket.status === "reserved" && (
            <Button onClick={handlePayment}>Pay now</Button>
          )}
        </div>
        <div>
          {hours > 0 && <span>{hours}:</span>}
          <span>{minutes.toString().padStart(2, "0")}:</span>
          <span>{seconds.toString().padStart(2, "0")}</span>
        </div>
      </div>
    </>
  );
}
