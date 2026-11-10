import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Directory of the compiled/runtime module. Both `src/config` and `dist/config`
 * sit at the same depth, so the repository root can be resolved without relying
 * on the process working directory.
 */
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const MAX_PARENT_LOOKUPS = 8;

function findRepoRoot(startDir: string): string {
  let current = startDir;

  for (let depth = 0; depth < MAX_PARENT_LOOKUPS; depth += 1) {
    if (
      fs.existsSync(path.join(current, "pnpm-workspace.yaml")) ||
      fs.existsSync(path.join(current, "pnpm-lock.yaml"))
    ) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // Fallback: apps/api/{src,dist}/config -> repository root.
  return path.resolve(startDir, "..", "..", "..", "..");
}

export const REPO_ROOT = findRepoRoot(moduleDir);

export function resolveFromRepoRoot(value: string): string {
  return path.isAbsolute(value) ? value : path.resolve(REPO_ROOT, value);
}

export const DATA_DIR = path.resolve(REPO_ROOT, "data");
export const FIXTURES_DIR = path.join(DATA_DIR, "fixtures");
export const REFERENCE_DIR = path.join(DATA_DIR, "reference");
export const PROCESSED_DIR = path.join(DATA_DIR, "processed");
export const SNAPSHOT_PATH = path.join(PROCESSED_DIR, "snapshot.v1.json");
export const WEB_DIST_DIR = path.resolve(REPO_ROOT, "apps", "web", "dist");
