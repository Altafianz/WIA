import { describe, it, expect } from "vitest";
import request from "supertest";
import fs from "node:fs";
import path from "node:path";
import vercelHandler from "../vercel-entry.js";
import { toApiUrl } from "../vercel.js";
import {
  REPO_ROOT,
  SNAPSHOT_PATH,
  resolveFromRepoRoot,
} from "../config/constants.js";
import { SnapshotRepository } from "../repositories/snapshot.repository.js";

describe("Vercel function entry", () => {
  it("answers /api/health through the exported handler", async () => {
    const res = await request(vercelHandler).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("answers /api/meta through the exported handler", async () => {
    const res = await request(vercelHandler).get("/api/meta");

    expect(res.status).toBe(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.data.regions.length).toBeGreaterThan(0);
  });

  it("restores the /api prefix when Vercel hands over a rewritten URL", async () => {
    const health = await request(vercelHandler).get("/health");
    expect(health.status).toBe(200);
    expect(health.body.status).toBe("ok");

    const meta = await request(vercelHandler).get("/meta");
    expect(meta.status).toBe(200);
    expect(meta.body.data).toBeDefined();
  });

  it("normalises catch-all path params and keeps original query strings", () => {
    expect(toApiUrl("/", ["health"])).toBe("/api/health");
    expect(toApiUrl("/api", ["meta"])).toBe("/api/meta");
    expect(toApiUrl("/api", ["budget", "summary"])).toBe(
      "/api/budget/summary",
    );
    expect(toApiUrl("/api?path=health&year=2024", ["health"])).toBe(
      "/api/health?year=2024",
    );
    expect(toApiUrl("/api/budget/summary?year=2024")).toBe(
      "/api/budget/summary?year=2024",
    );
    expect(toApiUrl("/api/meta")).toBe("/api/meta");
  });

  it("resolves the snapshot from a repository-relative path", () => {
    expect(path.isAbsolute(REPO_ROOT)).toBe(true);
    expect(fs.existsSync(path.join(REPO_ROOT, "package.json"))).toBe(true);
    expect(SNAPSHOT_PATH).toBe(
      resolveFromRepoRoot(path.join("data", "processed", "snapshot.v1.json")),
    );

    const relativeSnapshot = path.relative(REPO_ROOT, SNAPSHOT_PATH);
    const repository = new SnapshotRepository(
      resolveFromRepoRoot(relativeSnapshot),
    );

    expect(repository.getMeta().recordCount).toBeGreaterThan(0);
    expect(repository.listRegions().length).toBeGreaterThan(0);
  });
});
