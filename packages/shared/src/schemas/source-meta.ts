import { z } from "zod";

export const DataStatusSchema = z.enum(["ready", "degraded", "stale"]);
export type DataStatus = z.infer<typeof DataStatusSchema>;

export const SourceMetaSchema = z.object({
  sourceId: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string(),
  retrievedAt: z.string(),
  sourceUpdatedAt: z.string().nullable().optional(),
  license: z.string(),
  licenseUrl: z.string().nullable().optional(),
  attribution: z.string(),
  isFixture: z.boolean(),
  snapshotVersion: z.string().default("1.0.0"),
  dataStatus: DataStatusSchema.default("ready"),
  recordCount: z.number().int().optional(),
});

export type SourceMeta = z.infer<typeof SourceMetaSchema>;
