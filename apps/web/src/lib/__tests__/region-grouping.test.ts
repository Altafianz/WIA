import { describe, expect, it } from "vitest";
import { Region } from "@danaterbuka/shared";
import {
  groupRegions,
  getProvinceOf,
  getSubRegions,
} from "../region-grouping.js";

const mockRegions: Region[] = [
  {
    regionId: "ID-JB",
    slug: "provinsi-jawa-barat",
    name: "Provinsi Jawa Barat",
    level: "province",
    parentRegionId: null,
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-DKI",
    slug: "provinsi-dki-jakarta",
    name: "Provinsi DKI Jakarta",
    level: "province",
    parentRegionId: null,
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-JT",
    slug: "provinsi-jawa-tengah",
    name: "Provinsi Jawa Tengah",
    level: "province",
    parentRegionId: null,
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-JB-01",
    slug: "kota-bandung",
    name: "Kota Bandung",
    level: "city",
    parentRegionId: "ID-JB",
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-JB-02",
    slug: "kabupaten-bandung",
    name: "Kabupaten Bandung",
    level: "regency",
    parentRegionId: "ID-JB",
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-JB-03",
    slug: "kota-bekasi",
    name: "Kota Bekasi",
    level: "city",
    parentRegionId: "ID-JB",
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-JT-01",
    slug: "kota-semarang",
    name: "Kota Semarang",
    level: "city",
    parentRegionId: "ID-JT",
    hasData: true,
    isFixture: false,
  },
  {
    regionId: "ID-ORPHAN",
    slug: "kota-tanpa-induk",
    name: "Kota Tanpa Induk",
    level: "city",
    parentRegionId: "ID-UNKNOWN",
    hasData: true,
    isFixture: true,
  },
];

describe("region-grouping logic", () => {
  it("groups regions by province, sorts provinces alphabetically", () => {
    const groups = groupRegions(mockRegions);

    // Provinces sorted alphabetically:
    // Lainnya (orphan), Provinsi DKI Jakarta, Provinsi Jawa Barat, Provinsi Jawa Tengah
    const provinceNames = groups.map((g) => g.province.name);
    expect(provinceNames).toEqual([
      "Lainnya",
      "Provinsi DKI Jakarta",
      "Provinsi Jawa Barat",
      "Provinsi Jawa Tengah",
    ]);
  });

  it("sorts subregions: province itself first, then cities/regencies alphabetically", () => {
    const groups = groupRegions(mockRegions);
    const jbGroup = groups.find((g) => g.province.slug === "provinsi-jawa-barat");
    expect(jbGroup).toBeDefined();

    const subSlugs = jbGroup!.subRegions.map((r) => r.slug);
    expect(subSlugs).toEqual([
      "provinsi-jawa-barat", // first: province itself
      "kabupaten-bandung",
      "kota-bandung",
      "kota-bekasi",
    ]);
  });

  it("handles a province with no subregions (e.g. DKI Jakarta) with only itself in subregions", () => {
    const groups = groupRegions(mockRegions);
    const dkiGroup = groups.find((g) => g.province.slug === "provinsi-dki-jakarta");
    expect(dkiGroup).toBeDefined();
    expect(dkiGroup!.subRegions.map((r) => r.slug)).toEqual(["provinsi-dki-jakarta"]);
  });

  it("places orphan regions in 'Lainnya' group", () => {
    const groups = groupRegions(mockRegions);
    const otherGroup = groups.find((g) => g.province.slug === "lainnya");
    expect(otherGroup).toBeDefined();
    expect(otherGroup!.subRegions.map((r) => r.slug)).toEqual(["kota-tanpa-induk"]);
  });

  it("getProvinceOf returns correct province for province, city, and orphan slugs", () => {
    groupRegions(mockRegions);

    expect(getProvinceOf("provinsi-jawa-barat", mockRegions)?.slug).toBe("provinsi-jawa-barat");
    expect(getProvinceOf("kota-bandung", mockRegions)?.slug).toBe("provinsi-jawa-barat");
    expect(getProvinceOf("kabupaten-bandung", mockRegions)?.slug).toBe("provinsi-jawa-barat");
    expect(getProvinceOf("kota-semarang", mockRegions)?.slug).toBe("provinsi-jawa-tengah");
    expect(getProvinceOf("provinsi-dki-jakarta", mockRegions)?.slug).toBe("provinsi-dki-jakarta");
    expect(getProvinceOf("kota-tanpa-induk", mockRegions)?.slug).toBe("lainnya");
    expect(getProvinceOf("slug-tidak-dikenal", mockRegions)).toBeNull();
  });

  it("getSubRegions returns subregions list including province first", () => {
    const jbSubs = getSubRegions("provinsi-jawa-barat", mockRegions);
    expect(jbSubs[0].slug).toBe("provinsi-jawa-barat");
    expect(jbSubs.length).toBe(4);

    const dkiSubs = getSubRegions("provinsi-dki-jakarta", mockRegions);
    expect(dkiSubs.length).toBe(1);
    expect(dkiSubs[0].slug).toBe("provinsi-dki-jakarta");

    const nonExistent = getSubRegions("unknown-province", mockRegions);
    expect(nonExistent).toEqual([]);
  });
});

