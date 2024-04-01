import { BusCardProps } from "@/types";
import { Button } from "./ui/button";
import React from "react";

function getTime(date: Date) {
  return new Date(date).toTimeString().slice(0, 5);
}

export default function BusCard(props: BusCardProps) {
  async function handleViewSeats(id: string) {
    console.log("View Seats", id);
  }

  return (
    <div className="border rounded-md border-slate-400 w-full px-4 py-2 text-xs flex justify-between items-center md:text-base md:px-10">
      <div className="flex flex-col gap-2">
        <h2>{`${getTime(props.startTime)} ${getTime(props.endTime)}`}</h2>
        <h2>{props.provider}</h2>
        <p>
          {props.start} - {props.end}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p>
          <span className="text-green-500">Available Seats:</span>{" "}
          {props.maxSeats - props.bookedSeats}
        </p>
        <Button
          variant="default"
          className=""
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await handleViewSeats(props._id);
          }}
        >
          View Seats
        </Button>
      </div>
    </div>
  );
}