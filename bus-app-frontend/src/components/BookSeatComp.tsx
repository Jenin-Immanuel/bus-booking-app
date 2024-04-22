import Seatchart from "@/components/ui/seatchart";
import { Button } from "@/components/ui/button";

import { useRef } from "react";
import SeatchartJS, { Options } from "seatchart";

import { useNavigate } from "react-router-dom";

import "@/App.css";
import "@/css/chart.min.css";

import { useEffect } from "react";

import { BusDetails } from "@/types";

// Zustand stores
// import useBusStore from "@/stores/busStore";
import useCartStore from "@/stores/cartStore";

const BookSeatComp = (bus: BusDetails) => {
  const navigate = useNavigate();
  const setSeats = useCartStore((state) => state.setSeats);

  let rowCount = bus.maxSeats / 3;
  let seatPrice = bus.seats[0].cost;

  let rSeats = [],
    femaleSeats = [];
  for (let i = 0; i < bus.seats.length; i++) {
    if (bus.seats[i].status === "paid" || bus.seats[i].status === "reserved") {
      const index = { row: Math.floor(i / 3), col: i % 3 };
      rSeats.push(index);
      if (bus.seats[i].pGender === "F") {
        femaleSeats.push(index);
      }
    }
  }

  let colCount = 3;
  const options: Options = {
    map: {
      rows: rowCount,
      columns: colCount,
      seatTypes: {
        default: {
          label: "Available",
          cssClass: "economy",
          price: seatPrice,
        },
        female: {
          label: "Female",
          cssClass: "female",
          price: seatPrice,
          seats: femaleSeats,
        },
      },
      columnSpacers: [1],
      indexerRows: {
        visible: false,
      },
      indexerColumns: {
        visible: false,
      },
      seatLabel: (index) => {
        return `${index.row * colCount + index.col + 1}`;
      },
      reservedSeats: rSeats,
    },
    cart: {
      currency: "₹ ",
    },
  };

  const seatchartRef = useRef<SeatchartJS>();

  useEffect(() => {
    seatchartRef.current?.addEventListener("submit", async (event) => {
      console.log(1);
      let selectedSeats: string[] = [];
      event.cart.forEach((seat) => {
        selectedSeats.push(seat.label);
      });

      setSeats(selectedSeats);
      navigate("/p/book/details");
    });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col text-center">
      <h1 className="mt-10 text-5xl font-bold">Seat Map</h1>
      <Seatchart ref={seatchartRef} options={options} />
      <div className="mb-10">
        <Button
          onClick={() => {
            navigate("/p/dashboard");
          }}
          variant={"secondary"}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
};

export default BookSeatComp;
