import { round1, type SectorSlice } from "@danaterbuka/shared";
import { copy } from "../content/copy.id.js";

export interface SectorCsvMeta {
  isFixture: boolean;
  totalPagu: number;
  totalRealisasi: number | null;
}

const c = copy.exportCsv;

function escapeCsvCell(value: string, guardFormula = false): string {
  let cell = value;

  if (guardFormula && /^[=+\-@]/.test(cell)) {
    cell = `'${cell}`;
  }

  if (/[",\r\n]/.test(cell)) {
    cell = `"${cell.replace(/"/g, '""')}"`;
  }

  return cell;
}

function formatPercentCell(value: number | null): string {
  return value === null ? "" : value.toFixed(1);
}

function totalPercent(meta: SectorCsvMeta): string {
  if (meta.totalRealisasi === null || meta.totalPagu <= 0) return "";
  return round1((meta.totalRealisasi / meta.totalPagu) * 100).toFixed(1);
}

export function buildCsvFilename(regionSlug: string, year: number): string {
  return `danaterbuka_${regionSlug}_${year}.csv`;
}

export function buildSectorCsv(
  slices: SectorSlice[],
  meta: SectorCsvMeta,
  simple = false,
): string {
  void simple;

  const status = meta.isFixture ? copy.dashboard.fixtureBadge : c.statusOfficial;
  const rows: string[][] = [
    [c.colSector, c.colPagu, c.colRealisasi, c.colRate, c.colStatus],
    ...slices.map((slice) => [
      escapeCsvCell(slice.name, true),
      String(slice.pagu),
      slice.realisasi === null ? "" : String(slice.realisasi),
      formatPercentCell(slice.realizationRate),
      escapeCsvCell(status, true),
    ]),
    [
      escapeCsvCell(c.total, true),
      String(meta.totalPagu),
      meta.totalRealisasi === null ? "" : String(meta.totalRealisasi),
      totalPercent(meta),
      escapeCsvCell(status, true),
    ],
  ];

  return `\uFEFF${rows.map((row) => row.join(",")).join("\r\n")}\r\n`;
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
