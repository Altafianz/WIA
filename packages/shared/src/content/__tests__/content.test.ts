import { describe, expect, it } from "vitest";
import {
  GLOSSARY_ENTRIES,
  INSIGHT_RULE_META,
  METRIC_DEFINITIONS,
  generateInsights,
  ruleIns01,
  ruleIns02,
  ruleIns03,
  ruleIns04,
  ruleIns05,
  ruleIns06,
} from "../../index.js";
import type { BudgetRecord } from "../../schemas/budget-record.js";
import type { Sector } from "../../schemas/sector.js";

const sectors: Sector[] = [
  {
    sectorId: "F01",
    name: "Pelayanan Umum",
    shortName: "Pelayanan",
    sortOrder: 1,
    isFixture: true,
  },
  {
    sectorId: "F02",
    name: "Pertahanan",
    shortName: "Pertahanan",
    sortOrder: 2,
    isFixture: true,
  },
  {
    sectorId: "F03",
    name: "Ekonomi",
    shortName: "Ekonomi",
    sortOrder: 3,
    isFixture: true,
  },
];

function createRecord(
  sectorId: string,
  pagu: number,
  realisasi: number | null,
  periodStatus: "approved" | "partial" | "final",
  fiscalYear: number,
): BudgetRecord {
  return {
    recordId: `ID-FIX-P01:${sectorId}:${fiscalYear}`,
    regionId: "ID-FIX-P01",
    sectorId,
    fiscalYear,
    pagu,
    realisasi,
    periodStatus,
    realizationAsOf: null,
    sourceId: "SRC-FIXTURE-01",
    updatedAt: "2026-11-01T00:00:00Z",
    isFixture: true,
  };
}

describe("Glossary content (FR-051)", () => {
  it("contains at least 15 unique terms", () => {
    expect(GLOSSARY_ENTRIES.length).toBeGreaterThanOrEqual(15);
    const terms = GLOSSARY_ENTRIES.map((entry) => entry.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("keeps every simple definition at 25 words or fewer", () => {
    for (const entry of GLOSSARY_ENTRIES) {
      const wordCount = entry.simpleDefinition.trim().split(/\s+/).length;
      expect(wordCount, entry.term).toBeLessThanOrEqual(25);
      expect(entry.example.length).toBeGreaterThan(0);
      expect(Array.isArray(entry.relatedTerms)).toBe(true);
    }
  });
});

describe("Methodology metadata (FR-052)", () => {
  it("defines exactly M-01 to M-06", () => {
    expect(METRIC_DEFINITIONS.map((metric) => metric.id)).toEqual([
      "M-01",
      "M-02",
      "M-03",
      "M-04",
      "M-05",
      "M-06",
    ]);
  });

  it("defines exactly INS-01 to INS-06", () => {
    expect(INSIGHT_RULE_META.map((rule) => rule.id)).toEqual([
      "INS-01",
      "INS-02",
      "INS-03",
      "INS-04",
      "INS-05",
      "INS-06",
    ]);
  });

  it("uses metadata ids and severities that match the engine output", () => {
    const current = [
      createRecord("F01", 600, 500, "approved", 2024),
      createRecord("F02", 300, 120, "final", 2024),
      createRecord("F03", 100, 100, "final", 2024),
    ];
    const previous = [
      createRecord("F01", 500, 400, "final", 2023),
      createRecord("F02", 300, 280, "final", 2023),
      createRecord("F03", 100, 90, "final", 2023),
    ];
    const sectorsMap = new Map(sectors.map((sector) => [sector.sectorId, sector]));

    const ruleResults = [
      ruleIns01(current, 1000, sectorsMap, 2024),
      ruleIns02(current, 1000, sectorsMap),
      ruleIns03(current, previous, sectorsMap, 2024, 2023),
      ruleIns04(current, 1000, sectorsMap),
      ruleIns05(current, 1000, sectorsMap),
      ruleIns06(current, 2024),
    ];

    expect(ruleResults.every((item) => item !== null)).toBe(true);

    for (const insight of ruleResults) {
      if (!insight) continue;
      const metadata = INSIGHT_RULE_META.find((rule) => rule.id === insight.ruleId);
      expect(metadata, insight.ruleId).toBeDefined();
      expect(metadata?.severity).toBe(insight.severity);
    }

    const engineResult = generateInsights({
      currentRecords: current,
      previousRecords: previous,
      sectors,
      totalPagu: 1000,
      year: 2024,
      prevYear: 2023,
    });

    expect(engineResult.items.length).toBeGreaterThan(0);
    for (const item of engineResult.items) {
      expect(
        INSIGHT_RULE_META.some((rule) => rule.id === item.ruleId),
        item.ruleId,
      ).toBe(true);
    }
  });
});
