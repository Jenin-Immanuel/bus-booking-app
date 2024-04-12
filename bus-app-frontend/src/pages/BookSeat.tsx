import Seatchart from "@/components/ui/seatchart";

import { useRef } from "react";
import SeatchartJS, { Options } from "seatchart";
import { useToast } from "@/components/ui/use-toast";

import "@/App.css";
import "@/css/chart.min.css";

const BookSeat = () => {
  const { toast } = useToast();
  const rowCount = 7;
  const colCount = 3;
  const seatPrice = 1000;
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
          seats: [{ row: 0, col: 1 }],
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
      reservedSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
    },
    cart: {
      currency: "₹ ",
    },
  };
  const seatchartRef = useRef<SeatchartJS>();

  // const handleClick = () => {
  //   const index = { row: 0, col: 2 };
  //   const seat = seatchartRef.current?.getSeat(index);

  //   seatchartRef.current?.setSeat(index, {
  //     state: seat?.state === "selected" ? "available" : "selected",
  //   });
  // };

  seatchartRef.current?.addEventListener("submit", async (event) => {
    console.log(event.cart);
    // const cart = event.cart;
    // cart.forEach(async (_) => {
    //   const x = await fetch("http://localhost:5555/user/me");
    //   const data = await x.json();
    //   console.log(data);
    // });
  });

  return (
    <div className="w-screen h-screen">
      {/* <button onClick={handleClick}>Toggle Seat</button> */}
      <Seatchart ref={seatchartRef} options={options} />
    </div>
  );
};

export default BookSeat;
