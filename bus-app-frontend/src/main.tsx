import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/p/*", element: <ProtectedRoute /> },
]);

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
