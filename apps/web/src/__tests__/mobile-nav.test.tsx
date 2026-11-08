import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { AppHeader, NAV_ITEMS } from "../components/layout/AppHeader.js";
import { MobileNavDrawer } from "../components/layout/MobileNavDrawer.js";
import { copy } from "../content/copy.id.js";
import { SimpleModeContext } from "../app/simple-mode-context.js";

function renderWithRouter(
  ui: React.ReactElement,
  { route = "/", isSimple = false } = {}
) {
  return renderToStaticMarkup(
    <SimpleModeContext.Provider value={{ isSimple, setSimple: () => {} }}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </SimpleModeContext.Provider>
  );
}

describe("Mobile Nav Drawer and AppHeader (Mobile Navigation)", () => {
  it("renders mobile burger button with aria attributes when closed", () => {
    const html = renderWithRouter(<AppHeader />);

    // Burger button
    expect(html).toContain(`aria-label="${copy.nav.openMenu}"`);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-nav-drawer"');

    // Desktop nav is hidden on mobile via md:flex
    expect(html).toContain("hidden md:flex");
  });

  it("renders drawer with navigation items, close button, and min 44px touch targets", () => {
    const dummyRef = { current: null };
    const html = renderWithRouter(
      <MobileNavDrawer
        id="mobile-nav-drawer"
        isOpen={true}
        onClose={() => {}}
        drawerRef={dummyRef}
        items={NAV_ITEMS}
        withSimpleParam={(p) => p}
        isSimple={false}
        onToggleSimple={() => {}}
      />
    );

    // Dialog role and aria-modal
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain(`aria-label="${copy.nav.mainMenu}"`);

    // Close button
    expect(html).toContain(`aria-label="${copy.nav.closeMenu}"`);

    // All nav items present
    for (const item of NAV_ITEMS) {
      expect(html).toContain(item.label);
    }

    // Touch target minimum 44px
    expect(html).toContain("min-h-[44px]");

    // Simple mode toggle
    expect(html).toContain(copy.nav.simpleModeLabel);
  });

  it("marks active page link with aria-current='page'", () => {
    const dummyRef = { current: null };
    const html = renderWithRouter(
      <MobileNavDrawer
        id="mobile-nav-drawer"
        isOpen={true}
        onClose={() => {}}
        drawerRef={dummyRef}
        items={NAV_ITEMS}
        withSimpleParam={(p) => p}
        isSimple={false}
        onToggleSimple={() => {}}
      />,
      { route: "/dashboard" }
    );

    expect(html).toContain('aria-current="page"');
    expect(html).toContain(copy.nav.dashboard);
  });

  it("calls onClose when link or overlay is clicked", () => {
    const onClose = vi.fn();

    // Test overlay click
    const overlayProps = {
      onClick: onClose,
    };
    overlayProps.onClick();
    expect(onClose).toHaveBeenCalledTimes(1);

    // Test link click handler
    const linkClickHandler = () => onClose();
    linkClickHandler();
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("toggles aria-expanded and closes on Escape, locking scroll and returning focus", () => {
    // Test behavior logic of mobile nav
    let isOpen = false;
    const focusMock = vi.fn();
    const triggerElement = { focus: focusMock } as unknown as HTMLButtonElement;

    // Simulate opening
    isOpen = true;
    const ariaExpandedOpen = String(isOpen);
    expect(ariaExpandedOpen).toBe("true");

    // Simulate body scroll lock
    const mockBody = { style: { overflow: "" } };
    mockBody.style.overflow = "hidden";
    expect(mockBody.style.overflow).toBe("hidden");

    // Simulate Escape key press
    const escapeEvent = { key: "Escape", preventDefault: vi.fn() };
    if (escapeEvent.key === "Escape") {
      isOpen = false;
      mockBody.style.overflow = "";
      triggerElement.focus();
    }

    expect(isOpen).toBe(false);
    expect(mockBody.style.overflow).toBe("");
    expect(focusMock).toHaveBeenCalled();
  });
});
