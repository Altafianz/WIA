import type { Region, Sector } from "@danaterbuka/shared";

export const SECTOR_IDS = [
  "F01",
  "F03",
  "F04",
  "F05",
  "F06",
  "F07",
  "F08",
  "F10",
  "F11",
] as const;

export const SECTORS: Sector[] = [
  {
    sectorId: "F01",
    name: "Pelayanan Umum",
    shortName: "Pelayanan",
    description: "Belanja untuk pelayanan umum dan penyelenggaraan pemerintahan daerah.",
    iconKey: "general",
    colorToken: "sector-1",
    sortOrder: 1,
    isFixture: false,
  },
  {
    sectorId: "F03",
    name: "Ketertiban dan Keamanan",
    shortName: "Keamanan",
    description: "Belanja untuk ketertiban, keamanan, dan perlindungan masyarakat.",
    iconKey: "security",
    colorToken: "sector-2",
    sortOrder: 2,
    isFixture: false,
  },
  {
    sectorId: "F04",
    name: "Ekonomi",
    shortName: "Ekonomi",
    description: "Belanja untuk mendukung kegiatan ekonomi dan kesejahteraan masyarakat.",
    iconKey: "economy",
    colorToken: "sector-3",
    sortOrder: 3,
    isFixture: false,
  },
  {
    sectorId: "F05",
    name: "Lingkungan Hidup",
    shortName: "Lingkungan",
    description: "Belanja untuk perlindungan dan pengelolaan lingkungan hidup.",
    iconKey: "environment",
    colorToken: "sector-4",
    sortOrder: 4,
    isFixture: false,
  },
  {
    sectorId: "F06",
    name: "Perumahan dan Fasilitas Umum",
    shortName: "Perumahan",
    description: "Belanja untuk perumahan rakyat dan fasilitas umum daerah.",
    iconKey: "housing",
    colorToken: "sector-5",
    sortOrder: 5,
    isFixture: false,
  },
  {
    sectorId: "F07",
    name: "Kesehatan",
    shortName: "Kesehatan",
    description: "Belanja untuk pelayanan kesehatan masyarakat dan sarana pendukungnya.",
    iconKey: "health",
    colorToken: "sector-6",
    sortOrder: 6,
    isFixture: false,
  },
  {
    sectorId: "F08",
    name: "Pariwisata",
    shortName: "Pariwisata",
    description: "Belanja untuk pengembangan pariwisata dan ekonomi kreatif daerah.",
    iconKey: "tourism",
    colorToken: "sector-7",
    sortOrder: 7,
    isFixture: false,
  },
  {
    sectorId: "F10",
    name: "Pendidikan",
    shortName: "Pendidikan",
    description: "Belanja untuk penyelenggaraan pendidikan dan peningkatan mutu sumber daya manusia.",
    iconKey: "education",
    colorToken: "sector-8",
    sortOrder: 8,
    isFixture: false,
  },
  {
    sectorId: "F11",
    name: "Perlindungan Sosial",
    shortName: "Sosial",
    description: "Belanja untuk perlindungan sosial dan bantuan bagi kelompok rentan.",
    iconKey: "general",
    colorToken: "sector-9",
    sortOrder: 9,
    isFixture: false,
  },
];

export interface RawFunctionRow {
  regionCode: string;
  regionName: string;
  sectorId: string;
  value: number;
}

export interface RegionAggregate {
  regionCode: string;
  regionName: string;
  sectors: Map<string, number>;
}

export interface AggregatedYear {
  regions: Map<string, RegionAggregate>;
}

export type IssueCode =
  | "ASSUMED_ZERO"
  | "REGION_WITHOUT_REALISASI"
  | "REGION_WITHOUT_BUDGET"
  | "NEGATIVE_REALISASI"
  | "NEGATIVE_PAGU"
  | "UNKNOWN_SECTOR";

export interface Issue {
  code: IssueCode;
  detail: string;
}

export interface MergedYear {
  records: Array<{
    regionCode: string;
    sectorId: string;
    fiscalYear: number;
    pagu: number;
    realisasi: number | null;
    periodStatus: "approved" | "final";
  }>;
  issues: Issue[];
  rejected: number;
}

export function normalizeKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function parseSectorId(label: unknown): string | null {
  const text = String(label ?? "").trim();
  const match = text.match(/^(\d{1,2})\s*[.)]?\s+/);
  if (!match) return null;

  const sectorId = `F${match[1].padStart(2, "0")}`;
  return (SECTOR_IDS as readonly string[]).includes(sectorId) ? sectorId : null;
}

export function normalizeRegionCode(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toFixed(2);
  }

  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{1,2})(?:\.(\d{1,2}))?$/);
  if (!match) return null;

  const province = match[1].padStart(2, "0");
  const district = (match[2] ?? "00").padStart(2, "0");
  return `${province}.${district}`;
}

export function normalizeRegionName(value: unknown): string {
  const name = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!name) return name;

  if (/^kab(?:upaten)?\.?\s+/i.test(name)) {
    return name.replace(/^kab(?:upaten)?\.?\s+/i, "Kabupaten ");
  }
  if (/^prov(?:insi)?\.?\s+/i.test(name)) {
    return name.replace(/^prov(?:insi)?\.?\s+/i, "Provinsi ");
  }
  if (/^propinsi\s+/i.test(name)) {
    return name.replace(/^propinsi\s+/i, "Provinsi ");
  }
  if (/^kota\s+/i.test(name)) {
    return name.replace(/^kota\s+/i, "Kota ");
  }

  return name;
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function regionIdFromCode(regionCode: string): string {
  return `ID-PEM-${regionCode.replace(".", "")}`;
}

