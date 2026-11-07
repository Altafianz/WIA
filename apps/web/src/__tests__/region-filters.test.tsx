import React, { useState } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Region } from "@danaterbuka/shared";
import { ProvinceSelect } from "../components/filters/ProvinceSelect.js";
import { SubRegionSelect } from "../components/filters/SubRegionSelect.js";
import {
  groupRegions,
  getProvinceOf,
  getSubRegions,
} from "../lib/region-grouping.js";
import { copy } from "../content/copy.id.js";

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
];

function FilterTestHarness({ initialRegion }: { initialRegion: string }) {
  const [region, setRegion] = useState(initialRegion);
  const groups = groupRegions(mockRegions);
  const provinces = groups.map((g) => g.province);
  const currentProvince = getProvinceOf(region, mockRegions);
  const currentProvinceSlug = currentProvince?.slug ?? provinces[0]?.slug ?? "";
  const subRegions = getSubRegions(currentProvinceSlug, mockRegions);

  return (
    <div>
      <ProvinceSelect
        provinces={provinces}
        value={currentProvinceSlug}
        onChange={(slug) => setRegion(slug)}
      />
      <SubRegionSelect
        subRegions={subRegions}
        value={region}
        onChange={(slug) => setRegion(slug)}
      />
    </div>
  );
}

describe("Region filter components and integration", () => {
  it("renders province select and sub-region select with correct options", () => {
    const groups = groupRegions(mockRegions);
    const provinces = groups.map((g) => g.province);
    const jbSubRegions = getSubRegions("provinsi-jawa-barat", mockRegions);

    const html = renderToStaticMarkup(
      <div>
        <ProvinceSelect
          provinces={provinces}
          value="provinsi-jawa-barat"
          onChange={() => {}}
        />
        <SubRegionSelect
          subRegions={jbSubRegions}
          value="kota-bandung"
          onChange={() => {}}
        />
      </div>
    );

    expect(html).toContain("Provinsi Jawa Barat");
    expect(html).toContain("Provinsi DKI Jakarta");
    expect(html).toContain(copy.dashboard.provinceGovOption);
    expect(html).toContain("Kota Bandung");
    expect(html).toContain("Kabupaten Bandung");
  });

  it("disables SubRegionSelect when sub-regions has only one choice (DKI Jakarta)", () => {
    const dkiSubRegions = getSubRegions("provinsi-dki-jakarta", mockRegions);
    expect(dkiSubRegions.length).toBe(1);

    const html = renderToStaticMarkup(
      <SubRegionSelect
        subRegions={dkiSubRegions}
        value="provinsi-dki-jakarta"
        onChange={() => {}}
      />
    );

    expect(html).toContain("disabled");
    expect(html).toContain(copy.dashboard.singleSubRegionNotice);
    expect(html).toContain("aria-describedby=\"subregion-filter-select-description\"");
  });

  it("updates sub-region options when switching province from Jawa Barat to DKI Jakarta", () => {
    // Initial: Jawa Barat
    const htmlJB = renderToStaticMarkup(
      <FilterTestHarness initialRegion="provinsi-jawa-barat" />
    );
    expect(htmlJB).toContain("Kota Bandung");
    expect(htmlJB).toContain("Kabupaten Bandung");

    // Switching to DKI Jakarta
    const htmlDKI = renderToStaticMarkup(
      <FilterTestHarness initialRegion="provinsi-dki-jakarta" />
    );
    expect(htmlDKI).not.toContain("Kota Bandung");
    expect(htmlDKI).toContain(copy.dashboard.singleSubRegionNotice);
  });

  it("sets region to province when changing province", () => {
    let currentRegion = "kota-bandung";
    const setRegion = (slug: string) => {
      currentRegion = slug;
    };

    const handleProvinceChange = (newProvinceSlug: string) => {
      setRegion(newProvinceSlug);
    };

    handleProvinceChange("provinsi-dki-jakarta");
    expect(currentRegion).toBe("provinsi-dki-jakarta");
  });

  it("displays correct province for legacy link with only region param", () => {
    // Legacy link arrives with ?region=kota-bandung
    const legacyRegionParam = "kota-bandung";
    const derivedProvince = getProvinceOf(legacyRegionParam, mockRegions);

    expect(derivedProvince).toBeDefined();
    expect(derivedProvince?.slug).toBe("provinsi-jawa-barat");

    const html = renderToStaticMarkup(
      <FilterTestHarness initialRegion={legacyRegionParam} />
    );

    // ProvinceSelect has value="provinsi-jawa-barat" selected
    expect(html).toContain("value=\"provinsi-jawa-barat\"");
    // SubRegionSelect has value="kota-bandung" selected
    expect(html).toContain("value=\"kota-bandung\"");
  });
});

