import React from "react";
import { NavLink } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
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
          "fixed inset-0 z-40 bg-brand-900/40 backdrop-blur-sm transition-opacity duration-150 md:hidden motion-reduce:transition-none",
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
          "fixed right-0 top-0 z-50 flex h-full w-[86vw] max-w-[360px] flex-col rounded-l-3xl border-l border-border bg-card p-5 shadow-lg",
          "transition-transform duration-150 ease-out md:hidden motion-reduce:transition-none",
          isOpen
            ? "translate-x-0 visible pointer-events-auto"
            : "translate-x-full invisible pointer-events-none",
        ].join(" ")}
        data-testid="mobile-nav-drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <BrandMark />
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.nav.closeMenu}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Vertical nav links */}
        <nav aria-label={copy.nav.mainMenu} className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1">
            {items.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={withSimpleParam(to)}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex min-h-[52px] items-center rounded-xl px-4 py-3 text-lg font-semibold transition-colors duration-150",
                      isActive
                        ? "bg-brand-50 text-brand-800"
                        : "text-text-muted hover:bg-surface hover:text-text",
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
        <div className="mt-auto border-t border-border pt-4">
          <button
            type="button"
            role="switch"
            aria-checked={isSimple}
            onClick={onToggleSimple}
            className={[
              "flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-base font-semibold transition-colors duration-150",
              isSimple
                ? "border-brand-600 bg-brand-50 text-brand-800"
                : "border-border bg-card text-text-muted hover:border-border-strong hover:text-text",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>{copy.nav.simpleModeLabel}</span>
            </span>
            <span
              className={[
                "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150",
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