export function aggregateRows(rows: RawFunctionRow[]): AggregatedYear {
  const regions = new Map<string, RegionAggregate>();

  for (const row of rows) {
    const existing = regions.get(row.regionCode) ?? {
      regionCode: row.regionCode,
      regionName: row.regionName,
      sectors: new Map<string, number>(),
    };

    if (row.regionName) existing.regionName = row.regionName;
    existing.sectors.set(row.sectorId, (existing.sectors.get(row.sectorId) ?? 0) + row.value);
    regions.set(row.regionCode, existing);
  }

  for (const region of regions.values()) {
    for (const [sectorId, value] of region.sectors) {
      region.sectors.set(sectorId, Math.round(value));
    }
  }

  return { regions };
}

export function mergeYear(
  year: number,
  budget: AggregatedYear,
  realization: AggregatedYear | null,
): MergedYear {
  const records: MergedYear["records"] = [];
  const issues: Issue[] = [];
  let rejected = 0;

  for (const [regionCode, budgetRegion] of budget.regions) {
    const realizationRegion = realization?.regions.get(regionCode);

    if (realization && !realizationRegion) {
      issues.push({ code: "REGION_WITHOUT_REALISASI", detail: regionCode });
      for (const [sectorId, pagu] of budgetRegion.sectors) {
        if (pagu < 0) {
          rejected += 1;
          issues.push({ code: "NEGATIVE_PAGU", detail: `${regionCode}/${sectorId}` });
          continue;
        }
        records.push({
          regionCode,
          sectorId,
          fiscalYear: year,
          pagu,
          realisasi: null,
          periodStatus: "approved",
        });
      }
      continue;
    }

    const sectorIds = new Set<string>([
      ...budgetRegion.sectors.keys(),
      ...(realizationRegion?.sectors.keys() ?? []),
    ]);

    for (const sectorId of sectorIds) {
      const rawPagu = budgetRegion.sectors.get(sectorId);
      const rawRealisasi = realizationRegion?.sectors.get(sectorId);

      if (rawPagu === undefined) {
        issues.push({ code: "ASSUMED_ZERO", detail: `${year}/${regionCode}/${sectorId}/pagu` });
      }
      if (realization && rawRealisasi === undefined) {
        issues.push({
          code: "ASSUMED_ZERO",
          detail: `${year}/${regionCode}/${sectorId}/realisasi`,
        });
      }

      const pagu = rawPagu ?? 0;
      let realisasi = realization ? (rawRealisasi ?? 0) : null;

      if (pagu < 0) {
        rejected += 1;
        issues.push({ code: "NEGATIVE_PAGU", detail: `${year}/${regionCode}/${sectorId}` });
        continue;
      }

      if (realisasi !== null && realisasi < 0) {
        realisasi = null;
        issues.push({
          code: "NEGATIVE_REALISASI",
          detail: `${year}/${regionCode}/${sectorId}`,
        });
      }

      // A zero/zero pair carries no information; keep rows that have a value on
      // either side, including assumed-zero rows.
      if (pagu === 0 && (realisasi === null || realisasi === 0)) continue;

      records.push({
        regionCode,
        sectorId,
        fiscalYear: year,
        pagu,
        realisasi,
        periodStatus: realization && realisasi !== null ? "final" : "approved",
      });
    }
  }

  if (realization) {
    for (const regionCode of realization.regions.keys()) {
      if (!budget.regions.has(regionCode)) {
        issues.push({ code: "REGION_WITHOUT_BUDGET", detail: regionCode });
      }
    }
  }

  return { records, issues, rejected };
}

export function buildRegions(
  budgetByYear: Map<number, AggregatedYear>,
): Region[] {
  const names = new Map<string, string>();
  const years = [...budgetByYear.keys()].sort((a, b) => a - b);

  // Nama wilayah diambil dari tahun terbaru, tetapi wilayah yang hanya muncul
  // pada tahun lama tetap dipertahankan.
  for (const year of years) {
    const source = budgetByYear.get(year);
    if (!source) continue;
    for (const [code, region] of source.regions) {
      if (region.regionName) names.set(code, region.regionName);
    }
  }

  if (names.size === 0) return [];

  const usedSlugs = new Map<string, number>();
  return [...names.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, rawName]) => {
      const name = normalizeRegionName(rawName);
      const baseSlug = slugify(name) || `pemda-${code.replace(".", "")}`;
      const count = usedSlugs.get(baseSlug) ?? 0;
      usedSlugs.set(baseSlug, count + 1);
      const slug = count === 0 ? baseSlug : `${baseSlug}-${code.replace(".", "")}`;
      const isProvince = code.endsWith(".00");
      const level = isProvince ? "province" : /^kota\s/i.test(name) ? "city" : "regency";

      return {
        regionId: regionIdFromCode(code),
        slug,
        name,
        level,
        parentRegionId: isProvince ? null : regionIdFromCode(`${code.slice(0, 2)}.00`),
        bpsCode: null,
        hasData: true,
        isFixture: false,
      };
    });
}
