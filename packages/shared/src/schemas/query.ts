import { z } from "zod";

export const RegionSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(60);

export const YearSchema = z.coerce.number().int().min(2021).max(2025);

export const SectorParamSchema = z.union([
  z.literal("all"),
  z.string().regex(/^F\d{2}$/),
]);

export const BudgetSummaryQuerySchema = z
  .object({
    region: RegionSlugSchema.optional(),
    year: YearSchema.optional(),
  })
  .strict();

export type BudgetSummaryQuery = z.infer<typeof BudgetSummaryQuerySchema>;

export const BudgetSectorsQuerySchema = BudgetSummaryQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(10).default(10),
  sector: SectorParamSchema.default("all"),
}).strict();

export type BudgetSectorsQuery = z.infer<typeof BudgetSectorsQuerySchema>;

export const BudgetTrendQuerySchema = z
  .object({
    region: RegionSlugSchema.optional(),
    from: YearSchema.optional(),
    to: YearSchema.optional(),
  })
  .strict()
  .refine((q) => !q.from || !q.to || q.from <= q.to, {
    message: "FROM_AFTER_TO",
  });

export type BudgetTrendQuery = z.infer<typeof BudgetTrendQuerySchema>;

export const InsightsQuerySchema = z
  .object({
    region: RegionSlugSchema.optional(),
    year: YearSchema.optional(),
  })
  .strict();

export type InsightsQuery = z.infer<typeof InsightsQuerySchema>;
