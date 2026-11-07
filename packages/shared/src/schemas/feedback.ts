import { z } from "zod";

export const FeedbackCategorySchema = z.enum([
  "fitur",
  "data",
  "tampilan",
  "lainnya",
]);
export type FeedbackCategory = z.infer<typeof FeedbackCategorySchema>;

export const FeedbackInputSchema = z
  .object({
    category: FeedbackCategorySchema,
    message: z.string().trim().min(10).max(1000),
    contact: z.string().trim().max(100).optional().or(z.literal("")),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .strict();
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export const FeedbackResponseSchema = z.object({
  ok: z.literal(true),
});
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;

