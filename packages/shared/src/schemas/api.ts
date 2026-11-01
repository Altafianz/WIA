import { z } from "zod";
import { SourceMetaSchema } from "./source-meta.js";
import { PeriodStatusSchema } from "./budget-record.js";
import { RegionSchema } from "./region.js";
import { SectorSchema } from "./sector.js";

export const BudgetSummaryDataSchema = z.object({
  regionSlug: z.string(),
  regionName: z.string(),
  fiscalYear: z.number().int(),
  totalPagu: z.number().int(),
  totalRealisasi: z.number().int().nullable(),
  realizationRate: z.number().nullable(),
  remainingBudget: z.number().int().nullable(),
  sectorCount: z.number().int(),
  realisasiComplete: z.boolean(),
  periodStatus: PeriodStatusSchema,
});
export type BudgetSummaryData = z.infer<typeof BudgetSummaryDataSchema>;

export const SectorSliceSchema = z.object({
  sectorId: z.string(),
  name: z.string(),
  pagu: z.number().int(),
  realisasi: z.number().int().nullable(),
  realizationRate: z.number().nullable(),
  share: z.number(),
  colorToken: z.string().optional(),
});
export type SectorSlice = z.infer<typeof SectorSliceSchema>;

export const BudgetSectorsDataSchema = z.object({
  regionSlug: z.string(),
  fiscalYear: z.number().int(),
  totalPagu: z.number().int(),
  slices: z.array(SectorSliceSchema),
});
export type BudgetSectorsData = z.infer<typeof BudgetSectorsDataSchema>;

export const TrendPointSchema = z.object({
  fiscalYear: z.number().int(),
  pagu: z.number().int(),
  realisasi: z.number().int().nullable(),
  realizationRate: z.number().nullable(),
  periodStatus: PeriodStatusSchema,
});
export type TrendPoint = z.infer<typeof TrendPointSchema>;

export const BudgetTrendDataSchema = z.object({
  regionSlug: z.string(),
  points: z.array(TrendPointSchema),
});
export type BudgetTrendData = z.infer<typeof BudgetTrendDataSchema>;

export const InsightItemSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  title: z.string(),
  summary: z.string(),
  limitation: z.string(),
  category: z.string(),
  severity: z.enum(["info", "warning", "positive"]),
});
export type InsightItem = z.infer<typeof InsightItemSchema>;

export const InsightsDataSchema = z.object({
  regionSlug: z.string(),
  fiscalYear: z.number().int(),
  items: z.array(InsightItemSchema).max(5),
  globalDisclaimer: z.string(),
});
export type InsightsData = z.infer<typeof InsightsDataSchema>;

export const MetaDataSchema = z.object({
  availableYears: z.array(z.number().int()),
  latestFinalYear: z.number().int(),
  defaultRegionSlug: z.string(),
  regions: z.array(RegionSchema),
  sectors: z.array(SectorSchema),
});
export type MetaData = z.infer<typeof MetaDataSchema>;

export interface ApiResponse<T> {
  meta: z.infer<typeof SourceMetaSchema>;
  data: T;
}
