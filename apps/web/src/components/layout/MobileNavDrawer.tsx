import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { copy } from "../../content/copy.id.js";

export interface NavItem {
  to: string;
  label: string;
  end: boolean;
}

export interface MobileNavDrawerProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  drawerRef: React.RefObject<HTMLDivElement>;
  items: NavItem[];
  withSimpleParam: (path: string) => string;
  isSimple: boolean;
  onToggleSimple: () => void;
}

export function MobileNavDrawer({
  id = "mobile-nav-drawer",
  isOpen,
  onClose,
  drawerRef,
  items,
  withSimpleParam,
  isSimple,
  onToggleSimple,
}: MobileNavDrawerProps) {
  return (
    <>
      {/* Dark overlay backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-text/40 transition-opacity duration-200 md:hidden motion-reduce:transition-none",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
        data-testid="mobile-nav-overlay"
      />

      {/* Drawer panel */}
      <div
        id={id}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.nav.mainMenu}
        tabIndex={-1}
        className={[
          "fixed top-0 right-0 z-50 h-full w-[80vw] max-w-[320px] bg-bg border-l border-border shadow-xl",
          "flex flex-col p-4 transition-transform duration-200 ease-in-out md:hidden motion-reduce:transition-none",
          isOpen
            ? "translate-x-0 visible pointer-events-auto"
            : "translate-x-full invisible pointer-events-none",
        ].join(" ")}
        data-testid="mobile-nav-drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="font-bold text-base text-brand-600 tracking-tight">
            {copy.common.siteName}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.nav.closeMenu}
            className="p-2 rounded-md text-text-muted hover:text-text hover:bg-surface min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical nav links */}
        <nav aria-label={copy.nav.mainMenu} className="flex-1 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {items.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={withSimpleParam(to)}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center min-h-[44px] px-4 py-2.5 rounded-md text-base font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      isActive
                        ? "bg-brand-50 text-brand-600 font-semibold"
                        : "text-text-muted hover:text-text hover:bg-surface",
                    ].join(" ")
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Secondary controls: Simple Mode toggle */}
        <div className="pt-4 border-t border-border mt-auto">
          <button
            type="button"
            role="switch"
            aria-checked={isSimple}
            onClick={onToggleSimple}
            className={[
              "w-full flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-md border text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              isSimple
                ? "border-brand-600 bg-brand-50 text-brand-600"
                : "border-border bg-surface text-text-muted hover:text-text",
            ].join(" ")}
          >
            <span>{copy.nav.simpleModeLabel}</span>
            <span
              className={[
                "w-9 h-5 flex items-center rounded-full p-0.5 transition-colors",
                isSimple ? "bg-brand-600" : "bg-border",
              ].join(" ")}
              aria-hidden="true"
            >
              <span
                className={[
                  "bg-surface w-4 h-4 rounded-full shadow-md transform transition-transform",
                  isSimple ? "translate-x-4" : "translate-x-0",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

