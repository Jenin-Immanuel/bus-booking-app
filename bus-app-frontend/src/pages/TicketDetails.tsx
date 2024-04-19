import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { API_URL } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { cn, dateFormatter } from "@/lib/utils";

import { TicketDetails } from "@/types";
import SeatDisplay from "@/components/SeatDisplay";

// TODO: Add the expiration time in the details
export default function TicketDetailsComp() {
  const params = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<TicketDetails>({} as TicketDetails);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchData = async () => {
      const res = await axios.get(API_URL + `/booking/getTicket/${params.id}`, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.status === "error") {
        return alert(res.data.message);
      }
      setTicket(res.data.data as TicketDetails);
      setIsLoading(false);
    };
    fetchData();
  }, []);

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
    navigate(`/p/dashboard`);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full max-w-screen-lg mx-2 md:mx-auto my-auto mt-10">
          <div className="w-full h-full flex flex-col justify-around">
            <div className="flex justify-around">
              <h1 className="text-xl md:text-3xl font-bold">
                Ticket ID: {params.id}
              </h1>
              <Badge
                className={cn(
                  ticket.status === "booked" ? "bg-green-500" : "bg-white"
                )}
              >
                {ticket.status}
              </Badge>
            </div>
            <div className="w-full h-full text-lg lg:text-xl flex flex-col justify-between mt-10 gap-4">
              <h3 className="text-xl lg:text-2xl font-bold">
                Bus:{" "}
                <span className="text-green-500">{ticket.bus.provider}</span>
              </h3>
              <div>
                <h4 className="text-xl lg:text-2xl font-bold">
                  Seats Details:
                </h4>
                <ul className="flex flex-col gap-2 my-2">
                  {ticket.seats.map((seat) => (
                    <SeatDisplay key={seat._id} seat={seat.seat} />
                  ))}
                </ul>
              </div>
              <p>
                Total Cost:{" "}
                <span className="text-green-500">{ticket.totalCost}</span>
              </p>
              <p>
                Status: <span className="text-green-500">{ticket.status}</span>
              </p>
              <p>
                Start:{" "}
                <span className="text-green-500">
                  {dateFormatter.format(new Date(ticket.bus.startTime))}
                </span>
              </p>
              <p>
                End:{" "}
                <span className="text-green-500">
                  {dateFormatter.format(new Date(ticket.bus.endTime))}
                </span>{" "}
              </p>

              <div className="flex justify-center items-center">
                {ticket.status === "reserved" && (
                  <Button onClick={handlePayment}>Pay now</Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col gap-4">
            <Link to="/p/dashboard">
              <Button variant="secondary" className="mt-5 min-w-[200px]">
                Back to dashboard
              </Button>
            </Link>
            <Button
              variant={"secondary"}
              onClick={() => navigate(-1)}
              className="min-w-[200px] bg-amber-500 hover:bg-amber-900"
            >
              View all tickets
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
