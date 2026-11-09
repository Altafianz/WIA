import React from "react";
import type { MetricDefinition } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";

const c = copy.methodology;

interface MetricFormulaTableProps {
  metrics: MetricDefinition[];
}

export function MetricFormulaTable({ metrics }: MetricFormulaTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <caption className="sr-only">{c.metricsCaption}</caption>
        <thead>
          <tr className="border-b border-border bg-surface">
            <th scope="col" className="px-4 py-3 font-semibold text-text">
              {c.colName}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-text">
              {c.colFormula}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-text">
              {c.colEdge}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-text">
              {c.colExample}
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr
              key={metric.id}
              className="border-b border-border align-top last:border-0 hover:bg-surface"
            >
              <th scope="row" className="px-4 py-3 font-medium text-text">
                {c.ruleHeadingPattern
                  .replace("{id}", metric.id)
                  .replace("{name}", metric.name)}
              </th>
              <td className="px-4 py-3 text-text-muted">{metric.formula}</td>
              <td className="px-4 py-3 text-text-muted">{metric.edgeCases}</td>
              <td className="px-4 py-3 text-text-muted">{metric.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
