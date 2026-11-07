import { z } from "zod";

export const RegionSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(60);

export const YearSchema = z.coerce.number().int().min(2000).max(2100);

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

export const CompareQuerySchema = z
  .object({
    mode: z.enum(["region", "year"]).default("region"),
    a: RegionSlugSchema,
    b: RegionSlugSchema.optional(),
    year: YearSchema.optional(),
    yearA: YearSchema.optional(),
    yearB: YearSchema.optional(),
  })
  .strict()
  .superRefine((q, ctx) => {
    if (q.mode === "region" && !q.b) {
      ctx.addIssue({ code: "custom", message: "B_REQUIRED", path: ["b"] });
    }
    if (q.mode === "year" && (!q.yearA || !q.yearB)) {
      ctx.addIssue({
        code: "custom",
        message: "YEAR_A_B_REQUIRED",
        path: ["yearA"],
      });
    }
    if (q.mode === "year" && q.yearA && q.yearB && q.yearA === q.yearB) {
      ctx.addIssue({
        code: "custom",
        message: "YEARS_MUST_DIFFER",
        path: ["yearB"],
      });
    }
    if (q.mode === "region" && q.a === q.b) {
      ctx.addIssue({
        code: "custom",
        message: "REGIONS_MUST_DIFFER",
        path: ["b"],
      });
    }
  });

export type CompareQuery = z.infer<typeof CompareQuerySchema>;
