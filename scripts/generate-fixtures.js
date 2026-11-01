import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Mulberry32 PRNG
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260101);

const SECTOR_IDS = ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10"];

// Anchor table for Nusa Utara 2024
const NUSA_UTARA_2024_ANCHOR = {
  F07: { pagu: 720_000_000_000, realisasi: 550_000_000_000 },
  F10: { pagu: 600_000_000_000, realisasi: 470_000_000_000 },
  F06: { pagu: 336_000_000_000, realisasi: 240_000_000_000 },
  F04: { pagu: 288_000_000_000, realisasi: 180_000_000_000 },
  F01: { pagu: 192_000_000_000, realisasi: 170_000_000_000 },
  F03: { pagu: 96_000_000_000, realisasi: 80_000_000_000 },
  F05: { pagu: 72_000_000_000, realisasi: 40_000_000_000 },
  F08: { pagu: 48_000_000_000, realisasi: 30_000_000_000 },
  F09: { pagu: 24_000_000_000, realisasi: 30_000_000_000 },
  F02: { pagu: 24_000_000_000, realisasi: 10_000_000_000 },
};

const REGION_YEARS = [
  { regionId: "ID-FIX-P01", years: [2021, 2022, 2023, 2024, 2025] },
  { regionId: "ID-FIX-P02", years: [2021, 2022, 2023, 2024] },
  { regionId: "ID-FIX-P03", years: [2022, 2023, 2024] },
  { regionId: "ID-FIX-C01", years: [2022, 2023, 2024] },
];

const TARGET_PAGU_MILLIONS = {
  "ID-FIX-P01": { 2021: 1900000, 2022: 2050000, 2023: 2200000, 2024: 2400000, 2025: 2500000 },
  "ID-FIX-P02": { 2021: 1600000, 2022: 1700000, 2023: 1850000, 2024: 2000000 },
  "ID-FIX-P03": { 2022: 1300000, 2023: 1400000, 2024: 1500000 },
  "ID-FIX-C01": { 2022: 700000, 2023: 760000, 2024: 820000 },
};

const records = [];

for (const { regionId, years } of REGION_YEARS) {
  for (const year of years) {
    const isNusa2024 = regionId === "ID-FIX-P01" && year === 2024;
    const isNusa2025 = regionId === "ID-FIX-P01" && year === 2025;
    const isNusa2023 = regionId === "ID-FIX-P01" && year === 2023;
    const isKotaBahari2022 = regionId === "ID-FIX-C01" && year === 2022;

    const targetTotal = TARGET_PAGU_MILLIONS[regionId][year] * 1_000_000;
    const periodStatus = isNusa2025 ? "approved" : "final";

    if (isNusa2024) {
      for (const sectorId of SECTOR_IDS) {
        const anchor = NUSA_UTARA_2024_ANCHOR[sectorId];
        records.push({
          recordId: `${regionId}-${year}-${sectorId}`,
          regionId,
          sectorId,
          fiscalYear: year,
          pagu: anchor.pagu,
          realisasi: anchor.realisasi,
          periodStatus: "final",
          realizationAsOf: null,
          sourceId: "SRC-FIXTURE-01",
          updatedAt: "2026-11-01T00:00:00.000Z",
          isFixture: true,
        });
      }
      continue;
    }

    // Generate sector pagus
    const sectorPagus = {};
    let sumRaw = 0;

    for (const sectorId of SECTOR_IDS) {
      if (isNusa2023 && sectorId === "F04") {
        sectorPagus[sectorId] = 240_000_000_000; // INS-03 anchor: 240M in 2023 -> 288M in 2024 (+20%)
      } else if (isKotaBahari2022 && sectorId === "F09") {
        sectorPagus[sectorId] = 0; // EC-06 anchor: pagu 0, realisasi 0
      } else {
        // [40M, 900M] kelipatan 1M
        const rawM = Math.floor(40 + rng() * 400);
        sectorPagus[sectorId] = rawM * 1_000_000;
      }
      sumRaw += sectorPagus[sectorId];
    }

    // Adjust to match exact target total
    const diff = targetTotal - sumRaw;
    // Add diff to largest sector (not F04 for Nusa 2023, not F09 for Bahari 2022)
    const adjustableSector = isNusa2023 ? "F07" : "F10";
    sectorPagus[adjustableSector] += diff;

    for (const sectorId of SECTOR_IDS) {
      const pagu = sectorPagus[sectorId];
      let realisasi = null;

      if (!isNusa2025) {
        if (isKotaBahari2022 && sectorId === "F09") {
          realisasi = 0;
        } else {
          // ratio [0.55, 0.95]
          const ratio = 0.55 + rng() * 0.40;
          const realM = Math.round((pagu * ratio) / 1_000_000);
          realisasi = Math.min(pagu, realM * 1_000_000);
        }
      }

      records.push({
        recordId: `${regionId}-${year}-${sectorId}`,
        regionId,
        sectorId,
        fiscalYear: year,
        pagu,
        realisasi,
        periodStatus,
        realizationAsOf: null,
        sourceId: "SRC-FIXTURE-01",
        updatedAt: "2026-11-01T00:00:00.000Z",
        isFixture: true,
      });
    }
  }
}

// Write to data/fixtures/budget-records.json
const outDir = path.join(rootDir, "data", "fixtures");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "budget-records.json"),
  JSON.stringify(records, null, 2) + "\n"
);

console.log(`Generated ${records.length} records in data/fixtures/budget-records.json`);
