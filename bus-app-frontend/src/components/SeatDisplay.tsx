import { SeatDetails } from "@/types";

export default function SeatDisplay({ seat }: { seat: SeatDetails }) {
  return (
    <div className="flex flex-col gap-2 border rounded-md p-2 mx-2 md:p-4">
      <div>
        <h2 className="text-xl font-bold">Seat No: {seat.seatNo}</h2>
      </div>
      <div className="flex justify-between">
        <p>
          Name: <span className="text-green-500">{seat.pName}</span>
        </p>
        <p>
          Age: <span className="text-green-500">{seat.pAge}</span>
        </p>
        <p>
          Gender:{" "}
          <span className="text-green-500">
            {seat.pGender === "M" ? "Male" : "Female"}
          </span>
        </p>
        <p>
          Cost: <span className="text-green-500">{seat.cost}</span>
        </p>
        <p>
          Type:{" "}
          <span className="text-green-500">
            {seat.isSleeper ? "Sleeper" : "Seater"}
          </span>
        </p>
      </div>
    </div>
  );
}
