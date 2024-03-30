import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import Landing from "./pages/Landing.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{ path: "/", element: <Landing /> }]);

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
