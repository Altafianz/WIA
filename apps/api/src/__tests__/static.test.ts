import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createApp, isSpaFallbackPath } from "../app.js";

function createTempDist(withSeoFiles: boolean): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "danaterbuka-static-"));
  fs.writeFileSync(
    path.join(directory, "index.html"),
    "<!doctype html><html><body><div id=\"root\">SPA-INDEX</div></body></html>",
  );

  if (withSeoFiles) {
    fs.writeFileSync(
      path.join(directory, "robots.txt"),
      "User-agent: *\nAllow: /\nDisallow: /api/\n",
    );
    fs.writeFileSync(
      path.join(directory, "sitemap.xml"),
      '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>',
    );
    fs.writeFileSync(
      path.join(directory, "favicon.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    );
  }

  return directory;
}

const distWithSeo = createTempDist(true);
const distWithoutSeo = createTempDist(false);
const appWithSeo = createApp({ webDist: distWithSeo });
const appWithoutSeo = createApp({ webDist: distWithoutSeo });

afterAll(() => {
  fs.rmSync(distWithSeo, { recursive: true, force: true });
  fs.rmSync(distWithoutSeo, { recursive: true, force: true });
});

describe("Static SEO routing (NFR-015)", () => {
  it("serves robots.txt from the root", async () => {
    const res = await request(appWithSeo).get("/robots.txt");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("User-agent: *");
  });

  it("serves sitemap.xml from the root", async () => {
    const res = await request(appWithSeo).get("/sitemap.xml");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("xml");
    expect(res.text).toContain("<urlset");
  });

  it("serves favicon.svg from the root", async () => {
    const res = await request(appWithSeo).get("/favicon.svg");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("image/svg+xml");
  });

  it("falls back to index.html only for SPA routes", async () => {
    const res = await request(appWithSeo).get("/dashboard");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
    expect(res.text).toContain("SPA-INDEX");
  });

  it("never replaces missing SEO files with the SPA shell", async () => {
    for (const pathname of ["/robots.txt", "/sitemap.xml", "/favicon.svg"]) {
      const res = await request(appWithoutSeo).get(pathname);

      expect(res.status).toBe(404);
      expect(res.text).not.toContain("SPA-INDEX");
    }
  });

  it("classifies SEO and API paths outside the SPA fallback", () => {
    expect(isSpaFallbackPath("/robots.txt")).toBe(false);
    expect(isSpaFallbackPath("/sitemap.xml")).toBe(false);
    expect(isSpaFallbackPath("/favicon.svg")).toBe(false);
    expect(isSpaFallbackPath("/api")).toBe(false);
    expect(isSpaFallbackPath("/api/meta")).toBe(false);
    expect(isSpaFallbackPath("/")).toBe(true);
    expect(isSpaFallbackPath("/dashboard")).toBe(true);
  });
});
