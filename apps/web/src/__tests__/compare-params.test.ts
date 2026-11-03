import { describe, expect, it } from "vitest";
import {
  buildCompareSearchParams,
  resolveCompareParams,
} from "../lib/compare-params.js";

const regions = [
  { slug: "provinsi-nusa-utara", hasData: true },
  { slug: "provinsi-selat-timur", hasData: true },
  { slug: "kabupaten-rimba-hulu", hasData: false },
];
const years = [2021, 2022, 2023, 2024, 2025];
const options = {
  regions,
  years,
  defaultRegion: "provinsi-nusa-utara",
  defaultYear: 2024,
};

describe("resolveCompareParams (EC-11)", () => {
  it("corrects b to another region when a === b", () => {
    const result = resolveCompareParams(
      {
        mode: "region",
        a: "provinsi-nusa-utara",
        b: "provinsi-nusa-utara",
        year: "2024",
        yearA: "2023",
        yearB: "2024",
      },
      options
    );

    expect(result.a).toBe("provinsi-nusa-utara");
    expect(result.b).toBe("provinsi-selat-timur");
    expect(result.regionCollision).toBe(true);
    expect(result.needsReplace).toBe(true);
  });

  it("picks a different default region when b is absent without a collision message", () => {
    const result = resolveCompareParams(
      { mode: "region", a: null, b: null, year: null, yearA: null, yearB: null },
      options
    );

    expect(result.a).toBe("provinsi-nusa-utara");
    expect(result.b).toBe("provinsi-selat-timur");
    expect(result.regionCollision).toBe(false);
    expect(result.needsReplace).toBe(true);
  });

  it("corrects yearB when both years are identical", () => {
    const result = resolveCompareParams(
      {
        mode: "year",
        a: "provinsi-nusa-utara",
        b: "provinsi-selat-timur",
        year: "2024",
        yearA: "2024",
        yearB: "2024",
      },
      options
    );

    expect(result.yearA).toBe(2024);
    expect(result.yearB).not.toBe(2024);
    expect(result.yearCollision).toBe(true);
    expect(result.needsReplace).toBe(true);
  });

  it("does not replace when all params are valid", () => {
    const result = resolveCompareParams(
      {
        mode: "region",
        a: "provinsi-nusa-utara",
        b: "provinsi-selat-timur",
        year: "2024",
        yearA: "2023",
        yearB: "2024",
      },
      options
    );

    expect(result.needsReplace).toBe(false);
    expect(result.regionCollision).toBe(false);
    expect(result.yearCollision).toBe(false);
  });

  it("serializes all six params for the URL", () => {
    const params = buildCompareSearchParams(
      resolveCompareParams(
        {
          mode: "region",
          a: "provinsi-nusa-utara",
          b: "provinsi-selat-timur",
          year: "2024",
          yearA: "2023",
          yearB: "2024",
        },
        options
      )
    );

    expect(params.get("mode")).toBe("region");
    expect(params.get("a")).toBe("provinsi-nusa-utara");
    expect(params.get("b")).toBe("provinsi-selat-timur");
    expect(params.get("year")).toBe("2024");
    expect(params.get("yearA")).toBe("2023");
    expect(params.get("yearB")).toBe("2024");
  });
});
