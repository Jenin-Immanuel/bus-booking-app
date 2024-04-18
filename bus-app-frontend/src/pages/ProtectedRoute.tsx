import { useAuthStore } from "@/stores/authStore";
import { useRoutes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Dashboard from "./Dashboard";
import BookSeat from "./BookSeat";
import BookingForm from "./BookingForm";
import Tickets from "./Tickets";
import TicketDetailsComp from "./TicketDetails";
export default function ProtectedRoute() {
  const navigate = useNavigate();
  let isAuth = false;

  isAuth = useAuthStore((state) => state.isAuth);
  useEffect(() => {
    try {
      // @ts-ignore
      useAuthStore.persist.rehydrate();
      // if (!isAuth) {
      //   alert("Not logged in");
      //   navigate("/login");
      // }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const children = useRoutes([
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/book/:id",
      element: <BookSeat />,
    },
    {
      path: "/book/details",
      element: <BookingForm />,
    },
    {
      path: "/tickets",
      element: <Tickets />,
    },
    {
      path: "/tickets/:id",
      element: <TicketDetailsComp />,
    },
  ]);

  return children;
}
