import React from "react";
import { Insight } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { Card } from "../ui/Card.js";

interface InsightPanelProps {
  items: Insight[];
  disclaimer: string;
}

const severityConfig = {
  caution: { label: "Perlu Perhatian", className: "bg-warning text-text-inverse" },
  attention: { label: "Catatan", className: "bg-info text-text-inverse" },
  info: { label: "Info", className: "bg-success text-text-inverse" },
};

export function InsightPanel({ items, disclaimer }: InsightPanelProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <h2 className="text-base font-semibold text-text mb-4">
        {copy.dashboard.insightPanelTitle}
      </h2>
      <ul className="space-y-4" aria-label={copy.dashboard.insightPanelTitle}>
        {items.map((item) => {
          const cfg = severityConfig[item.severity];
          return (
            <li
              key={item.ruleId}
              className="rounded-md border border-border p-4 space-y-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={[
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    cfg.className,
                  ].join(" ")}
                >
                  {cfg.label}
                </span>
                <a
                  href={`/metodologi#${item.ruleId}`}
                  className="text-xs text-brand-600 underline hover:text-brand-700"
                  aria-label={`Detail metodologi ${item.ruleId}`}
                >
                  {item.ruleId}
                </a>
              </div>
              <p className="text-sm text-text">{item.sentence}</p>
              <p className="text-xs text-text-muted italic">{item.limitation}</p>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-text-muted mt-4 border-t border-border pt-3">
        {copy.dashboard.insightPanelDisclaimer}
      </p>
      <p className="text-xs text-text-muted mt-1 italic">{disclaimer}</p>
    </Card>
  );
}
