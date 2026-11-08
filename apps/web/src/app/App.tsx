import React from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader.js";
import { AppFooter } from "../components/layout/AppFooter.js";
import { SimpleModeProvider } from "./SimpleModeProvider.js";

export function App() {
  return (
    <SimpleModeProvider>
      <div className="min-h-screen flex flex-col bg-bg text-text">
        <AppHeader />
        <main id="main-content" className="page-gutter w-full flex-1">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </SimpleModeProvider>
  );
}
