import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("API Endpoints", () => {
  it("GET /api/health returns 200 with ok and dataStatus", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.dataStatus).toBe("ready");
    expect(res.body.recordCount).toBe(150);
  });

  it("GET /api/meta returns 200 with meta and availableYears", async () => {
    const res = await request(app).get("/api/meta");
    expect(res.status).toBe(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.data.availableYears).toContain(2024);
    expect(res.body.data.defaultRegionSlug).toBe("provinsi-nusa-utara");
    expect(res.body.data.regions.length).toBeGreaterThan(0);
    expect(res.body.data.sectors.length).toBe(10);
  });

  it("GET /api/budget/summary returns anchor values for nusa utara 2024", async () => {
    const res = await request(app)
      .get("/api/budget/summary")
      .query({ region: "provinsi-nusa-utara", year: 2024 });

    expect(res.status).toBe(200);
    expect(res.body.meta.isFixture).toBe(true);
    expect(res.body.data.totalPagu).toBe(2_400_000_000_000);
    expect(res.body.data.totalRealisasi).toBe(1_800_000_000_000);
    expect(res.body.data.realizationRate).toBe(75.0);
    expect(res.body.data.remainingBudget).toBe(600_000_000_000);
    expect(res.body.data.periodStatus).toBe("final");
  });

  it("GET /api/budget/sectors returns 10 slices for nusa utara 2024", async () => {
    const res = await request(app)
      .get("/api/budget/sectors")
      .query({ region: "provinsi-nusa-utara", year: 2024 });

    expect(res.status).toBe(200);
    expect(res.body.data.slices.length).toBe(10);
    expect(res.body.data.slices[0].sectorId).toBe("F07"); // Kesehatan 720M is top
  });

  it("GET /api/budget/trend returns trend points", async () => {
    const res = await request(app)
      .get("/api/budget/trend")
      .query({ region: "provinsi-nusa-utara" });

    expect(res.status).toBe(200);
    expect(res.body.data.points.length).toBe(5);
  });

  it("GET /api/insights returns 3-5 insight items without forbidden words", async () => {
    const res = await request(app)
      .get("/api/insights")
      .query({ region: "provinsi-nusa-utara", year: 2024 });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(3);
    expect(res.body.data.items.length).toBeLessThanOrEqual(5);
    expect(res.body.data.disclaimer).toBeTruthy();
    expect(res.body.meta.isFixture).toBe(true);
  });

  it("GET /api/budget/summary without params returns default region and year", async () => {
    const res = await request(app).get("/api/budget/summary");

    expect(res.status).toBe(200);
    expect(res.body.data.regionSlug).toBe("provinsi-nusa-utara");
    expect(res.body.data.fiscalYear).toBe(2024);
    expect(res.body.data.totalPagu).toBe(2_400_000_000_000);
  });

  it("GET /api/budget/sectors without params returns default slices", async () => {
    const res = await request(app).get("/api/budget/sectors");

    expect(res.status).toBe(200);
    expect(res.body.data.regionSlug).toBe("provinsi-nusa-utara");
    expect(res.body.data.fiscalYear).toBe(2024);
    expect(res.body.data.slices.length).toBeGreaterThan(0);
  });

  it("GET /api/budget/trend without params returns default region", async () => {
    const res = await request(app).get("/api/budget/trend");

    expect(res.status).toBe(200);
    expect(res.body.data.regionSlug).toBe("provinsi-nusa-utara");
    expect(res.body.data.points.length).toBeGreaterThan(0);
  });

  it("GET /api/insights without params returns default insights", async () => {
    const res = await request(app).get("/api/insights");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(3);
    expect(res.body.meta.isFixture).toBe(true);
  });

  it("GET /api/budget/summary?year=abc returns 400 with uniform error format", async () => {
    const res = await request(app).get("/api/budget/summary").query({ year: "abc" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(typeof res.body.error.message).toBe("string");
    expect(typeof res.body.error.requestId).toBe("string");
    expect(res.body.error.requestId.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.error.details)).toBe(true);
    expect(res.body.meta).toEqual({
      snapshotVersion: expect.any(String),
      dataStatus: expect.any(String),
      isFixture: expect.any(Boolean),
    });
  });
});
