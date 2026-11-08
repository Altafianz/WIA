import React from "react";
import { Link } from "react-router-dom";
import { Insight } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { getInsightPanelCopy } from "../../lib/simple-text.js";
import { Card } from "../ui/Card.js";

interface InsightPanelProps {
  items: Insight[];
  disclaimer: string;
  simple?: boolean;
}

const severityConfig = {
  caution: {
    label: copy.dashboard.insightSeverityCaution,
    className: "bg-warning text-text-inverse",
  },
  attention: {
    label: copy.dashboard.insightSeverityAttention,
    className: "bg-info text-text-inverse",
  },
  info: {
    label: copy.dashboard.insightSeverityInfo,
    className: "bg-success text-text-inverse",
  },
};

export function InsightPanel({ items, disclaimer, simple = false }: InsightPanelProps) {
  if (items.length === 0) return null;

  const panelCopy = getInsightPanelCopy(simple);

  return (
    <Card className="flex h-full flex-col">
      <h2 className="type-h3 mb-4">
        {panelCopy.title}
      </h2>
      <ul className="space-y-4" aria-label={panelCopy.title}>
        {items.map((item) => {
          const cfg = severityConfig[item.severity];
          const displaySentence = simple
            ? item.simpleSentence || item.sentence
            : item.sentence;

          return (
            <li
              key={item.ruleId}
              className="space-y-2 rounded-xl border border-border bg-surface p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-sm font-semibold",
                    cfg.className,
                  ].join(" ")}
                >
                  {cfg.label}
                </span>
                <Link
                  to={`/metodologi#${item.ruleId}`}
                  className="text-sm text-brand-700 underline underline-offset-4 hover:text-brand-800"
                  aria-label={`${copy.dashboard.insightMethodologyLink} ${item.ruleId}`}
                >
                  {item.ruleId}
                </Link>
              </div>
              <p className="text-base leading-relaxed text-text">{displaySentence}</p>
              <p className="text-sm italic leading-relaxed text-text-muted">{item.limitation}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto border-t border-border pt-3 text-sm text-text-muted">
        {copy.dashboard.insightPanelDisclaimer}
      </p>
      <p className="mt-1 text-sm italic text-text-muted">{disclaimer}</p>
    </Card>
  );
}
