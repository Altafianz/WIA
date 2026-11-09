import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { BrandMark } from "./BrandMark.js";

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
          "fixed inset-0 z-40 bg-brand-900 opacity-0 transition-opacity duration-200 lg:hidden motion-reduce:transition-none",
          isOpen ? "opacity-40 pointer-events-auto" : "pointer-events-none",
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
          "fixed top-0 right-0 z-50 h-full w-[86vw] max-w-[360px] bg-card border-l border-border shadow-lg",
          "flex flex-col rounded-l-3xl p-5 transition-transform duration-200 ease-in-out lg:hidden motion-reduce:transition-none",
          isOpen
            ? "translate-x-0 visible pointer-events-auto"
            : "translate-x-full invisible pointer-events-none",
        ].join(" ")}
        data-testid="mobile-nav-drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <BrandMark />
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.nav.closeMenu}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text"
            data-testid="mobile-nav-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Vertical nav links */}
        <nav aria-label={copy.nav.mainMenu} className="flex-1 py-5 overflow-y-auto">
          <ul className="flex flex-col gap-1.5">
            {items.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={withSimpleParam(to)}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold transition-colors duration-150",
                      isActive
                        ? "bg-brand-50 text-brand-800"
                        : "text-text-muted hover:bg-surface hover:text-text",
                    ].join(" ")
                  }
                  data-testid="mobile-nav-link"
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
              "flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-150",
              isSimple
                ? "border-brand-600 bg-brand-50 text-brand-800"
                : "border-border bg-surface text-text-muted hover:border-border-strong hover:text-text",
            ].join(" ")}
          >
            <span>{copy.nav.simpleModeLabel}</span>
            <span
              className={[
                "flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-150",
                isSimple ? "bg-brand-600" : "bg-border-strong",
              ].join(" ")}
              aria-hidden="true"
            >
              <span
                className={[
                  "h-5 w-5 rounded-full bg-card shadow-sm transition-transform duration-150",
                  isSimple ? "translate-x-5" : "translate-x-0",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
