import { describe, it, expect } from "vitest";
import { generateInsights, ruleIns01, ruleIns02 } from "../index.js";
import { BudgetRecord } from "../../schemas/budget-record.js";
import { Sector } from "../../schemas/sector.js";
import { containsForbiddenWords } from "../../content/forbidden-words.js";

const mockSectors: Sector[] = [
  { sectorId: "F07", name: "Kesehatan", shortName: "Kesehatan", sortOrder: 1, isFixture: true },
  { sectorId: "F10", name: "Pendidikan", shortName: "Pendidikan", sortOrder: 2, isFixture: true },
  { sectorId: "F02", name: "Pertahanan", shortName: "Pertahanan", sortOrder: 10, isFixture: true },
];

describe("Insight engine & rules", () => {
  it("INS-01 triggers when top sector share >= 25.0%", () => {
    const records: BudgetRecord[] = [
      {
        recordId: "1",
        regionId: "ID-FIX-P01",
        sectorId: "F07",
        fiscalYear: 2024,
        pagu: 720_000_000_000, // 30% of 2.4T
        realisasi: 550_000_000_000,
        periodStatus: "final",
        sourceId: "src-1",
        updatedAt: "2026-11-01T00:00:00Z",
        isFixture: true,
      },
    ];
    const sectorsMap = new Map(mockSectors.map((s) => [s.sectorId, s]));
    const item = ruleIns01(records, sectorsMap, 2_400_000_000_000);
    expect(item).not.toBeNull();
    expect(item?.ruleId).toBe("INS-01");
    expect(item?.summary).toContain("30,0%");
    expect(item?.summary).toContain("Kesehatan");
    expect(containsForbiddenWords(item!.summary)).toBe(false);
  });

  it("INS-02 triggers when a sector rate < 50.0% and gap >= 0.5% total pagu", () => {
    const records: BudgetRecord[] = [
      {
        recordId: "2",
        regionId: "ID-FIX-P01",
        sectorId: "F02",
        fiscalYear: 2024,
        pagu: 24_000_000_000,
        realisasi: 10_000_000_000, // rate 41.7%, gap 14M > 12M (0.5% of 2.4T)
        periodStatus: "final",
        sourceId: "src-1",
        updatedAt: "2026-11-01T00:00:00Z",
        isFixture: true,
      },
    ];
    const sectorsMap = new Map(mockSectors.map((s) => [s.sectorId, s]));
    const item = ruleIns02(records, sectorsMap, 2_400_000_000_000);
    expect(item).not.toBeNull();
    expect(item?.ruleId).toBe("INS-02");
    expect(item?.summary).toContain("41,7%");
    expect(containsForbiddenWords(item!.summary)).toBe(false);
  });

  it("generateInsights returns disclaimer and max 5 items without forbidden words", () => {
    const records: BudgetRecord[] = [
      {
        recordId: "1",
        regionId: "ID-FIX-P01",
        sectorId: "F07",
        fiscalYear: 2024,
        pagu: 720_000_000_000,
        realisasi: 550_000_000_000,
        periodStatus: "final",
        sourceId: "src-1",
        updatedAt: "2026-11-01T00:00:00Z",
        isFixture: true,
      },
      {
        recordId: "2",
        regionId: "ID-FIX-P01",
        sectorId: "F02",
        fiscalYear: 2024,
        pagu: 24_000_000_000,
        realisasi: 10_000_000_000,
        periodStatus: "final",
        sourceId: "src-1",
        updatedAt: "2026-11-01T00:00:00Z",
        isFixture: true,
      },
    ];

    const result = generateInsights({
      currentRecords: records,
      sectors: mockSectors,
      totalPagu: 2_400_000_000_000,
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result.globalDisclaimer).toBeTruthy();
    for (const item of result.items) {
      expect(containsForbiddenWords(item.summary)).toBe(false);
      expect(containsForbiddenWords(item.limitation)).toBe(false);
    }
  });
});
