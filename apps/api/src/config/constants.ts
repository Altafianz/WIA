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

function isRepoRoot(dir: string): boolean {
  // Workspace markers exist in a normal checkout and in Vercel's build image.
  if (
    fs.existsSync(path.join(dir, "pnpm-workspace.yaml")) ||
    fs.existsSync(path.join(dir, "pnpm-lock.yaml"))
  ) {
    return true;
  }

  // Vercel function bundles only include the data files we list in
  // vercel.json; the workspace markers are not part of that bundle. The
  // snapshot therefore doubles as a reliable root marker there.
  return fs.existsSync(
    path.join(dir, "data", "processed", "snapshot.v1.json")
  );
}

function walkUpForRepoRoot(startDir: string): string | null {
  let current = path.resolve(startDir);

  for (let depth = 0; depth < MAX_PARENT_LOOKUPS; depth += 1) {
    if (isRepoRoot(current)) return current;

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

function findRepoRoot(startDir: string): string {
  // Prefer the module location (works when the bundle preserves directory
  // structure), then fall back to the process working directory (/var/task on
  // Vercel, repository root in tests/scripts).
  const fromModule = walkUpForRepoRoot(startDir);
  if (fromModule) return fromModule;

  const fromCwd = walkUpForRepoRoot(process.cwd());
  if (fromCwd) return fromCwd;

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
