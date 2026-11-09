import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { useSimpleMode } from "../../hooks/useSimpleMode.js";
import { useMobileNav } from "../../hooks/useMobileNav.js";
import { BrandMark } from "./BrandMark.js";
import { MobileNavDrawer, NavItem } from "./MobileNavDrawer.js";

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: copy.nav.home, end: true },
  { to: "/dashboard", label: copy.nav.dashboard, end: false },
  { to: "/bandingkan", label: copy.nav.compare, end: false },
  { to: "/glosarium", label: copy.nav.glossary, end: false },
  { to: "/metodologi", label: copy.nav.methodology, end: false },
];

export function AppHeader() {
  const [isSimple, setSimple] = useSimpleMode();
  const { isOpen, close, toggle, triggerRef, drawerRef } = useMobileNav();

  const withSimpleParam = (path: string) =>
    isSimple ? `${path}?simple=1` : path;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-header shadow-header backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-text-inverse"
      >
        {copy.common.skipToContent}
      </a>
      <div className="page-gutter flex h-16 items-center justify-between gap-4 md:h-header">
        <Link
          to="/"
          className="shrink-0 rounded-xl transition-opacity duration-150 hover:opacity-90"
          aria-label={copy.common.siteName}
        >
          <BrandMark />
        </Link>

        {/* Desktop nav (>= 1024px) */}
        <nav
          aria-label={copy.nav.mainMenu}
          className="hidden lg:flex items-center overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          <ul className="flex items-center gap-1 whitespace-nowrap">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={withSimpleParam(to)}
                  end={end}
                  className={({ isActive }) =>
                    [
                      "inline-flex min-h-[44px] items-center rounded-full px-2.5 py-2 text-sm font-semibold transition-colors duration-150",
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

        {/* Desktop simple mode toggle (>= 1024px) */}
        <button
          type="button"
          role="switch"
          aria-checked={isSimple}
          title={copy.nav.simpleModeDescription}
          onClick={() => setSimple(!isSimple)}
          className={[
            "hidden shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150 lg:inline-flex",
            isSimple
              ? "border-brand-600 bg-brand-50 text-brand-800"
              : "border-border bg-card text-text-muted hover:border-border-strong hover:text-text",
          ].join(" ")}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>{copy.nav.simpleModeLabel}</span>
          <span
            aria-hidden="true"
            className={[
              "h-2 w-2 rounded-full transition-colors duration-150",
              isSimple ? "bg-brand-600" : "bg-border-strong",
            ].join(" ")}
          />
        </button>

        {/* Mobile burger button (< 1024px) */}
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          aria-label={isOpen ? copy.nav.closeMenu : copy.nav.openMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
          className="flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl text-text transition-colors duration-150 hover:bg-surface lg:hidden"
          data-testid="mobile-burger-button"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      </header>

      {/* Mobile nav drawer (< 1024px) — outside the blurred header so it
          stays fixed to the viewport instead of the header box. */}
      <MobileNavDrawer
        id="mobile-nav-drawer"
        isOpen={isOpen}
        onClose={close}
        drawerRef={drawerRef}
        items={NAV_ITEMS}
        withSimpleParam={withSimpleParam}
        isSimple={isSimple}
        onToggleSimple={() => setSimple(!isSimple)}
      />
    </>
  );
}
