import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { useSimpleMode } from "../../hooks/useSimpleMode.js";
import { useMobileNav } from "../../hooks/useMobileNav.js";
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
    <header className="sticky top-0 z-40 border-b border-border bg-bg shadow-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-600 text-text-inverse px-3 py-1 rounded-md text-sm"
      >
        {copy.common.skipToContent}
      </a>
      <div className="mx-auto max-w-container px-4 flex items-center justify-between h-14 gap-4">
        <Link
          to="/"
          className="font-bold text-lg text-brand-600 tracking-tight shrink-0"
          aria-label={copy.common.siteName}
        >
          {copy.common.siteName}
        </Link>

        {/* Desktop nav (>= 768px) */}
        <nav
          aria-label={copy.nav.mainMenu}
          className="hidden md:flex items-center overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          <ul className="flex items-center gap-1 whitespace-nowrap">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={withSimpleParam(to)}
                  end={end}
                  className={({ isActive }) =>
                    [
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      isActive
                        ? "bg-brand-50 text-brand-600"
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

        {/* Desktop simple mode toggle (>= 768px) */}
        <button
          type="button"
          role="switch"
          aria-checked={isSimple}
          title={copy.nav.simpleModeDescription}
          onClick={() => setSimple(!isSimple)}
          className={[
            "hidden md:block shrink-0 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
            isSimple
              ? "border-brand-600 bg-brand-50 text-brand-600"
              : "border-border bg-surface text-text-muted hover:text-text",
          ].join(" ")}
        >
          {copy.nav.simpleModeLabel}
        </button>

        {/* Mobile burger button (< 768px) */}
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          aria-label={isOpen ? copy.nav.closeMenu : copy.nav.openMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
          className="md:hidden p-2 rounded-md text-text hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          data-testid="mobile-burger-button"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav drawer (< 768px) */}
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
    </header>
  );
}
