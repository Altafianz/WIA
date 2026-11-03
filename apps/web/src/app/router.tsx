import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { App } from "./App.js";
import { HomePage } from "../pages/HomePage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { ComparePage } from "../pages/ComparePage.js";
import { PlaceholderPage } from "../pages/PlaceholderPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { copy } from "../content/copy.id.js";

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
        element: <PlaceholderPage pageName={copy.nav.glossary} />,
      },
      {
        path: "metodologi",
        element: <PlaceholderPage pageName={copy.nav.methodology} />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
