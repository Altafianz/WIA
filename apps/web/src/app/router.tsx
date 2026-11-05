import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { App } from "./App.js";
import { HomePage } from "../pages/HomePage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { ComparePage } from "../pages/ComparePage.js";
import { GlossaryPage } from "../pages/GlossaryPage.js";
import { MethodologyPage } from "../pages/MethodologyPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "bandingkan",
        element: <ComparePage />,
      },
      {
        path: "glosarium",
        element: <GlossaryPage />,
      },
      {
        path: "metodologi",
        element: <MethodologyPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
