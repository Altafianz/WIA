import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { NoticePopup } from "../components/common/NoticePopup.js";
import { PeriodNotice } from "../components/dashboard/PeriodNotice.js";
import { copy } from "../content/copy.id.js";

function findCloseButton(
  node: React.ReactNode
): React.ReactElement<{ onClick: () => void }> | null {
  if (!React.isValidElement(node)) return null;

  const props = node.props as {
    "aria-label"?: string;
    children?: React.ReactNode;
  };
  if (
    node.type === "button" &&
    props["aria-label"] === copy.a11y.closeNotice
  ) {
    return node as React.ReactElement<{ onClick: () => void }>;
  }

  for (const child of React.Children.toArray(props.children)) {
    const found = findCloseButton(child);
    if (found) return found;
  }

  return null;
}

function renderPopup(open: boolean) {
  return renderToStaticMarkup(
    <NoticePopup
      open={open}
      onDismiss={() => {}}
      popupRef={{ current: null }}
      testId="notice-popup"
      icon={<span />}
    >
      <p>Isi pemberitahuan</p>
    </NoticePopup>
  );
}

describe("NoticePopup", () => {
  it("renders a non-modal polite status region with a labelled close button", () => {
    const html = renderPopup(true);

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain(`aria-label="${copy.a11y.closeNotice}"`);
    expect(html).toContain("<button");
    expect(html).toContain("Isi pemberitahuan");
  });

  it("floats below the header on the top left with a bounded width", () => {
    const html = renderPopup(true);

    expect(html).toContain("fixed");
    expect(html).toContain("left-4");
    expect(html).toContain("right-4");
    expect(html).toContain("top-[calc(4rem+1rem)]");
    expect(html).toContain("sm:max-w-[420px]");
    expect(html).toContain("z-30");
    expect(html).toContain("shadow-lg");
  });

  it("renders nothing while closed", () => {
    expect(renderPopup(false)).toBe("");
  });

  it("calls onDismiss when the close button is pressed", () => {
    const onDismiss = vi.fn();
    const popup = NoticePopup({
      open: true,
      onDismiss,
      popupRef: { current: null },
      testId: "notice-popup",
      children: <p>Isi pemberitahuan</p>,
    });

    const button = findCloseButton(popup);
    expect(button).not.toBeNull();
    button?.props.onClick();

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("PeriodNotice popup triggers", () => {
  it("shows for legacy years 2021 and 2022", () => {
    for (const year of [2021, 2022]) {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <PeriodNotice periodStatus="final" fiscalYear={year} />
        </MemoryRouter>
      );
      expect(html).toContain('role="status"');
      expect(html).toContain(
        copy.dashboard.legacyDataNotice.slice(0, 25)
      );
    }
  });

  it("shows the regular realization notice when data is not final", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PeriodNotice periodStatus="approved" fiscalYear={2024} />
      </MemoryRouter>
    );

    expect(html).toContain('role="status"');
    expect(html).toContain(copy.dashboard.realizationNotReleased);
  });

  it("does not render for a final, non-legacy year", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PeriodNotice periodStatus="final" fiscalYear={2024} />
      </MemoryRouter>
    );

    expect(html).toBe("");
  });
});
