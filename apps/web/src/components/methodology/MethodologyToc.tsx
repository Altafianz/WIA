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
            className="block rounded-lg px-3 py-2 text-text-muted transition-colors duration-150 hover:bg-brand-50 hover:text-brand-700"
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
          className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <h2 className="mb-2 px-3 text-sm font-semibold text-text">{c.tocLabel}</h2>
          <TocLinks items={items} />
        </nav>
      </aside>

      <nav aria-label={c.tocLabel} className="lg:hidden">
        <details className="rounded-2xl border border-border bg-card p-3 shadow-sm">
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
