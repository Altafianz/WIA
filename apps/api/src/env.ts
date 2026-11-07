import { z } from "zod";

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATA_ADAPTER: z.enum(["fixture", "snapshot"]).default("snapshot"),
  DEFAULT_REGION_SLUG: z.string().default("provinsi-jawa-barat"),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  NODE_ENV: process.env.NODE_ENV,
  DATA_ADAPTER: process.env.DATA_ADAPTER,
  DEFAULT_REGION_SLUG: process.env.DEFAULT_REGION_SLUG,
});
