import { z } from "zod";

export const PeriodStatusSchema = z.enum(["approved", "partial", "final"]);
export type PeriodStatus = z.infer<typeof PeriodStatusSchema>;

export const BudgetRecordSchema = z.object({
  recordId: z.string(),
  regionId: z.string(),
  sectorId: z.string(),
  fiscalYear: z.number().int().min(2000).max(2100),
  pagu: z.number().int().nonnegative(),
  realisasi: z.number().int().nonnegative().nullable(),
  periodStatus: PeriodStatusSchema,
  realizationAsOf: z.string().nullable().optional(),
  sourceId: z.string(),
  updatedAt: z.string(),
  isFixture: z.boolean().default(true),
});

export type BudgetRecord = z.infer<typeof BudgetRecordSchema>;
