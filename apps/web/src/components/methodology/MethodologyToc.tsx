import React from "react";
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

function TocLinks({ items }: { items: TocItem[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="block rounded-sm py-1 text-text-muted transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MethodologyToc({ rules }: MethodologyTocProps) {
  const items = buildItems(rules);

  return (
    <>
      <aside className="hidden lg:block">
        <nav
          aria-label={c.tocLabel}
          className="sticky top-20 rounded-lg border border-border bg-surface p-4"
        >
          <h2 className="mb-2 text-sm font-semibold text-text">{c.tocLabel}</h2>
          <TocLinks items={items} />
        </nav>
      </aside>

      <nav aria-label={c.tocLabel} className="lg:hidden">
        <details className="rounded-lg border border-border bg-surface p-3">
          <summary className="cursor-pointer text-sm font-semibold text-text">
            {c.tocOpen}
          </summary>
          <div className="mt-2">
            <TocLinks items={items} />
          </div>
        </details>
      </nav>
    </>
  );
}
