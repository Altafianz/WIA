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
import { TrendPoint, findGlossaryEntry } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact } from "../../lib/format.js";
import { getTrendChartCopy, getDataTableCopy } from "../../lib/simple-text.js";
import { ChartWrapper } from "../ui/ChartWrapper.js";
import { TermTooltip } from "../ui/Tooltip.js";
import { ChartSkeleton } from "../states/LoadingSkeleton.js";

interface TrendChartProps {
  points?: TrendPoint[];
  simple?: boolean;
  state: "loading" | "empty" | "error" | "data";
}

export function TrendChart({ points = [], state, simple = false }: TrendChartProps) {
  if (state === "loading") {
    return <ChartSkeleton />;
  }

  if (state === "empty" || state === "error" || points.length === 0) {
    return null;
  }

  const trendCopy = getTrendChartCopy(simple);
  const tableCopy = getDataTableCopy(simple);

  const apbdDef = findGlossaryEntry("APBD")?.simpleDefinition ?? "";
  const yearDef = findGlossaryEntry("Tahun fiskal")?.simpleDefinition ?? "";
  const paguDef = findGlossaryEntry("Pagu")?.simpleDefinition ?? "";
  const realisasiDef = findGlossaryEntry("Realisasi")?.simpleDefinition ?? "";

  const chartTitle = simple ? (
    <span>{trendCopy.title}</span>
  ) : (
    <TermTooltip term={trendCopy.title} definition={apbdDef} />
  );

  const chartData = points.map((p) => ({
    year: p.fiscalYear.toString(),
    pagu: p.pagu,
    realisasi: p.realisasi,
    periodStatus: p.periodStatus,
  }));

  const tableContent = (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{trendCopy.title}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2.5 pr-4 font-semibold text-text-muted">
              {simple ? (
                tableCopy.yearHeader
              ) : (
                <TermTooltip term={tableCopy.yearHeader} definition={yearDef} />
              )}
            </th>
            <th scope="col" className="py-2.5 pr-4 text-right font-semibold text-text-muted">
              {simple ? (
                tableCopy.paguHeader
              ) : (
                <TermTooltip term={tableCopy.paguHeader} definition={paguDef} />
              )}
            </th>
            <th scope="col" className="py-2.5 text-right font-semibold text-text-muted">
              {simple ? (
                tableCopy.realisasiHeader
              ) : (
                <TermTooltip term={tableCopy.realisasiHeader} definition={realisasiDef} />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.fiscalYear} className="border-b border-border last:border-0 hover:bg-surface">
              <td className="py-2.5 pr-4 font-medium tabular-nums text-text">{p.fiscalYear}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-text">
                {formatRupiahCompact(p.pagu)}
              </td>
              <td className="py-2.5 text-right tabular-nums text-text">
                {p.realisasi !== null
                  ? formatRupiahCompact(p.realisasi)
                  : copy.dashboard.realizationNotReleased}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const axisTick = {
    fontSize: 14,
    fill: "var(--color-text-muted)",
    fontFamily: "var(--font-sans)",
  };

  return (
    <ChartWrapper
      title={chartTitle}
      description={trendCopy.description}
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
            <CartesianGrid
              vertical={false}
              stroke="var(--color-chart-grid)"
            />
            <XAxis
              dataKey="year"
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: "var(--color-chart-grid)" }}
            />
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(v) => formatRupiahCompact(v)}
              tick={axisTick}
              tickLine={false}
              axisLine={false}
            />
            <RechartsTooltip
              formatter={(val: unknown, name: unknown) => {
                if (val === null || val === undefined) {
                  return [copy.dashboard.realizationNotReleased, String(name)];
                }
                return [formatRupiahCompact(Number(val)), String(name)];
              }}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-md)",
                fontSize: 14,
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 12, fontSize: 14 }}
              formatter={(value: string) => {
                if (value === "pagu") return tableCopy.paguHeader;
                if (value === "realisasi") return tableCopy.realisasiHeader;
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="pagu"
              name={tableCopy.paguHeader}
              stroke="var(--color-sector-2)"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="realisasi"
              name={tableCopy.realisasiHeader}
              stroke="var(--color-sector-6)"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              connectNulls={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
