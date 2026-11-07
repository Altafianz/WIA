import { Region } from "@danaterbuka/shared";
import { copy } from "../content/copy.id.js";

export interface ProvinceGroup {
  province: Region;
  subRegions: Region[];
}

let cachedRegions: Region[] = [];

/**
 * Groups regions by province (level === "province").
 * Province order: alphabetical by name.
 * Sub-region order: province itself first, then cities/regencies alphabetically.
 * Regions without a valid parent are placed in the "Lainnya" group.
 */
export function groupRegions(regions: Region[]): ProvinceGroup[] {
  cachedRegions = regions;
  if (!regions || regions.length === 0) return [];

  const provinces = regions.filter((r) => r.level === "province");
  const provinceById = new Map<string, Region>();
  provinces.forEach((p) => provinceById.set(p.regionId, p));

  const subRegionsByProvinceId = new Map<string, Region[]>();
  provinces.forEach((p) => {
    subRegionsByProvinceId.set(p.regionId, [p]);
  });

  const orphanRegions: Region[] = [];

  for (const r of regions) {
    if (r.level === "province") {
      continue;
    }
    if (r.parentRegionId && provinceById.has(r.parentRegionId)) {
      subRegionsByProvinceId.get(r.parentRegionId)!.push(r);
    } else {
      orphanRegions.push(r);
    }
  }

  const groups: ProvinceGroup[] = provinces.map((province) => {
    const list = subRegionsByProvinceId.get(province.regionId) ?? [province];
    const self = list[0];
    const others = list
      .slice(1)
      .sort((a, b) => a.name.localeCompare(b.name, "id"));
    return {
      province,
      subRegions: [self, ...others],
    };
  });

  if (orphanRegions.length > 0) {
    orphanRegions.sort((a, b) => a.name.localeCompare(b.name, "id"));
    const otherProvince: Region = {
      regionId: "OTHER",
      slug: "lainnya",
      name: copy.dashboard.otherProvince ?? "Lainnya",
      level: "province",
      parentRegionId: null,
      hasData: orphanRegions.some((r) => r.hasData),
      isFixture: true,
    };
    groups.push({
      province: otherProvince,
      subRegions: orphanRegions,
    });
  }

  groups.sort((a, b) => a.province.name.localeCompare(b.province.name, "id"));

  return groups;
}

function resolveRegions(
  arg1?: string | Region[],
  arg2?: string | Region[]
): { slug: string; regions: Region[] } {
  if (typeof arg1 === "string") {
    return {
      slug: arg1,
      regions: Array.isArray(arg2) ? arg2 : cachedRegions,
    };
  }
  if (Array.isArray(arg1)) {
    return {
      slug: typeof arg2 === "string" ? arg2 : "",
      regions: arg1,
    };
  }
  return {
    slug: "",
    regions: cachedRegions,
  };
}

/**
 * Returns the province Region of the specified region slug.
 * Supports:
 * - getProvinceOf(regionSlug) (uses cached regions)
 * - getProvinceOf(regionSlug, regions)
 * - getProvinceOf(regions, regionSlug)
 */
export function getProvinceOf(
  arg1: string | Region[],
  arg2?: string | Region[]
): Region | null {
  const { slug, regions } = resolveRegions(arg1, arg2);
  if (!slug) return null;

  const groups = groupRegions(regions);
  for (const group of groups) {
    if (group.province.slug === slug) {
      return group.province;
    }
    if (group.subRegions.some((sub) => sub.slug === slug)) {
      return group.province;
    }
  }

  return null;
}

/**
 * Returns the sub-regions list for the specified province slug.
 * Supports:
 * - getSubRegions(provinceSlug) (uses cached regions)
 * - getSubRegions(provinceSlug, regions)
 * - getSubRegions(regions, provinceSlug)
 */
export function getSubRegions(
  arg1: string | Region[],
  arg2?: string | Region[]
): Region[] {
  const { slug, regions } = resolveRegions(arg1, arg2);
  if (!slug) return [];

  const groups = groupRegions(regions);
  const found = groups.find((g) => g.province.slug === slug);
  return found ? found.subRegions : [];
}

/**
 * Formats region announcement text for screen readers (aria-live) and status text.
 * e.g. "Menampilkan Kota Bandung, Provinsi Jawa Barat, 2024" or "Menampilkan Provinsi Jawa Barat, 2024"
 */
export function formatRegionAnnouncement(
  region: Region | undefined,
  province: Region | null | undefined,
  year: number
): string {
  if (!region) return "";

  if (region.level === "province") {
    const provName = province?.name ?? region.name;
    return copy.dashboard.provinceStatusAnnouncement
      .replace("{province}", provName)
      .replace("{year}", String(year));
  }

  const subName = region.name;
  const provName = province?.name ?? "";
  return copy.dashboard.regionStatusAnnouncement
    .replace("{subRegion}", subName)
    .replace("{province}", provName)
    .replace("{year}", String(year));
}

