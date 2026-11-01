import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendPoint } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact } from "../../lib/format.js";
import { ChartWrapper } from "../ui/ChartWrapper.js";
import { ChartSkeleton } from "../states/LoadingSkeleton.js";

interface TrendChartProps {
  points?: TrendPoint[];
  simple?: boolean;
  state: "loading" | "empty" | "error" | "data";
}

export function TrendChart({ points = [], state }: TrendChartProps) {
  if (state === "loading") {
    return <ChartSkeleton />;
  }

  if (state === "empty" || state === "error" || points.length === 0) {
    return null;
  }

  const chartData = points.map((p) => ({
    year: p.fiscalYear.toString(),
    pagu: p.pagu,
    realisasi: p.realisasi,
    periodStatus: p.periodStatus,
  }));

  const tableContent = (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <caption className="sr-only">{copy.dashboard.trendChartTitle}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted">Tahun</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted text-right">Pagu</th>
            <th scope="col" className="py-2 font-semibold text-text-muted text-right">Realisasi</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.fiscalYear} className="border-b border-border hover:bg-surface">
              <td className="py-2 pr-4 text-text font-medium">{p.fiscalYear}</td>
              <td className="py-2 pr-4 text-right text-text tabular-nums">{formatRupiahCompact(p.pagu)}</td>
              <td className="py-2 text-right text-text tabular-nums">
                {p.realisasi !== null ? formatRupiahCompact(p.realisasi) : copy.dashboard.realizationNotReleased}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ChartWrapper
      title={copy.dashboard.trendChartTitle}
      description={copy.dashboard.trendChartDescription}
      ariaLabel={copy.a11y.trendChartLabel}
      tableContent={tableContent}
      data-testid="trend-chart"
    >
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="year"
              stroke="var(--color-text-muted)"
              fontSize={12}
            />
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(v) => formatRupiahCompact(v)}
              stroke="var(--color-text-muted)"
              fontSize={12}
            />
            <RechartsTooltip
              formatter={(val: unknown, name: unknown) => {
                if (val === null || val === undefined) return [copy.dashboard.realizationNotReleased, String(name)];
                return [formatRupiahCompact(Number(val)), String(name)];
              }}
              contentStyle={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-md)",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="pagu"
              name={copy.dashboard.summaryPagu}
              stroke="var(--color-brand-600)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="realisasi"
              name={copy.dashboard.summaryRealisasi}
              stroke="var(--color-info)"
              strokeWidth={2}
              connectNulls={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
