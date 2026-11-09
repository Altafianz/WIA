import React from "react";
import { Link } from "react-router-dom";
import { Info, MessageSquareText, ShieldAlert } from "lucide-react";
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
    className: "border-brand-200 bg-brand-100 text-brand-900",
    Icon: ShieldAlert,
  },
  attention: {
    label: copy.dashboard.insightSeverityAttention,
    className: "border-brand-200 bg-brand-50 text-brand-800",
    Icon: Info,
  },
  info: {
    label: copy.dashboard.insightSeverityInfo,
    className: "border-border bg-card text-text-muted",
    Icon: Info,
  },
};

export function InsightPanel({ items, disclaimer, simple = false }: InsightPanelProps) {
  if (items.length === 0) return null;

  const panelCopy = getInsightPanelCopy(simple);

  return (
    <Card className="flex h-full flex-col bg-surface" padding="md">
      <div className="mb-4 flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-brand-700"
        >
          <MessageSquareText className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-text">
            {panelCopy.title}
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">
            {copy.dashboard.insightPanelDisclaimer}
          </p>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-3" aria-label={panelCopy.title}>
        {items.map((item) => {
          const cfg = severityConfig[item.severity];
          const displaySentence = simple
            ? item.simpleSentence || item.sentence
            : item.sentence;
          const Icon = cfg.Icon;

          return (
            <li
              key={item.ruleId}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    cfg.className,
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {cfg.label}
                </span>
                <Link
                  to={`/metodologi#${item.ruleId}`}
                  className="inline-flex min-h-[28px] items-center text-sm font-semibold text-brand-700 underline decoration-dotted underline-offset-4 transition-colors duration-150 hover:text-brand-800"
                  aria-label={`${copy.dashboard.insightMethodologyLink} ${item.ruleId}`}
                >
                  {item.ruleId}
                </Link>
              </div>
              <p className="text-sm leading-relaxed text-text">{displaySentence}</p>
              <p className="border-t border-border pt-2 text-sm italic leading-relaxed text-text-muted">
                {item.limitation}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 border-t border-border pt-3 text-sm italic leading-relaxed text-text-muted">
        {disclaimer}
      </p>
    </Card>
  );
}
