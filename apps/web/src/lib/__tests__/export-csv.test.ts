import { describe, expect, it } from "vitest";
import type { SectorSlice } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import {
  buildCsvFilename,
  buildSectorCsv,
} from "../export-csv.js";

function slice(
  sectorId: string,
  name: string,
  pagu: number,
  realisasi: number | null,
  realizationRate: number | null,
): SectorSlice {
  return {
    sectorId,
    name,
    pagu,
    realisasi,
    realizationRate,
    share: null,
    isAggregate: false,
  };
}

const slices: SectorSlice[] = [
  slice("F01", 'Kesehatan, "Umum"', 1000, null, null),
  slice("F02", "=Pendidikan", 2000, 1500, 75.0),
  slice("F03", "+Infrastruktur", 500, 250, 50.0),
  slice("F04", "-Kesehatan", 500, 250, 50.0),
  slice("F05", "@Lainnya", 500, 250, 50.0),
];

describe("buildSectorCsv (FR-060)", () => {
  const csv = buildSectorCsv(slices, {
    isFixture: true,
    totalPagu: 5000,
    totalRealisasi: 2500,
  });
  const content = csv.slice(1);
  const lines = content.split("\r\n");

  it("starts with a UTF-8 BOM and uses CRLF line endings", () => {
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(content).toContain("\r\n");
  });

  it("writes the Indonesian header from copy", () => {
    expect(lines[0]).toBe(
      [
        copy.exportCsv.colSector,
        copy.exportCsv.colPagu,
        copy.exportCsv.colRealisasi,
        copy.exportCsv.colRate,
        copy.exportCsv.colStatus,
      ].join(","),
    );
  });

  it("escapes commas and quotes per RFC 4180", () => {
    expect(lines[1]).toBe('"Kesehatan, ""Umum""",1000,,,Data contoh');
  });

  it("leaves null realization and rate cells empty instead of zero", () => {
    expect(lines[1]).toContain("1000,,,");
  });

  it("labels fixture data and writes the summary total row", () => {
    expect(lines[2]).toContain(copy.dashboard.fixtureBadge);
    expect(lines[6]).toBe("Total,5000,2500,50.0,Data contoh");
  });

  it("prefixes formula-like text cells with an apostrophe", () => {
    expect(lines[2]).toBe("'=Pendidikan,2000,1500,75.0,Data contoh");
    expect(lines[3].startsWith("'+Infrastruktur,")).toBe(true);
    expect(lines[4].startsWith("'-Kesehatan,")).toBe(true);
    expect(lines[5].startsWith("'@Lainnya,")).toBe(true);
  });

  it("uses Resmi when the source is not a fixture", () => {
    const official = buildSectorCsv([], {
      isFixture: false,
      totalPagu: 1000,
      totalRealisasi: null,
    });

    expect(official).toContain("Total,1000,,,");
    expect(official).toContain(",Resmi\r\n");
  });

  it("builds the download filename from region slug and year", () => {
    expect(buildCsvFilename("provinsi-nusa-utara", 2024)).toBe(
      "danaterbuka_provinsi-nusa-utara_2024.csv",
    );
  });
});
