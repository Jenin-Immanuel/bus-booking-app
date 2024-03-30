import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useRoutes } from "react-router-dom";

import Dashboard from "./Dashboard";

export default function ProtectedRoute() {
  const children = useRoutes([
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);

  const isAuth = useAuthStore.getState().isAuth;

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}
