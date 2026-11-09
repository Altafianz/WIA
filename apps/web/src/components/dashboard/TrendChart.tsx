import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { TrendPoint, findGlossaryEntry } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact, formatRupiahFull } from "../../lib/format.js";
import { getTrendChartCopy, getDataTableCopy } from "../../lib/simple-text.js";
import { ChartWrapper } from "../ui/ChartWrapper.js";
import { TermTooltip } from "../ui/Tooltip.js";
import { ChartSkeleton } from "../states/LoadingSkeleton.js";

interface TrendChartProps {
  points?: TrendPoint[];
  simple?: boolean;
  state: "loading" | "empty" | "error" | "data";
}

interface DiamondDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
}

/** Diamond marker keeps the two series distinct in black-and-white prints. */
function DiamondDot({ cx = 0, cy = 0, stroke = "var(--color-sector-1)" }: DiamondDotProps) {
  return (
    <polygon
      points={`${cx},${cy - 4.5} ${cx + 4.5},${cy} ${cx},${cy + 4.5} ${cx - 4.5},${cy}`}
      fill="var(--color-card)"
      stroke={stroke}
      strokeWidth={2}
    />
  );
}

function formatAxisRupiah(value: number): string {
  return formatRupiahCompact(value)
    .replace(/^Rp\s*/, "")
    .replace(",0 ", " ");
}

function formatYearList(years: number[]): string {
  if (years.length <= 1) return years.join("");
  return `${years.slice(0, -1).join(", ")} dan ${years[years.length - 1]}`;
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
    <TermTooltip term={trendCopy.title} definition={apbdDef} variant="plain" />
  );

  const seriesPagu = simple
    ? copy.dashboard.chartSeriesPaguSimple
    : copy.dashboard.chartSeriesPagu;
  const seriesRealisasi = simple
    ? copy.dashboard.chartSeriesRealisasiSimple
    : copy.dashboard.chartSeriesRealisasi;

  const chartData = points.map((p) => ({
    year: p.fiscalYear.toString(),
    pagu: p.pagu,
    realisasi: p.realisasi,
    periodStatus: p.periodStatus,
  }));

  const paguOnlyYears = points
    .filter((p) => p.realisasi === null)
    .map((p) => p.fiscalYear);
  const lastRealizationYear = [...points]
    .reverse()
    .find((p) => p.realisasi !== null)?.fiscalYear;
  const showRealizationNote =
    lastRealizationYear !== undefined &&
    paguOnlyYears.some((year) => year > lastRealizationYear);

  const realizationNote =
    showRealizationNote && lastRealizationYear !== undefined
      ? (simple
          ? copy.dashboard.realizationStopsNoteSimple
          : copy.dashboard.realizationStopsNote)
          .replace("{lastYear}", String(lastRealizationYear))
          .replace("{years}", formatYearList(paguOnlyYears))
      : null;

  const tableContent = (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{trendCopy.title}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted">
              {simple ? (
                tableCopy.yearHeader
              ) : (
                <TermTooltip term={tableCopy.yearHeader} definition={yearDef} />
              )}
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-semibold text-text-muted">
              {simple ? (
                tableCopy.paguHeader
              ) : (
                <TermTooltip term={tableCopy.paguHeader} definition={paguDef} />
              )}
            </th>
            <th scope="col" className="py-2 text-right font-semibold text-text-muted">
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
              <td className="py-2 pr-4 font-medium text-text">{p.fiscalYear}</td>
              <td className="py-2 pr-4 text-right text-text tabular-nums">
                {formatRupiahCompact(p.pagu)}
              </td>
              <td className="py-2 text-right text-text tabular-nums">
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
            margin={{ top: 10, right: 20, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="var(--color-border-strong)"
              tick={{ fill: "var(--color-text-muted)", fontSize: 14 }}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickMargin={8}
            />
            <YAxis
              domain={[0, "auto"]}
              width={92}
              tickFormatter={formatAxisRupiah}
              stroke="var(--color-border-strong)"
              tick={{ fill: "var(--color-text-muted)", fontSize: 14 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <RechartsTooltip
              wrapperStyle={{ outline: "none" }}
              labelFormatter={(label) => `${tableCopy.yearHeader} ${label}`}
              formatter={(val: unknown, name: unknown) => {
                if (val === null || val === undefined) {
                  return [copy.dashboard.realizationNotReleased, String(name)];
                }
                return [formatRupiahFull(Number(val)), String(name)];
              }}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-md)",
                fontSize: 14,
                color: "var(--color-text)",
              }}
            />
            <Line
              type="monotone"
              dataKey="pagu"
              name={seriesPagu}
              stroke="var(--color-sector-3)"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "var(--color-card)",
                stroke: "var(--color-sector-3)",
                strokeWidth: 2.5,
              }}
              activeDot={{ r: 6, fill: "var(--color-sector-3)", stroke: "var(--color-card)" }}
            />
            <Line
              type="monotone"
              dataKey="realisasi"
              name={seriesRealisasi}
              stroke="var(--color-sector-1)"
              strokeWidth={2.5}
              strokeDasharray="7 5"
              connectNulls={false}
              dot={<DiamondDot />}
              activeDot={<DiamondDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend: line style + marker shape, not colour alone */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text">
        <span className="inline-flex items-center gap-2">
          <svg width="28" height="10" aria-hidden="true">
            <line
              x1="0"
              y1="5"
              x2="28"
              y2="5"
              stroke="var(--color-sector-3)"
              strokeWidth="2.5"
            />
            <circle
              cx="14"
              cy="5"
              r="3.5"
              fill="var(--color-card)"
              stroke="var(--color-sector-3)"
              strokeWidth="2.5"
            />
          </svg>
          {seriesPagu}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="28" height="10" aria-hidden="true">
            <line
              x1="0"
              y1="5"
              x2="28"
              y2="5"
              stroke="var(--color-sector-1)"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            <polygon
              points="14,1 18,5 14,9 10,5"
              fill="var(--color-card)"
              stroke="var(--color-sector-1)"
              strokeWidth="2"
            />
          </svg>
          {seriesRealisasi}
        </span>
      </div>

      <p className="mt-2 text-xs text-text-muted">
        {copy.dashboard.trendAxisUnitNote}
      </p>

      {realizationNote && (
        <p className="mt-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          {realizationNote}
        </p>
      )}
    </ChartWrapper>
  );
}
