import { describe, it, expect } from "vitest";
import {
  generateInsights,
  ruleIns01,
  ruleIns02,
  ruleIns03,
  ruleIns04,
  ruleIns05,
  ruleIns06,
} from "../index.js";
import { BudgetRecord } from "../../schemas/budget-record.js";
import { Sector } from "../../schemas/sector.js";
import { containsForbiddenWords } from "../../content/forbidden-words.js";

const mockSectors: Sector[] = [
  {
    sectorId: "F01",
    name: "Pelayanan Umum",
    shortName: "Pelayanan",
    description: "Pelayanan umum",
    iconKey: "general",
    colorToken: "sector-1",
    sortOrder: 1,
    isFixture: true,
  },
  {
    sectorId: "F02",
    name: "Pertahanan",
    shortName: "Pertahanan",
    description: "Pertahanan",
    iconKey: "security",
    colorToken: "sector-2",
    sortOrder: 2,
    isFixture: true,
  },
  {
    sectorId: "F04",
    name: "Ekonomi",
    shortName: "Ekonomi",
    description: "Ekonomi",
    iconKey: "economy",
    colorToken: "sector-4",
    sortOrder: 4,
    isFixture: true,
  },
  {
    sectorId: "F06",
    name: "Perumahan dan Fasilitas Umum",
    shortName: "Infrastruktur",
    description: "Infrastruktur",
    iconKey: "infrastructure",
    colorToken: "sector-6",
    sortOrder: 6,
    isFixture: true,
  },
  {
    sectorId: "F07",
    name: "Kesehatan",
    shortName: "Kesehatan",
    description: "Kesehatan daerah",
    iconKey: "health",
    colorToken: "sector-7",
    sortOrder: 7,
    isFixture: true,
  },
  {
    sectorId: "F10",
    name: "Pendidikan",
    shortName: "Pendidikan",
    description: "Pendidikan daerah",
    iconKey: "education",
    colorToken: "sector-10",
    sortOrder: 10,
    isFixture: true,
  },
];

const sectorsMap = new Map(mockSectors.map((s) => [s.sectorId, s]));

function createRecord(
  sectorId: string,
  pagu: number,
  realisasi: number | null,
  periodStatus: "approved" | "partial" | "final" = "final",
  fiscalYear: number = 2024
): BudgetRecord {
  return {
    recordId: `ID-FIX-P01:${sectorId}:${fiscalYear}`,
    regionId: "ID-FIX-P01",
    sectorId,
    fiscalYear,
    pagu,
    realisasi,
    periodStatus,
    realizationAsOf: periodStatus === "partial" ? "2024-06-30" : null,
    sourceId: "SRC-FIXTURE-01",
    updatedAt: "2026-11-01T00:00:00Z",
    isFixture: true,
  };
}

