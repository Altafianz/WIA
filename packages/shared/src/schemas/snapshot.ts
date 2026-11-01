import { z } from "zod";
import { RegionSchema } from "./region.js";
import { SectorSchema } from "./sector.js";
import { BudgetRecordSchema } from "./budget-record.js";
import { SourceMetaSchema } from "./source-meta.js";

export const SnapshotSchema = z
  .object({
    schemaVersion: z.literal("1.0.0"),
    generatedAt: z.string(),
    contentHash: z.string().regex(/^[a-f0-9]{64}$/),
    sources: z.array(SourceMetaSchema.omit({ recordCount: true, dataStatus: true })).min(1),
    regions: z.array(RegionSchema).min(1),
    sectors: z.array(SectorSchema).min(1),
    records: z.array(BudgetRecordSchema),
  })
  .strict();

export type Snapshot = z.infer<typeof SnapshotSchema>;
