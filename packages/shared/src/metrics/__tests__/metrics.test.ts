import { describe, it, expect } from "vitest";
import {
  calculateRealizationRate,
  calculateRemainingBudget,
  calculateSectorShare,
  calculateYoYGrowth,
  calculateDelta,
  round1,
  aggregateTotals,
} from "../index.js";
import { BudgetRecord } from "../../schemas/budget-record.js";

describe("Metrics pure functions", () => {
  it("round1 correctly rounds to 1 decimal", () => {
    expect(round1(75.54)).toBe(75.5);
    expect(round1(75.56)).toBe(75.6);
  });

  it("M-01: calculateRealizationRate", () => {
    // 1.8 T / 2.4 T -> 75.0%
    expect(calculateRealizationRate(1_800_000_000_000, 2_400_000_000_000)).toBe(75.0);
    // null realization
    expect(calculateRealizationRate(null, 2_400_000_000_000)).toBeNull();
    // 0 pagu
    expect(calculateRealizationRate(100, 0)).toBeNull();
    // > 100% (EC-04)
    expect(calculateRealizationRate(30_000_000_000, 24_000_000_000)).toBe(125.0);
  });

  it("M-02: calculateRemainingBudget", () => {
    expect(calculateRemainingBudget(2_400_000_000_000, 1_800_000_000_000)).toBe(600_000_000_000);
    expect(calculateRemainingBudget(2_400_000_000_000, null)).toBeNull();
  });

  it("M-03: calculateSectorShare", () => {
    // 720 M / 2.4 T -> 30.0%
    expect(calculateSectorShare(720_000_000_000, 2_400_000_000_000)).toBe(30.0);
    expect(calculateSectorShare(100, 0)).toBeNull();
  });

  it("M-04: calculateYoYGrowth", () => {
    // (288 - 240) / 240 -> 20.0%
    expect(calculateYoYGrowth(288_000_000_000, 240_000_000_000)).toBe(20.0);
    expect(calculateYoYGrowth(null, 240_000_000_000)).toBeNull();
    expect(calculateYoYGrowth(288_000_000_000, 0)).toBeNull();
  });

  it("M-06: calculateDelta", () => {
    const res = calculateDelta(2_400_000_000_000, 2_000_000_000_000);
    expect(res.delta).toBe(400_000_000_000);
    expect(res.deltaPercent).toBe(20.0);
  });

  it("aggregateTotals aggregates empty records", () => {
    const res = aggregateTotals([]);
    expect(res.totalPagu).toBe(0);
    expect(res.totalRealisasi).toBeNull();
    expect(res.realisasiComplete).toBe(false);
    expect(res.periodStatus).toBe("approved");
  });

  it("aggregateTotals aggregates anchor records correctly", () => {
    const records: BudgetRecord[] = [
      {
        recordId: "1",
        regionId: "ID-FIX-P01",
        sectorId: "F07",
        fiscalYear: 2024,
        pagu: 720_000_000_000,
        realisasi: 550_000_000_000,
        periodStatus: "final",
        sourceId: "SRC-FIXTURE-01",
        updatedAt: "2026-11-01T00:00:00Z",
        isFixture: true,
      },
      {
        recordId: "2",
        regionId: "ID-FIX-P01",
        sectorId: "F10",
        fiscalYear: 2024,
        pagu: 600_000_000_000,
        realisasi: 470_000_000_000,
        periodStatus: "final",
        sourceId: "SRC-FIXTURE-01",
        updatedAt: "2026-11-01T00:00:00Z",
        isFixture: true,
      },
    ];

    const res = aggregateTotals(records);
    expect(res.totalPagu).toBe(1_320_000_000_000);
    expect(res.totalRealisasi).toBe(1_020_000_000_000);
    expect(res.realisasiComplete).toBe(true);
    expect(res.periodStatus).toBe("final");
  });
});