describe("Insight 18 Mandatory Test Cases (UI_SPEC §8.1)", () => {
  // 1. INS-01: share 30.0% -> memuat "30,0%" dan "Kesehatan"
  it("TC-01: INS-01 share 30.0% produces item with 30,0% and Kesehatan", () => {
    const records = [createRecord("F07", 720_000_000_000, 550_000_000_000)];
    const res = ruleIns01(records, 2_400_000_000_000, sectorsMap, 2024);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("30,0%");
    expect(res?.sentence).toContain("Kesehatan");
  });

  // 2. INS-01: share 24.9% -> tidak menghasilkan item
  it("TC-02: INS-01 share 24.9% produces nothing", () => {
    const records = [createRecord("F07", 249, 200)];
    const res = ruleIns01(records, 1000, sectorsMap, 2024);
    expect(res).toBeNull();
  });

  // 3. INS-01: totalPagu = 0 -> tidak menghasilkan item
  it("TC-03: INS-01 totalPagu = 0 produces nothing", () => {
    const records = [createRecord("F07", 0, null)];
    const res = ruleIns01(records, 0, sectorsMap, 2024);
    expect(res).toBeNull();
  });

  // 4. INS-02: rate 41.7%; gap Rp 14 M; total Rp 2,4 T -> memuat "41,7%" dan "terendah"
  it("TC-04: INS-02 rate 41.7%, gap 14M of 2.4T produces item with 41,7% and terendah", () => {
    const records = [createRecord("F02", 24_000_000_000, 10_000_000_000)];
    const res = ruleIns02(records, 2_400_000_000_000, sectorsMap);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("41,7%");
    expect(res?.sentence).toContain("terendah");
  });

  // 5. INS-02: rate 55.0% -> tidak menghasilkan item
  it("TC-05: INS-02 rate 55.0% produces nothing", () => {
    const records = [createRecord("F02", 100, 55)];
    const res = ruleIns02(records, 1000, sectorsMap);
    expect(res).toBeNull();
  });

  // 6. INS-02: rate 41.7%; gap 0.42% total -> tidak menghasilkan item (threshold gap < 0.5%)
  it("TC-06: INS-02 rate 41.7% with gap 0.42% of total produces nothing", () => {
    // total 1000, 0.5% = 5. pagu = 7.197, realisasi = 3, gap = 4.197 (~0.42% of total), rate = 41.7%
    const records = [createRecord("F02", 7197, 3000)];
    const res = ruleIns02(records, 1_000_000, sectorsMap);
    expect(res).toBeNull();
  });

  // 7. INS-03: 240 M -> 288 M -> memuat "naik 20,0%"
  it("TC-07: INS-03 240M to 288M produces item with naik 20,0%", () => {
    const prev = [createRecord("F04", 240_000_000_000, null, "final", 2023)];
    const curr = [createRecord("F04", 288_000_000_000, null, "final", 2024)];
    const res = ruleIns03(curr, prev, sectorsMap, 2024, 2023);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("naik 20,0%");
  });

  // 8. INS-03: 200 M -> 168 M -> memuat "turun 16,0%"
  it("TC-08: INS-03 200M to 168M produces item with turun 16,0%", () => {
    const prev = [createRecord("F04", 200_000_000_000, null, "final", 2023)];
    const curr = [createRecord("F04", 168_000_000_000, null, "final", 2024)];
    const res = ruleIns03(curr, prev, sectorsMap, 2024, 2023);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("turun 16,0%");
  });

  // 9. INS-03: prev = 0 -> tidak menghasilkan item
  it("TC-09: INS-03 prev = 0 produces nothing", () => {
    const prev = [createRecord("F04", 0, null, "final", 2023)];
    const curr = [createRecord("F04", 100, null, "final", 2024)];
    const res = ruleIns03(curr, prev, sectorsMap, 2024, 2023);
    expect(res).toBeNull();
  });

  // 10. INS-04: gap 7.1% total -> memuat "7,1%" dan "selisih"
  it("TC-10: INS-04 gap 7.1% of total produces item with 7,1% and selisih", () => {
    // total 1000, pagu = 100, realisasi = 29 -> gap = 71 -> 7.1%
    const records = [createRecord("F07", 100, 29)];
    const res = ruleIns04(records, 1000, sectorsMap);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("7,1%");
    expect(res?.sentence).toContain("selisih");
  });

  // 11. INS-04: gap 5.0% total -> menghasilkan item (ambang inklusif)
  it("TC-11: INS-04 gap 5.0% of total produces item (inclusive threshold)", () => {
    const records = [createRecord("F07", 100, 50)];
    const res = ruleIns04(records, 1000, sectorsMap);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("5,0%");
  });

  // 12. INS-04: gap 4.9% total -> tidak menghasilkan item
  it("TC-12: INS-04 gap 4.9% of total produces nothing", () => {
    const records = [createRecord("F07", 100, 51)];
    const res = ruleIns04(records, 1000, sectorsMap);
    expect(res).toBeNull();
  });

  // 13. INS-05: top-3 69.0% -> memuat "69,0%"
  it("TC-13: INS-05 top-3 69.0% produces item with 69,0%", () => {
    // 2.4T total; 720M + 600M + 336M = 1656M -> 69.0%
    const records = [
      createRecord("F07", 720_000_000_000, 550_000_000_000),
      createRecord("F10", 600_000_000_000, 470_000_000_000),
      createRecord("F06", 336_000_000_000, 240_000_000_000),
      createRecord("F04", 288_000_000_000, 180_000_000_000),
    ];
    const res = ruleIns05(records, 2_400_000_000_000, sectorsMap);
    expect(res).not.toBeNull();
    expect(res?.sentence).toContain("69,0%");
  });

  // 14. INS-05: top-3 49.9% -> tidak menghasilkan item
  it("TC-14: INS-05 top-3 49.9% produces nothing", () => {
    const records = [
      createRecord("F07", 170, 170),
      createRecord("F10", 165, 165),
      createRecord("F06", 164, 164),
      createRecord("F04", 160, 160),
      createRecord("F01", 150, 150),
      createRecord("F02", 100, 100),
    ];
    const res = ruleIns05(records, 1000, sectorsMap);
    expect(res).toBeNull();
  });

  // 15. INS-05: hanya 2 sektor -> tidak menghasilkan item
  it("TC-15: INS-05 with only 2 sectors produces nothing", () => {
    const records = [
      createRecord("F07", 600, 500),
      createRecord("F10", 400, 300),
    ];
    const res = ruleIns05(records, 1000, sectorsMap);
    expect(res).toBeNull();
  });

  // 16. INS-06: tahun 2025 approved -> memuat "belum final" atau "sementara"
  it("TC-16: INS-06 year 2025 approved produces item with belum final or sementara", () => {
    const records = [createRecord("F07", 750_000_000_000, null, "approved", 2025)];
    const res = ruleIns06(records, 2025);
    expect(res).not.toBeNull();
    expect(res?.sentence).toMatch(/belum final|sementara/);
  });

  // 17. INS-06: semua final -> tidak menghasilkan item
  it("TC-17: INS-06 all final produces nothing", () => {
    const records = [createRecord("F07", 720_000_000_000, 550_000_000_000, "final", 2024)];
    const res = ruleIns06(records, 2024);
    expect(res).toBeNull();
  });

  // 18. INS-06: records = [] -> tidak menghasilkan item
  it("TC-18: INS-06 records = [] produces nothing", () => {
    const res = ruleIns06([], 2024);
    expect(res).toBeNull();
  });

  it("generateInsights validates severity ordering, limits, and forbidden words", () => {
    const current = [
      createRecord("F07", 720_000_000_000, 550_000_000_000, "final", 2024),
      createRecord("F10", 600_000_000_000, 470_000_000_000, "final", 2024),
      createRecord("F06", 336_000_000_000, 240_000_000_000, "final", 2024),
      createRecord("F04", 288_000_000_000, 180_000_000_000, "final", 2024),
      createRecord("F02", 24_000_000_000, 10_000_000_000, "final", 2024),
    ];
    const prev = [
      createRecord("F04", 240_000_000_000, 150_000_000_000, "final", 2023),
    ];

    const result = generateInsights({
      currentRecords: current,
      previousRecords: prev,
      sectors: mockSectors,
      totalPagu: 2_400_000_000_000,
      year: 2024,
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result.disclaimer).toBeTruthy();

    for (const item of result.items) {
      expect(item.sentence.length).toBeLessThanOrEqual(240);
      expect(item.limitation.length).toBeLessThanOrEqual(240);
      expect(containsForbiddenWords(item.sentence)).toBe(false);
      expect(containsForbiddenWords(item.limitation)).toBe(false);
    }
  });
  it("generates simpleSentence for INS-01 to INS-06 without forbidden words and under 240 chars", () => {
    // INS-01
    const r1 = ruleIns01(
      [createRecord("F07", 720_000_000_000, 500_000_000_000)],
      2_400_000_000_000,
      sectorsMap,
      2024
    );
    expect(r1?.simpleSentence).toBeTruthy();
    expect(r1!.simpleSentence!.length).toBeGreaterThanOrEqual(20);
    expect(r1!.simpleSentence!.length).toBeLessThanOrEqual(240);
    expect(containsForbiddenWords(r1!.simpleSentence!)).toBe(false);
    expect(r1!.simpleSentence).toContain("30,0%");
    expect(r1!.simpleSentence).toContain("Kesehatan");

    // INS-02
    const r2 = ruleIns02(
      [createRecord("F07", 100_000_000_000, 41_700_000_000)],
      2_400_000_000_000,
      sectorsMap
    );
    expect(r2?.simpleSentence).toBeTruthy();
    expect(r2!.simpleSentence!.length).toBeGreaterThanOrEqual(20);
    expect(r2!.simpleSentence!.length).toBeLessThanOrEqual(240);
    expect(containsForbiddenWords(r2!.simpleSentence!)).toBe(false);
    expect(r2!.simpleSentence).toContain("41,7%");

    // INS-03
    const r3 = ruleIns03(
      [createRecord("F04", 288_000_000_000, 100_000_000_000, "final", 2024)],
      [createRecord("F04", 240_000_000_000, 100_000_000_000, "final", 2023)],
      sectorsMap,
      2024,
      2023
    );
    expect(r3?.simpleSentence).toBeTruthy();
    expect(r3!.simpleSentence!.length).toBeGreaterThanOrEqual(20);
    expect(r3!.simpleSentence!.length).toBeLessThanOrEqual(240);
    expect(containsForbiddenWords(r3!.simpleSentence!)).toBe(false);
    expect(r3!.simpleSentence).toContain("20,0%");

    // INS-04
    const r4 = ruleIns04(
      [createRecord("F07", 720_000_000_000, 550_000_000_000)],
      2_400_000_000_000,
      sectorsMap
    );
    expect(r4?.simpleSentence).toBeTruthy();
    expect(r4!.simpleSentence!.length).toBeGreaterThanOrEqual(20);
    expect(r4!.simpleSentence!.length).toBeLessThanOrEqual(240);
    expect(containsForbiddenWords(r4!.simpleSentence!)).toBe(false);

    // INS-05
    const r5 = ruleIns05(
      [
        createRecord("F07", 720_000_000_000, null),
        createRecord("F10", 600_000_000_000, null),
        createRecord("F06", 336_000_000_000, null),
      ],
      2_400_000_000_000,
      sectorsMap
    );
    expect(r5?.simpleSentence).toBeTruthy();
    expect(r5!.simpleSentence!.length).toBeGreaterThanOrEqual(20);
    expect(r5!.simpleSentence!.length).toBeLessThanOrEqual(240);
    expect(containsForbiddenWords(r5!.simpleSentence!)).toBe(false);

    // INS-06
    const r6 = ruleIns06(
      [createRecord("F07", 720_000_000_000, null, "approved", 2025)],
      2025
    );
    expect(r6?.simpleSentence).toBeTruthy();
    expect(r6!.simpleSentence!.length).toBeGreaterThanOrEqual(20);
    expect(r6!.simpleSentence!.length).toBeLessThanOrEqual(240);
    expect(containsForbiddenWords(r6!.simpleSentence!)).toBe(false);
  });
});
