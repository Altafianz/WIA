import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { SectorSlice, findGlossaryEntry } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact } from "../../lib/format.js";
import { getSectorChartCopy } from "../../lib/simple-text.js";
import { ChartWrapper } from "../ui/ChartWrapper.js";
import { DataTable } from "../common/DataTable.js";
import { TermTooltip } from "../ui/Tooltip.js";
import { ChartSkeleton } from "../states/LoadingSkeleton.js";

interface SectorChartProps {
  slices?: SectorSlice[];
  totalPagu?: number;
  simple?: boolean;
  state: "loading" | "empty" | "error" | "data";
  selectedSector?: string;
}

interface CategoryTickProps {
  x?: number;
  y?: number;
  payload?: { value?: string | number };
}

/** Wrap long sector names onto up to three lines so every label is visible. */
function wrapLabel(label: string, maxChars = 24): string[] {
  const words = label.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || current === "") {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [label];
}

function WrappedCategoryTick({ x = 0, y = 0, payload }: CategoryTickProps) {
  const label = String(payload?.value ?? "");
  const lines = wrapLabel(label);
  const firstLineOffset = -((lines.length - 1) * 8);

  return (
    <text
      x={x}
      y={y}
      dy={firstLineOffset}
      textAnchor="end"
      fill="var(--color-text)"
      fontSize={14}
    >
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : 16}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function SectorChart({
  slices = [],
  state,
  simple = false,
  selectedSector,
}: SectorChartProps) {
  if (state === "loading") {
    return <ChartSkeleton />;
  }

  if (state === "empty" || state === "error" || slices.length === 0) {
    return null;
  }

  const chartCopy = getSectorChartCopy(simple);
  const alokasiDef = findGlossaryEntry("Alokasi")?.simpleDefinition ?? "";

  const chartTitle = simple ? (
    <span>{chartCopy.title}</span>
  ) : (
    <TermTooltip term={chartCopy.title} definition={alokasiDef} variant="plain" />
  );

  const seriesPagu = simple
    ? copy.dashboard.chartSeriesPaguSimple
    : copy.dashboard.chartSeriesPagu;
  const seriesRealisasi = simple
    ? copy.dashboard.chartSeriesRealisasiSimple
    : copy.dashboard.chartSeriesRealisasi;

  const chartData = slices.map((s) => ({
    sectorId: s.sectorId,
    name: s.name,
    pagu: s.pagu,
    realisasi: s.realisasi,
    share: s.share,
  }));

  const tableContent = (
    <DataTable slices={slices} caption={chartCopy.title} simple={simple} />
  );

  const chartHeight = Math.max(320, chartData.length * 64);
  const hasSectorSelection = Boolean(selectedSector && selectedSector !== "all");
  const opacityFor = (sectorId: string) =>
    hasSectorSelection && selectedSector !== sectorId ? 0.45 : 1;

  return (
    <ChartWrapper
      title={chartTitle}
      description={chartCopy.description}
      ariaLabel={copy.a11y.sectorChartLabel}
      tableContent={tableContent}
      data-testid="sector-chart"
    >
      <div className="w-full pt-2" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            barGap={2}
            barCategoryGap="24%"
            margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          >
            <defs>
              <pattern
                id="sector-realisasi-stripes"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill="var(--color-sector-1)" />
                <rect width="2" height="6" fill="var(--color-card)" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tickFormatter={(v: number) =>
                formatRupiahCompact(v).replace(",0 ", " ")
              }
              stroke="var(--color-border-strong)"
              tick={{ fill: "var(--color-text-muted)", fontSize: 14 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={196}
              interval={0}
              tick={<WrappedCategoryTick />}
              tickLine={false}
              axisLine={false}
            />
            <RechartsTooltip
              cursor={{ fill: "var(--color-surface)" }}
              wrapperStyle={{ outline: "none" }}
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
                color: "var(--color-text)",
              }}
            />
            <Bar
              dataKey="pagu"
              name={seriesPagu}
              fill="var(--color-sector-3)"
              radius={[0, 4, 4, 0]}
              minPointSize={(value: number | null | undefined) =>
                typeof value === "number" && value > 0 ? 3 : 0
              }
            >
              {chartData.map((entry) => (
                <Cell
                  key={`pagu-${entry.sectorId}`}
                  fill="var(--color-sector-3)"
                  fillOpacity={opacityFor(entry.sectorId)}
                />
              ))}
            </Bar>
            <Bar
              dataKey="realisasi"
              name={seriesRealisasi}
              fill="url(#sector-realisasi-stripes)"
              radius={[0, 4, 4, 0]}
              minPointSize={(value: number | null | undefined) =>
                typeof value === "number" && value > 0 ? 3 : 0
              }
            >
              {chartData.map((entry) => (
                <Cell
                  key={`realisasi-${entry.sectorId}`}
                  fill="url(#sector-realisasi-stripes)"
                  fillOpacity={opacityFor(entry.sectorId)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-6 rounded-sm bg-sector-3"
          />
          {seriesPagu}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="swatch-realisasi h-3 w-6 rounded-sm"
          />
          {seriesRealisasi}
        </span>
      </div>
    </ChartWrapper>
  );
}
