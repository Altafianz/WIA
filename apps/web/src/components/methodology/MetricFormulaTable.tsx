import React from "react";
import type { MetricDefinition } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";

const c = copy.methodology;

interface MetricFormulaTableProps {
  metrics: MetricDefinition[];
}

export function MetricFormulaTable({ metrics }: MetricFormulaTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{c.metricsCaption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text">
              {c.colName}
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text">
              {c.colFormula}
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text">
              {c.colEdge}
            </th>
            <th scope="col" className="py-2 font-semibold text-text">
              {c.colExample}
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.id} className="border-b border-border align-top">
              <th scope="row" className="py-3 pr-4 font-medium text-text">
                {c.ruleHeadingPattern
                  .replace("{id}", metric.id)
                  .replace("{name}", metric.name)}
              </th>
              <td className="py-3 pr-4 text-text-muted">{metric.formula}</td>
              <td className="py-3 pr-4 text-text-muted">{metric.edgeCases}</td>
              <td className="py-3 text-text-muted">{metric.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
