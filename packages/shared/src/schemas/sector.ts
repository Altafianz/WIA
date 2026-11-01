import { z } from "zod";

export const SectorSchema = z.object({
  sectorId: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  colorToken: z.string().optional(),
  sortOrder: z.number().int(),
  isFixture: z.boolean().default(true),
});

export type Sector = z.infer<typeof SectorSchema>;
