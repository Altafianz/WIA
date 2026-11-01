import { z } from "zod";

export const RegionLevelSchema = z.enum(["province", "city", "regency"]);
export type RegionLevel = z.infer<typeof RegionLevelSchema>;

export const RegionSchema = z.object({
  regionId: z.string(),
  slug: z.string(),
  name: z.string(),
  level: RegionLevelSchema,
  parentRegionId: z.string().nullable().optional(),
  bpsCode: z.string().nullable().optional(),
  hasData: z.boolean(),
  isFixture: z.boolean().default(true),
});

export type Region = z.infer<typeof RegionSchema>;
