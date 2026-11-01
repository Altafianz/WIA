import { BudgetRecord } from "../schemas/budget-record.js";
import { Sector } from "../schemas/sector.js";
import { Insight } from "../schemas/api.js";
import {
  ruleIns01,
  ruleIns02,
  ruleIns03,
  ruleIns04,
  ruleIns05,
  ruleIns06,
} from "./rules.js";
import { GLOBAL_DISCLAIMER } from "./disclaimers.js";

export interface GenerateInsightsParams {
  currentRecords: BudgetRecord[];
  previousRecords?: BudgetRecord[];
  sectors: Sector[];
  totalPagu: number;
  year: number;
  prevYear?: number;
}

export function generateInsights(params: GenerateInsightsParams): {
  items: Insight[];
  disclaimer: string;
} {
  const {
    currentRecords,
    previousRecords = [],
    sectors,
    totalPagu,
    year,
    prevYear = year - 1,
  } = params;

  const sectorsMap = new Map<string, Sector>(sectors.map((s) => [s.sectorId, s]));

  const candidateItems: (Insight | null)[] = [
    ruleIns01(currentRecords, totalPagu, sectorsMap, year),
    ruleIns02(currentRecords, totalPagu, sectorsMap),
    ruleIns03(currentRecords, previousRecords, sectorsMap, year, prevYear),
    ruleIns04(currentRecords, totalPagu, sectorsMap),
    ruleIns05(currentRecords, totalPagu, sectorsMap),
    ruleIns06(currentRecords, year),
  ];

  const items = candidateItems.filter((item): item is Insight => item !== null);

  // Urutan: caution -> attention -> info, lalu ruleId asc; maksimum 5 item
  const severityScore = (s: Insight["severity"]) => {
    switch (s) {
      case "caution":
        return 1;
      case "attention":
        return 2;
      case "info":
        return 3;
      default:
        return 4;
    }
  };

  items.sort((a, b) => {
    const diff = severityScore(a.severity) - severityScore(b.severity);
    if (diff !== 0) return diff;
    return a.ruleId.localeCompare(b.ruleId);
  });

  return {
    items: items.slice(0, 5),
    disclaimer: GLOBAL_DISCLAIMER,
  };
}
