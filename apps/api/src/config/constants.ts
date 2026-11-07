import path from "node:path";
import fs from "node:fs";

function findDataDir(subpath: string): string {
  // 1. Try process.cwd()
  const cwdPath = path.resolve(process.cwd(), subpath);
  if (fs.existsSync(cwdPath)) return cwdPath;

  // 2. Try one level up
  const oneUp = path.resolve(process.cwd(), "..", subpath);
  if (fs.existsSync(oneUp)) return oneUp;

  // 3. Try two levels up (repo root from apps/api)
  const repoPath = path.resolve(process.cwd(), "../..", subpath);
  if (fs.existsSync(repoPath)) return repoPath;

  return cwdPath;
}

export const FIXTURES_DIR = findDataDir("data/fixtures");
export const REFERENCE_DIR = findDataDir("data/reference");
export const PROCESSED_DIR = findDataDir("data/processed");
export const SNAPSHOT_PATH = path.join(PROCESSED_DIR, "snapshot.v1.json");
