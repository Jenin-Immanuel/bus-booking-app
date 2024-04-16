import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import BookingFormComp from "@/components/BookingForm";

export default function BookingForm() {
  const navigate = useNavigate();
  return (
    <div className="container flex flex-col gap-10 justify-center items-center py-10">
      <h1 className="text-5xl font-bold">Passenger details</h1>

      <BookingFormComp />
      <div>
        <Button variant={"secondary"} onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    </div>
  );
}
