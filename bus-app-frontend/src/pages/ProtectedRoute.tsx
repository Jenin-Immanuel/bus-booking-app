import { useAuthStore } from "@/stores/authStore";
import { useRoutes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import Dashboard from "./Dashboard";
import BookSeat from "./BookSeat";
import BookingForm from "./BookingForm";
import Tickets from "./Tickets";
import TicketDetailsComp from "./TicketDetails";
import axios from "axios";
import { API_URL } from "@/utils/constants";
export default function ProtectedRoute() {
  const navigate = useNavigate();
  let isAuth = false;
  const { toast } = useToast();

  isAuth = useAuthStore((state) => state.isAuth);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/user/me`, {
          withCredentials: true,
        });
        // Update the auth state
        login(res.data.data.name, res.data.data.email);
      } catch (err) {
        logout();
        toast({
          title: "Login",
          description: "Please login to access this page",
          variant: "destructive",
        });
        navigate("/login");
      }
    })();
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
