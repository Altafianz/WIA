import { describe, expect, it } from "vitest";
import {
  aggregateRows,
  mergeYear,
  normalizeRegionCode,
  normalizeRegionName,
  parseSectorId,
  slugify,
} from "../lib/transform.js";

describe("normalisasi sumber DJPK", () => {
  it("memetakan kode pemda ke format 2 digit", () => {
    expect(normalizeRegionCode("10.00")).toBe("10.00");
    expect(normalizeRegionCode("10")).toBe("10.00");
    expect(normalizeRegionCode(10)).toBe("10.00");
    expect(normalizeRegionCode("bukan-kode")).toBeNull();
  });

  it("menormalkan nama wilayah", () => {
    expect(normalizeRegionName("Kab. Bandung")).toBe("Kabupaten Bandung");
    expect(normalizeRegionName("Kota Bandung")).toBe("Kota Bandung");
    expect(normalizeRegionName("Propinsi Jawa Barat")).toBe("Provinsi Jawa Barat");
    expect(slugify("Kabupaten Bandung Barat")).toBe("kabupaten-bandung-barat");
  });

  it("mengambil fungsi dan membuang kata Tagging", () => {
    expect(parseSectorId("01. Pelayanan Umum")).toBe("F01");
    expect(parseSectorId("07. Kesehatan Tagging")).toBe("F07");
    expect(parseSectorId("10. Pendidikan Tagging")).toBe("F10");
    expect(parseSectorId("02. Pertahanan")).toBeNull();
    expect(parseSectorId("")).toBeNull();
  });
});

describe("penggabungan anggaran dan realisasi", () => {
  it("mengisi 0 pada sisi yang tidak muncul dan mencatat ASSUMED_ZERO", () => {
    const budget = aggregateRows([
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F01", value: 100 },
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F03", value: 200 },
    ]);
    const realization = aggregateRows([
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F01", value: 80 },
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F04", value: 50 },
    ]);

    const merged = mergeYear(2024, budget, realization);

    expect(merged.records).toHaveLength(3);
    expect(merged.records).toContainEqual({
      regionCode: "10.00",
      sectorId: "F01",
      fiscalYear: 2024,
      pagu: 100,
      realisasi: 80,
      periodStatus: "final",
    });
    expect(merged.records).toContainEqual({
      regionCode: "10.00",
      sectorId: "F03",
      fiscalYear: 2024,
      pagu: 200,
      realisasi: 0,
      periodStatus: "final",
    });
    expect(merged.records).toContainEqual({
      regionCode: "10.00",
      sectorId: "F04",
      fiscalYear: 2024,
      pagu: 0,
      realisasi: 50,
      periodStatus: "final",
    });
    expect(merged.issues.filter((issue) => issue.code === "ASSUMED_ZERO")).toHaveLength(2);
    expect(merged.rejected).toBe(0);
  });

  it("memakai realisasi null untuk wilayah yang belum punya berkas realisasi", () => {
    const budget = aggregateRows([
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F01", value: 100 },
    ]);
    const merged = mergeYear(2026, budget, null);

    expect(merged.records[0]?.realisasi).toBeNull();
    expect(merged.records[0]?.periodStatus).toBe("approved");
  });

  it("tidak mengubah realisasi negatif menjadi nol", () => {
    const budget = aggregateRows([
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F01", value: 100 },
    ]);
    const realization = aggregateRows([
      { regionCode: "10.00", regionName: "Provinsi Jawa Barat", sectorId: "F01", value: -5 },
    ]);
    const merged = mergeYear(2024, budget, realization);

    expect(merged.records[0]?.realisasi).toBeNull();
    expect(merged.issues.some((issue) => issue.code === "NEGATIVE_REALISASI")).toBe(true);
  });
});
