import { BudgetRecord } from "../schemas/budget-record.js";
import { Sector } from "../schemas/sector.js";
import { InsightItem } from "../schemas/api.js";
import { ruleIns01, ruleIns02, ruleIns03, ruleIns04, ruleIns05 } from "./rules.js";
import { GLOBAL_DISCLAIMER } from "./disclaimers.js";

export interface GenerateInsightsParams {
  currentRecords: BudgetRecord[];
  previousRecords?: BudgetRecord[];
  sectors: Sector[];
  totalPagu: number;
}

export function generateInsights(params: GenerateInsightsParams): {
  items: InsightItem[];
  globalDisclaimer: string;
} {
  const { currentRecords, previousRecords = [], sectors, totalPagu } = params;
  const sectorsMap = new Map<string, Sector>(sectors.map((s) => [s.sectorId, s]));

  const candidateItems: (InsightItem | null)[] = [
    ruleIns01(currentRecords, sectorsMap, totalPagu),
    ruleIns02(currentRecords, sectorsMap, totalPagu),
    ruleIns03(currentRecords, previousRecords, sectorsMap),
    ruleIns04(currentRecords, sectorsMap, totalPagu),
    ruleIns05(currentRecords, totalPagu),
  ];

  const items = candidateItems.filter((item): item is InsightItem => item !== null);

  // Urutan keluaran: warning -> info, lalu ruleId asc; maksimum 5 item
  const severityScore = (s: string) => (s === "warning" ? 1 : 2);
  items.sort((a, b) => {
    const diff = severityScore(a.severity) - severityScore(b.severity);
    if (diff !== 0) return diff;
    return a.ruleId.localeCompare(b.ruleId);
  });

  return {
    items: items.slice(0, 5),
    globalDisclaimer: GLOBAL_DISCLAIMER,
  };
}
