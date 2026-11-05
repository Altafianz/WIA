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
    <div className="space-y-6">
      {rules.map((rule) => (
        <article key={rule.id} className="rounded-lg border border-border p-4">
          <h3
            id={rule.id}
            tabIndex={-1}
            className="mb-2 text-base font-semibold text-text scroll-mt-24"
          >
            {c.ruleHeadingPattern
              .replace("{id}", rule.id)
              .replace("{name}", rule.name)}
          </h3>
          <p className="mb-2 text-sm text-text-muted">
            <span className="font-medium text-text">{c.formulaLabel}</span>{" "}
            {rule.formulaThreshold}
          </p>
          <p className="mb-2 text-sm text-text-muted">
            <span className="font-medium text-text">{c.exampleLabel}</span>{" "}
            {rule.exampleSentence}
          </p>
          <p className="mb-2 text-sm text-text-muted">
            <span className="font-medium text-text">{c.limitationLabel}</span>{" "}
            {rule.limitation}
          </p>
          <p className="text-sm text-text-muted">
            <span className="font-medium text-text">{c.severityLabel}</span>{" "}
            {severityLabel(rule.severity)}
          </p>
        </article>
      ))}
    </div>
  );
}
