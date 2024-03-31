import { useAuthStore } from "@/stores/authStore";
import { useRoutes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Dashboard from "./Dashboard";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  let isAuth = false;
  useEffect(() => {
    // @ts-ignore
    useAuthStore.persist.rehydrate();
    isAuth = useAuthStore.getState().isAuth;
    if (!isAuth) {
      alert("Not logged in");
      navigate("/login");
    }
  }, []);

  const children = useRoutes([
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);

  return children;
}
