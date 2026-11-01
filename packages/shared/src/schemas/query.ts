import { z } from "zod";

export const BudgetSummaryQuerySchema = z.object({
  region: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(2100)
});

export type BudgetSummaryQuery = z.infer<typeof BudgetSummaryQuerySchema>;

export const BudgetSectorsQuerySchema = z.object({
  region: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(2100)
});

export type BudgetSectorsQuery = z.infer<typeof BudgetSectorsQuerySchema>;

export const BudgetTrendQuerySchema = z.object({
  region: z.string().min(1)
});

export type BudgetTrendQuery = z.infer<typeof BudgetTrendQuerySchema>;

export const InsightsQuerySchema = z.object({
  region: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(2100)
});

export type InsightsQuery = z.infer<typeof InsightsQuerySchema>;
