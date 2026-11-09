import React from "react";
import type { InsightRuleMeta } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";

const c = copy.methodology;

interface InsightRuleListProps {
  rules: InsightRuleMeta[];
}

function severityLabel(severity: InsightRuleMeta["severity"]): string {
  switch (severity) {
    case "caution":
      return c.severityCaution;
    case "attention":
      return c.severityAttention;
    default:
      return c.severityInfo;
  }
}

export function InsightRuleList({ rules }: InsightRuleListProps) {
  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <article
          key={rule.id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3
            id={rule.id}
            tabIndex={-1}
            className="mb-3 text-lg font-bold tracking-tight text-text scroll-mt-24"
          >
            {c.ruleHeadingPattern
              .replace("{id}", rule.id)
              .replace("{name}", rule.name)}
          </h3>
          <div className="space-y-2 text-sm text-text-muted">
            <p>
              <span className="font-semibold text-text">{c.formulaLabel}</span>{" "}
              {rule.formulaThreshold}
            </p>
            <p>
              <span className="font-semibold text-text">{c.exampleLabel}</span>{" "}
              {rule.exampleSentence}
            </p>
            <p>
              <span className="font-semibold text-text">{c.limitationLabel}</span>{" "}
              {rule.limitation}
            </p>
            <p>
              <span className="font-semibold text-text">{c.severityLabel}</span>{" "}
              {severityLabel(rule.severity)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
