import { z } from "zod";
import { SourceMetaSchema } from "./source-meta.js";
import { PeriodStatusSchema } from "./budget-record.js";
import { RegionSchema } from "./region.js";
import { SectorSchema } from "./sector.js";

export const BudgetSummaryDataSchema = z.object({
  regionSlug: z.string(),
  fiscalYear: z.number().int(),
  totalPagu: z.number().int().nonnegative(),
  totalRealisasi: z.number().int().nonnegative().nullable(),
  realizationRate: z.number().nullable(),
  remainingBudget: z.number().int().nullable(),
  sectorCount: z.number().int(),
  realisasiComplete: z.boolean(),
  periodStatus: PeriodStatusSchema,
});
export type BudgetSummaryData = z.infer<typeof BudgetSummaryDataSchema>;

export const SummaryResponseSchema = z.object({
  meta: SourceMetaSchema,
  data: BudgetSummaryDataSchema,
});
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

export const SectorSliceSchema = z.object({
  sectorId: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  pagu: z.number().int().nonnegative(),
  realisasi: z.number().int().nonnegative().nullable(),
  realizationRate: z.number().nullable(),
  share: z.number().nullable(),
  rank: z.number().int().positive().optional(),
  isAggregate: z.boolean().default(false),
  colorToken: z.string().optional(),
});
export type SectorSlice = z.infer<typeof SectorSliceSchema>;

export const BudgetSectorsDataSchema = z.object({
  regionSlug: z.string(),
  fiscalYear: z.number().int(),
  totalPagu: z.number().int().nonnegative(),
  totalRealisasi: z.number().int().nonnegative().nullable(),
  realisasiComplete: z.boolean(),
  slices: z.array(SectorSliceSchema),
});
export type BudgetSectorsData = z.infer<typeof BudgetSectorsDataSchema>;

export const BudgetSectorsResponseSchema = z.object({
  meta: SourceMetaSchema,
  data: BudgetSectorsDataSchema,
});
export type BudgetSectorsResponse = z.infer<typeof BudgetSectorsResponseSchema>;

export const TrendPointSchema = z.object({
  fiscalYear: z.number().int(),
  pagu: z.number().int().nonnegative(),
  realisasi: z.number().int().nonnegative().nullable(),
  periodStatus: PeriodStatusSchema,
});
export type TrendPoint = z.infer<typeof TrendPointSchema>;

export const BudgetTrendDataSchema = z.object({
  regionSlug: z.string(),
  points: z.array(TrendPointSchema),
});
export type BudgetTrendData = z.infer<typeof BudgetTrendDataSchema>;

export const TrendResponseSchema = z.object({
  meta: SourceMetaSchema,
  data: BudgetTrendDataSchema,
});
export type TrendResponse = z.infer<typeof TrendResponseSchema>;

export const InsightSchema = z.object({
  ruleId: z.enum(["INS-01", "INS-02", "INS-03", "INS-04", "INS-05", "INS-06"]),
  severity: z.enum(["info", "attention", "caution"]),
  sentence: z.string().min(20).max(240),
  limitation: z.string().min(20).max(240),
  supportingValues: z.record(z.string(), z.union([z.number(), z.string()])),
});
export type Insight = z.infer<typeof InsightSchema>;
export type InsightItem = Insight; // alias for compatibility

export const InsightsDataSchema = z.object({
  items: z.array(InsightSchema).max(5),
  disclaimer: z.string().min(20).max(300),
});
export type InsightsData = z.infer<typeof InsightsDataSchema>;

export const InsightsResponseSchema = z.object({
  meta: SourceMetaSchema,
  data: InsightsDataSchema,
});
export type InsightsResponse = z.infer<typeof InsightsResponseSchema>;

export const MetaDataSchema = z.object({
  availableYears: z.array(z.number().int()),
  latestFinalYear: z.number().int(),
  defaultRegionSlug: z.string(),
  regions: z.array(RegionSchema),
  sectors: z.array(SectorSchema),
});
export type MetaData = z.infer<typeof MetaDataSchema>;

export const MetaResponseSchema = z.object({
  meta: SourceMetaSchema,
  data: MetaDataSchema,
});
export type MetaResponse = z.infer<typeof MetaResponseSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  dataStatus: z.enum(["ready", "degraded"]),
  recordCount: z.number().int().nonnegative(),
  snapshotVersion: z.string(),
  uptimeSeconds: z.number().nonnegative(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.enum([
      "VALIDATION_ERROR",
      "REGION_NOT_FOUND",
      "DATA_NOT_FOUND",
      "NOT_FOUND",
      "RATE_LIMITED",
      "INTERNAL_ERROR",
      "DATA_UNAVAILABLE",
    ]),
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string(),
  }),
  meta: z
    .object({
      snapshotVersion: z.string(),
      dataStatus: z.enum(["ready", "degraded"]),
      isFixture: z.boolean(),
    })
    .nullable(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export interface ApiResponse<T> {
  meta: z.infer<typeof SourceMetaSchema>;
  data: T;
}
