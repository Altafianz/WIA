import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATA_ADAPTER: z.enum(["fixture", "snapshot"]).default("snapshot"),
  DEFAULT_REGION_SLUG: z.string().default("provinsi-jawa-barat"),
  FEEDBACK_FILE: z.string().default("data/feedback/feedback.jsonl"),
  FEEDBACK_WEBHOOK_URL: z.string().optional(),
  TRUST_PROXY: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Loads .env file using Node's built-in process.loadEnvFile without overriding existing environment variables.
 * Safe to call when .env does not exist (e.g. in production).
 */
export function loadEnv(customPath?: string): void {
  if (customPath) {
    if (fs.existsSync(customPath)) {
      try {
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(customPath);
        }
      } catch (err: unknown) {
        if ((err as { code?: string })?.code !== "ENOENT") {
          throw err;
        }
      }
    }
    return;
  }

  // In test environment, skip auto-loading to avoid polluting test suite
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const candidates = [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"),
    path.resolve(process.cwd(), "apps", "api", ".env"),
    path.resolve(process.cwd(), ".env"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(candidate);
        }
      } catch (err: unknown) {
        if ((err as { code?: string })?.code !== "ENOENT") {
          throw err;
        }
      }
      break;
    }
  }
}

// Auto-load on import for development and production runtime
loadEnv();

export function parseEnv(): Env {
  return EnvSchema.parse({
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    NODE_ENV: process.env.NODE_ENV,
    DATA_ADAPTER: process.env.DATA_ADAPTER,
    DEFAULT_REGION_SLUG: process.env.DEFAULT_REGION_SLUG,
    FEEDBACK_FILE: process.env.FEEDBACK_FILE,
    FEEDBACK_WEBHOOK_URL: process.env.FEEDBACK_WEBHOOK_URL,
    TRUST_PROXY: process.env.TRUST_PROXY,
  });
}

export const env: Env = parseEnv();
