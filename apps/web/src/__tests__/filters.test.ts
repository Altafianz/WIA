import { describe, expect, it } from "vitest";
import { resolveFilters } from "../lib/filters.js";

const validYears = [2021, 2022, 2023, 2024, 2025];
const validRegionSlugs = [
  "provinsi-nusa-utara",
  "provinsi-selat-timur",
  "kota-bahari",
];

describe("resolveFilters (FR-022)", () => {
  it("uses defaults without correction when params are absent", () => {
    const result = resolveFilters(
      { region: null, year: null, sector: null },
      { validYears, validRegionSlugs }
    );

    expect(result).toEqual({
      region: "provinsi-nusa-utara",
      year: 2024,
      sector: "all",
      regionCorrected: false,
      yearCorrected: false,
    });
  });

  it("keeps valid params untouched", () => {
    const result = resolveFilters(
      { region: "kota-bahari", year: "2023", sector: "F07" },
      { validYears, validRegionSlugs }
    );

    expect(result.region).toBe("kota-bahari");
    expect(result.year).toBe(2023);
    expect(result.sector).toBe("F07");
    expect(result.regionCorrected).toBe(false);
    expect(result.yearCorrected).toBe(false);
  });

  it("corrects an unknown region to the default", () => {
    const result = resolveFilters(
      { region: "provinsi-tidak-ada", year: "2024", sector: null },
      { validYears, validRegionSlugs }
    );

    expect(result.region).toBe("provinsi-nusa-utara");
    expect(result.regionCorrected).toBe(true);
    expect(result.yearCorrected).toBe(false);
  });

  it("corrects a non-numeric year to the default", () => {
    const result = resolveFilters(
      { region: "provinsi-nusa-utara", year: "abc", sector: null },
      { validYears, validRegionSlugs }
    );

    expect(result.year).toBe(2024);
    expect(result.yearCorrected).toBe(true);
    expect(result.regionCorrected).toBe(false);
  });

  it("corrects a year outside the available range", () => {
    const result = resolveFilters(
      { region: null, year: "2019", sector: null },
      { validYears: [2023, 2024], validRegionSlugs, defaultYear: 2024 }
    );

    expect(result.year).toBe(2024);
    expect(result.yearCorrected).toBe(true);
  });
});
