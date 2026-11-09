import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { InsightRuleMeta } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";

const c = copy.methodology;

interface TocItem {
  id: string;
  label: string;
}

interface MethodologyTocProps {
  rules: InsightRuleMeta[];
}

function buildItems(rules: InsightRuleMeta[]): TocItem[] {
  return [
    { id: c.anchorSummary, label: c.summaryHeading },
    { id: c.anchorSource, label: c.sourceHeading },
    { id: c.anchorMetrics, label: c.metricsHeading },
    { id: c.anchorInsights, label: c.insightsHeading },
    ...rules.map((rule) => ({ id: rule.id, label: rule.name })),
    { id: c.anchorDisclaimer, label: c.globalDisclaimerHeading },
    { id: c.anchorUpdate, label: c.anchorUpdate },
  ];
}

function TocLinks({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={[
                "block rounded-lg px-3 py-1.5 transition-colors duration-150",
                isActive
                  ? "bg-brand-50 font-semibold text-brand-800"
                  : "text-text-muted hover:bg-card hover:text-text",
              ].join(" ")}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function MethodologyToc({ rules }: MethodologyTocProps) {
  const items = useMemo(() => buildItems(rules), [rules]);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      <nav aria-label={c.tocLabel} className="hidden lg:block">
        <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          {c.tocLabel}
        </p>
        <TocLinks items={items} activeId={activeId} />
      </nav>

      <nav aria-label={c.tocLabel} className="mt-5 lg:hidden">
        <details className="group rounded-xl border border-border bg-card p-3">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-2 text-sm font-semibold text-text">
            {c.tocOpen}
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 text-text-muted transition-transform duration-150 group-open:rotate-180"
            />
          </summary>
          <div className="mt-2">
            <TocLinks items={items} activeId={activeId} />
          </div>
        </details>
      </nav>
    </>
  );
}
